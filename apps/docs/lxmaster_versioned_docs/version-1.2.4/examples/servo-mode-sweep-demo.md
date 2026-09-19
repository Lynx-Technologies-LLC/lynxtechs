---
title: "Servo Mode Sweep Demo"
sidebar_position: 5
---

<!-- GENERATED - do not edit. Synced from lxmaster-demos by scripts/sync-examples.mjs. -->

# Servo Mode Sweep Demo

# Servo Mode Sweep Demo — live CSP / CSV / CST mode switch

> Source: [servo_mode_sweep_demo/main.cpp](https://github.com/Lynx-Technologies-LLC/lxmaster-demos/blob/main/servo_mode_sweep_demo/main.cpp)

Sweeps a single drive through all three cyclic CiA402 operating modes — position, velocity, and torque — back-to-back without leaving OPERATIONAL.

This example shows how to switch a drive from one control mode to another mid-execution. `setDriveMode()` updates the modes-of-operation PDO (0x6060) live — no bus restart or re-homing is required. The zeroing and settle steps shown before each switch are not an API requirement; they are a safety practice to avoid a large command discontinuity (e.g. a high position error or a sudden torque spike) that could trip a drive fault at the moment the new mode takes over.

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

### 2. `runPhase` and `settle` helpers

```cpp
static bool runPhase(lxmaster::EcNetwork& net, double duration,
                     const std::function<void(TimePoint, TimePoint)>& command) { ... }

static void settle(lxmaster::EcNetwork& net, double seconds) { ... }
```

`runPhase` runs a caller-supplied command lambda every EtherCAT cycle for a fixed duration. `settle` idles for a short period between mode changes so the drive reaches a neutral setpoint before the next mode takes over. Both helpers check `net.isRunning()` so they stop cleanly on a bus fault.

---

### 3. Configure axes & start

```cpp
for (lxmaster::Axis* ax : net.axes()) {
    ax->setDriveMode(lxmaster::DriveOpMode::Csp);
    ax->configure();
}
lxmaster::Axis* drive = net.axes().front();
net.start();
const int32_t home = drive->actualPosition();
```

All axes start in CSP mode (required for initial bring-up). After `net.start()` the home position is latched so the position phase can oscillate around it.

---

### 4. Phase 1 — CSP (position)

```cpp
drive->setDriveMode(lxmaster::DriveOpMode::Csp);
drive->moveTo(home);
runPhase(net, phaseS, [&](TimePoint now, TimePoint start) {
    const double wt = kTwoPi * kFrequencyHz * elapsedS(now, start);
    drive->moveTo(home + static_cast<int32_t>(
        0.5 * kPositionAmplitudeCounts * (std::cos(wt) - 1.0)));
});
```

The drive oscillates around its home position for `kCyclesPerPhase` full cycles. `setDriveMode()` updates the modes-of-operation PDO (0x6060) live without leaving OPERATIONAL.

---

### 5. Phase 2 — CSV (velocity)

```cpp
drive->moveTo(home);
settle(net, kSettleSeconds);
drive->setDriveMode(lxmaster::DriveOpMode::Csv);
drive->moveAtVelocity(0);
runPhase(net, phaseS, [&](TimePoint now, TimePoint start) {
    const double wt = kTwoPi * kFrequencyHz * elapsedS(now, start);
    drive->moveAtVelocity(static_cast<int32_t>(kVelocityAmplitudeCntsSec * std::sin(wt)));
});
```

Before switching modes the drive is returned to a neutral setpoint and given a moment to settle. This prevents a large position error or velocity spike from becoming a fault the instant CSV takes over — it is a safety practice, not an API requirement.

---

### 6. Phase 3 — CST (torque)

```cpp
drive->moveAtVelocity(0);
settle(net, kSettleSeconds);
drive->setDriveMode(lxmaster::DriveOpMode::Cst);
drive->applyTorque(0);
runPhase(net, phaseS, [&](TimePoint now, TimePoint start) {
    const double wt = kTwoPi * kFrequencyHz * elapsedS(now, start);
    drive->applyTorque(static_cast<int32_t>(kTorqueAmplitudePerMille * std::sin(wt)));
});
```

Same pattern: zero velocity and settle before switching to CST, for the same safety reason — preventing a torque discontinuity at the moment the mode changes.

---

### 7. Stop

```cpp
drive->applyTorque(0);
drive->moveAtVelocity(0);
net.stop();
```

Both torque and velocity are zeroed before shutdown to leave the drive in a safe state.

## Source: `main.cpp`

```cpp
#include <atomic>
#include <chrono>
#include <cmath>
#include <csignal>
#include <cstdint>
#include <functional>
#include <iostream>
#include <thread>
#include <vector>

#include <lxmaster/lxmaster.hpp>

static std::atomic<bool> g_interrupted{false};

constexpr double  kFrequencyHz             = 1.0;
constexpr int     kCyclesPerPhase          = 5;
constexpr int32_t kPositionAmplitudeCounts = 50000;
constexpr int32_t kVelocityAmplitudeCntsSec = 100000;
constexpr int32_t kTorqueAmplitudePerMille = 50;
constexpr double  kSettleSeconds           = 0.5;
constexpr double  kTwoPi                   = 6.283185307179586;

using TimePoint = std::chrono::steady_clock::time_point;

static double elapsedS(TimePoint now, TimePoint start) {
  return std::chrono::duration<double>(now - start).count();
}

/** Run `command` each EtherCAT cycle for `duration` seconds. Returns false if interrupted. */
static bool runPhase(lxmaster::EcNetwork& net, double duration,
                     const std::function<void(TimePoint, TimePoint)>& command) {
  const auto period = std::chrono::nanoseconds(net.cycleTimeNs());
  const auto start  = std::chrono::steady_clock::now();
  while (net.isRunning() && !g_interrupted) {
    const auto now = std::chrono::steady_clock::now();
    if (elapsedS(now, start) >= duration) break;
    command(now, start);
    std::this_thread::sleep_for(period);
  }
  return net.isRunning() && !g_interrupted;
}

/** Idle for `seconds` so the drive settles before switching operating mode. */
static void settle(lxmaster::EcNetwork& net, double seconds) {
  const auto period = std::chrono::nanoseconds(net.cycleTimeNs());
  const auto start  = std::chrono::steady_clock::now();
  while (net.isRunning() && !g_interrupted) {
    if (elapsedS(std::chrono::steady_clock::now(), start) >= seconds) break;
    std::this_thread::sleep_for(period);
  }
}

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

  const int32_t home   = drive->actualPosition();
  const double  phaseS = kCyclesPerPhase / kFrequencyHz;

  // Phase 1: CSP — sinusoidal position around home
  drive->setDriveMode(lxmaster::DriveOpMode::Csp);
  drive->moveTo(home);
  runPhase(net, phaseS, [&](TimePoint now, TimePoint start) {
    const double wt = kTwoPi * kFrequencyHz * elapsedS(now, start);
    drive->moveTo(home + static_cast<int32_t>(0.5 * kPositionAmplitudeCounts * (std::cos(wt) - 1.0)));
  });

  // Phase 2: CSV — sinusoidal velocity (starts and ends at zero)
  drive->moveTo(home);
  settle(net, kSettleSeconds);
  drive->setDriveMode(lxmaster::DriveOpMode::Csv);
  drive->moveAtVelocity(0);
  runPhase(net, phaseS, [&](TimePoint now, TimePoint start) {
    const double wt = kTwoPi * kFrequencyHz * elapsedS(now, start);
    drive->moveAtVelocity(static_cast<int32_t>(kVelocityAmplitudeCntsSec * std::sin(wt)));
  });

  // Phase 3: CST — sinusoidal torque (starts and ends at zero)
  drive->moveAtVelocity(0);
  settle(net, kSettleSeconds);
  drive->setDriveMode(lxmaster::DriveOpMode::Cst);
  drive->applyTorque(0);
  runPhase(net, phaseS, [&](TimePoint now, TimePoint start) {
    const double wt = kTwoPi * kFrequencyHz * elapsedS(now, start);
    drive->applyTorque(static_cast<int32_t>(kTorqueAmplitudePerMille * std::sin(wt)));
  });

  // --- 4. Stop ---
  drive->applyTorque(0);
  drive->moveAtVelocity(0);
  net.stop();
  return 0;
}
```
