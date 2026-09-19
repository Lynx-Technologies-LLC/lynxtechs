---
title: "Servo Sin Torque Demo"
sidebar_position: 7
---

<!-- GENERATED - do not edit. Synced from lxmaster-demos by scripts/sync-examples.mjs. -->

# Servo Sin Torque Demo

# Servo Sine Torque Demo — CST sine motion

> Source: [servo_sin_torque_demo/main.cpp](https://github.com/Lynx-Technologies-LLC/lxmaster-demos/blob/main/servo_sin_torque_demo/main.cpp)

Drives a servo with a sinusoidal torque profile using Cyclic Synchronous Torque (CST) mode.

> **Warning:** In torque mode there is no position or velocity loop — the drive applies torque directly. An unloaded shaft will accelerate freely. Ensure the axis is safe to spin before running.

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
    ax->setDriveMode(lxmaster::DriveOpMode::Cst);
    ax->configure();
}
lxmaster::Axis* drive = net.axes().front();
```

Each axis is set to CST mode and walked to OPERATIONAL. The torque unit is per-mille of rated torque (1000 = 100% rated), so `kAmplitudePerMille = 100` means a peak of 10%.

---

### 3. Start

```cpp
net.start();
std::this_thread::sleep_for(std::chrono::milliseconds(50));

drive->applyTorque(0);
std::this_thread::sleep_for(period);
```

`net.start()` launches the real-time cyclic thread. Zero torque is commanded first so the profile ramps up from rest without a step.

---

### 4. Motion loop

```cpp
while (net.isRunning() && !g_interrupted) {
    const double t = std::chrono::duration<double>(now - start).count();
    drive->applyTorque(static_cast<int32_t>(
        kAmplitudePerMille * std::sin(kTwoPi * kFrequencyHz * t)));
    std::this_thread::sleep_for(period);
}
```

`applyTorque()` sends a target torque in per-mille units each cycle. The sine starts and ends at zero so there is no abrupt torque step at entry or exit.

---

### 5. Stop

```cpp
drive->applyTorque(0);
net.stop();
```

Torque is zeroed before shutdown so the drive is not left applying force when the bus goes down.

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

/* Target torque (0x6071) unit is per-mille of rated torque (1000 = rated). 100 = 10%. */
constexpr int32_t kAmplitudePerMille = 100;
constexpr double  kFrequencyHz       = 0.5;
constexpr int     kCycles            = 5;
constexpr double  kTwoPi             = 6.283185307179586;

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
    ax->setDriveMode(lxmaster::DriveOpMode::Cst);
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

  drive->applyTorque(0);
  std::this_thread::sleep_for(period);

  while (net.isRunning() && !g_interrupted) {
    const auto now = std::chrono::steady_clock::now();
    if (now >= deadline) break;

    const double t = std::chrono::duration<double>(now - start).count();
    drive->applyTorque(static_cast<int32_t>(kAmplitudePerMille * std::sin(kTwoPi * kFrequencyHz * t)));
    std::this_thread::sleep_for(period);
  }

  // --- 4. Stop ---
  drive->applyTorque(0);
  net.stop();
  return 0;
}
```
