---
title: "Servo Sin Demo"
sidebar_position: 6
---

<!-- GENERATED - do not edit. Synced from lxmaster-demos by scripts/sync-examples.mjs. -->

# Servo Sin Demo

# Servo Sine Demo — CSP sine motion

> Source: [servo_sin_demo/main.cpp](https://github.com/Lynx-Technologies-LLC/lxmaster-demos/blob/main/servo_sin_demo/main.cpp)

Moves a servo in a sinusoidal position profile using Cyclic Synchronous Position (CSP) mode.

---

### 1. Config & prepare

```cpp
lxmaster::NetworkConfig cfg = lxmaster::NetworkConfig::defaults();
cfg.eni.eni_path = "/home/user/myenifolder/myenifile.xml";

lxmaster::EcNetwork net(cfg);
net.prepare();
```

`NetworkConfig::defaults()` reads the EtherCAT interface name from the environment (set by `lxmaster host setup`). The ENI file describes the bus topology, PDO layout, and cycle time — `prepare()` parses it and brings all slaves to PreOP.

---

### 2. Configure axes

```cpp
for (lxmaster::Axis* ax : net.axes()) {
    ax->setDriveMode(lxmaster::DriveOpMode::Csp);
    ax->configure();
}
lxmaster::Axis* drive = net.axes().front();
```

`net.axes()` returns every servo drive found in the ENI. Each axis is told to use CSP mode and then `configure()` is called to walk it up to OPERATIONAL. The first drive is held for commanding.

---

### 3. Start & latch home position

```cpp
net.start();
std::this_thread::sleep_for(std::chrono::milliseconds(50));

const int32_t home   = drive->actualPosition();
const auto    period = std::chrono::nanoseconds(net.cycleTimeNs());
```

`net.start()` launches the real-time EtherCAT cyclic thread. A short sleep lets the first few cycles complete so `actualPosition()` returns a valid encoder reading. The cycle period comes from the ENI and is used to pace the command loop.

---

### 4. Motion loop

```cpp
while (net.isRunning() && !g_interrupted) {
    const double t = std::chrono::duration<double>(now - start).count();
    drive->moveTo(home + static_cast<int32_t>(
        0.5 * kAmplitudeCounts * (std::cos(kTwoPi * kFrequencyHz * t) - 1.0)));
    std::this_thread::sleep_for(period);
}
```

Each iteration computes the cosine-based position setpoint and sends it to the drive with `moveTo()`. The cosine starts at 1, so at `t=0` the setpoint equals `home` — no step on entry. The loop runs until the deadline, Ctrl-C, or a bus fault.

---

### 5. Stop

```cpp
drive->moveTo(home);
net.stop();
```

The drive is returned to the home position before `net.stop()` tears down the cyclic thread and transitions all slaves back to INIT.

## Source: `main.cpp`

```cpp
#include <atomic>
#include <chrono>
#include <cmath>
#include <csignal>
#include <cstdint>
#include <iostream>
#include <thread>
#include <vector>

#include <lxmaster/lxmaster.hpp>

static std::atomic<bool> g_interrupted{false};

constexpr int32_t kAmplitudeCounts = 10000;
constexpr double  kFrequencyHz     = 0.5;
constexpr int     kCycles          = 5;
constexpr double  kTwoPi           = 6.283185307179586;

int main() {
  signal(SIGINT,  [](int){ g_interrupted = true; });
  signal(SIGTERM, [](int){ g_interrupted = true; });

  // --- 1. Config & prepare ---
  lxmaster::NetworkConfig cfg = lxmaster::NetworkConfig::defaults();
  cfg.eni.eni_path = "/home/user/myenifolder/myenifile.xml";

  lxmaster::EcNetwork net(cfg);
  if (!net.prepare()) { std::cerr << "prepare failed: " << net.lastError() << "\n"; return 1; }

  std::vector<lxmaster::Axis*> axes = net.axes();
  if (axes.empty()) { std::cerr << "No motion axes in ENI.\n"; return 1; }

  // --- 2. Configure axes ---
  for (lxmaster::Axis* ax : axes) {
    ax->setDriveMode(lxmaster::DriveOpMode::Csp);
    ax->configure();
  }
  lxmaster::Axis* drive = axes.front();

  // --- 3. Start ---
  if (!net.start()) { std::cerr << "start failed: " << net.lastError() << "\n"; return 1; }
  std::this_thread::sleep_for(std::chrono::milliseconds(50));

  const int32_t home     = drive->actualPosition();
  const auto    period   = std::chrono::nanoseconds(net.cycleTimeNs());
  const auto    start    = std::chrono::steady_clock::now();
  const auto    deadline = start + std::chrono::duration_cast<std::chrono::nanoseconds>(
                               std::chrono::duration<double>(kCycles / kFrequencyHz));

  while (net.isRunning() && !g_interrupted) {
    const auto now = std::chrono::steady_clock::now();
    if (now >= deadline) break;

    const double t = std::chrono::duration<double>(now - start).count();
    drive->moveTo(home + static_cast<int32_t>(0.5 * kAmplitudeCounts * (std::cos(kTwoPi * kFrequencyHz * t) - 1.0)));
    std::this_thread::sleep_for(period);
  }

  // --- 4. Stop ---
  drive->moveTo(home);
  net.stop();
  return 0;
}
```
