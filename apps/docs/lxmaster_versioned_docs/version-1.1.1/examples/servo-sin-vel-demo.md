---
title: "Servo Sin Vel Demo"
sidebar_position: 8
---

<!-- GENERATED - do not edit. Synced from lxmaster-demos by scripts/sync-examples.mjs. -->

# Servo Sin Vel Demo

# Servo Sine Velocity Demo — CSV sine motion

> Source: [servo_sin_vel_demo/main.cpp](https://github.com/Lynx-Technologies-LLC/lxmaster-demos/blob/main/servo_sin_vel_demo/main.cpp)

Moves a servo through a sinusoidal velocity profile using Cyclic Synchronous Velocity (CSV) mode.

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
    ax->setDriveMode(lxmaster::DriveOpMode::Csv);
    ax->configure();
}
lxmaster::Axis* drive = net.axes().front();
```

Each axis is set to CSV mode and walked to OPERATIONAL with `configure()`. In CSV mode the drive's internal position loop is replaced by its own velocity controller — the application supplies a velocity setpoint each cycle.

---

### 3. Start

```cpp
net.start();
std::this_thread::sleep_for(std::chrono::milliseconds(50));

drive->moveAtVelocity(0);
std::this_thread::sleep_for(period);
```

`net.start()` launches the real-time cyclic thread. Zero velocity is commanded before the timed loop begins so the drive starts from rest without a step.

---

### 4. Motion loop

```cpp
while (net.isRunning() && !g_interrupted) {
    const double t = std::chrono::duration<double>(now - start).count();
    drive->moveAtVelocity(static_cast<int32_t>(
        kAmplitudeCountsPerSec * std::sin(kTwoPi * kFrequencyHz * t)));
    std::this_thread::sleep_for(period);
}
```

`moveAtVelocity()` sends a target velocity in encoder counts per second each cycle. The sine starts and ends at zero, so there is no abrupt velocity step at entry or exit.

---

### 5. Stop

```cpp
drive->moveAtVelocity(0);
net.stop();
```

Velocity is zeroed before shutdown so the drive decelerates to rest before `net.stop()` tears down the bus.

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

constexpr int32_t kAmplitudeCountsPerSec = 100000;
constexpr double  kFrequencyHz           = 0.5;
constexpr int     kCycles                = 5;
constexpr double  kTwoPi                 = 6.283185307179586;

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
    ax->setDriveMode(lxmaster::DriveOpMode::Csv);
    ax->configure();
  }
  lxmaster::Axis* drive = axes.front();

  // --- 3. Start ---
  if (!net.start()) { std::cerr << "start failed: " << net.lastError() << "\n"; return 1; }
  std::this_thread::sleep_for(std::chrono::milliseconds(50));

  const auto period   = std::chrono::nanoseconds(net.cycleTimeNs());
  const auto start    = std::chrono::steady_clock::now();
  const auto deadline = start + std::chrono::duration_cast<std::chrono::nanoseconds>(
                            std::chrono::duration<double>(kCycles / kFrequencyHz));

  drive->moveAtVelocity(0);
  std::this_thread::sleep_for(period);

  while (net.isRunning() && !g_interrupted) {
    const auto now = std::chrono::steady_clock::now();
    if (now >= deadline) break;

    const double t = std::chrono::duration<double>(now - start).count();
    drive->moveAtVelocity(static_cast<int32_t>(kAmplitudeCountsPerSec * std::sin(kTwoPi * kFrequencyHz * t)));
    std::this_thread::sleep_for(period);
  }

  // --- 4. Stop ---
  drive->moveAtVelocity(0);
  net.stop();
  return 0;
}
```
