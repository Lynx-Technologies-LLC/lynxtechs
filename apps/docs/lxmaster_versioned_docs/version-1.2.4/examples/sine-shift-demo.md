---
title: "Sine Shift Demo"
sidebar_position: 9
---

<!-- GENERATED - do not edit. Synced from lxmaster-demos by scripts/sync-examples.mjs. -->

# Sine Shift Demo

# Sine Shift Demo — servo sine + digital output bit walk

> Source: [sine_shift_demo/main.cpp](https://github.com/Lynx-Technologies-LLC/lxmaster-demos/blob/main/sine_shift_demo/main.cpp)

Runs a CSP sine on a servo drive and a 16-bit digital output bit walk on an I/O module simultaneously on the same EtherCAT bus.

---

### 1. Config & prepare

```cpp
lxmaster::NetworkConfig cfg = lxmaster::NetworkConfig::defaults();
cfg.eni.eni_path = "/home/user/myenifolder/myenifile.xml";

lxmaster::EcNetwork net(cfg);
net.prepare();
```

`NetworkConfig::defaults()` reads the EtherCAT interface name from the environment (set by `lxmaster host setup`). The ENI file describes the full bus — both the servo and the I/O module — and `prepare()` brings all slaves to PreOP.

---

### 2. Configure axis and IO module

```cpp
for (lxmaster::Axis* ax : net.axes()) {
    ax->setDriveMode(lxmaster::DriveOpMode::Csp);
    ax->configure();
}
lxmaster::Axis* drive = net.axes().front();

lxmaster::IoModule* io = nullptr;
for (lxmaster::IoModule* m : net.ioModules()) {
    if (m->digitalOutputCount() >= kNumBits) { io = m; break; }
}
io->configure();
```

Both the servo and the I/O module must have `configure()` called to be walked to OPERATIONAL. The servo is set to CSP mode; the I/O module just needs `configure()` since its outputs are written directly.

---

### 3. Start & latch home

```cpp
net.start();
std::this_thread::sleep_for(std::chrono::milliseconds(50));

const int32_t home = drive->actualPosition();
for (int ch = 0; ch < kNumBits; ++ch) io->writeDigital(ch, false);
drive->moveTo(home);
```

After starting the bus, the drive's current position is latched as the sine centre. All digital outputs are cleared and the drive is pre-positioned at home so the cosine profile begins without a step.

---

### 4. Combined loop

```cpp
while (net.isRunning() && !g_interrupted) {
    const double elapsed = ...; // seconds since start
    const int    bit     = static_cast<int>(elapsed / kBitIntervalS);

    if (bit != active_bit) {
        active_bit = bit;
        for (int ch = 0; ch < kNumBits; ++ch) io->writeDigital(ch, false);
        io->writeDigital(bit, true);
    }

    drive->moveTo(home + static_cast<int32_t>(
        0.5 * kAmplitudeCounts * (std::cos(kTwoPi * kFrequencyHz * elapsed) - 1.0)));
    std::this_thread::sleep_for(period);
}
```

Every cycle, both outputs are updated together: the active digital output bit advances once per second, and the servo receives a new position setpoint from the cosine function. Both happen in the same application loop — lxmaster applies them in the next EtherCAT frame.

---

### 5. Stop

```cpp
for (int ch = 0; ch < kNumBits; ++ch) io->writeDigital(ch, false);
drive->moveTo(home);
net.stop();
```

All outputs are cleared and the drive is returned to home before `net.stop()` shuts down the bus.

## Source: `main.cpp`

```cpp
#include <atomic>
#include <chrono>
#include <cmath>
#include <csignal>
#include <cstddef>
#include <cstdint>
#include <iostream>
#include <thread>
#include <vector>

#include <lxmaster/lxmaster.hpp>

static std::atomic<bool> g_interrupted{false};

constexpr int32_t kAmplitudeCounts = 50000;
constexpr double  kFrequencyHz     = 1.0;
constexpr int     kNumBits         = 16;
constexpr double  kBitIntervalS    = 1.0;
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

  // --- 2. Configure axis and IO module ---
  for (lxmaster::Axis* ax : axes) {
    ax->setDriveMode(lxmaster::DriveOpMode::Csp);
    ax->configure();
  }
  lxmaster::Axis* drive = axes.front();

  lxmaster::IoModule* io = nullptr;
  for (lxmaster::IoModule* m : net.ioModules()) {
    if (m->digitalOutputCount() >= static_cast<std::size_t>(kNumBits)) { io = m; break; }
  }
  if (!io) { std::cerr << "No IO module with >= " << kNumBits << " digital outputs.\n"; return 1; }
  io->configure();

  // --- 3. Start ---
  if (!net.start()) { std::cerr << "start failed: " << net.lastError() << "\n"; return 1; }
  std::this_thread::sleep_for(std::chrono::milliseconds(50));

  const int32_t home   = drive->actualPosition();
  const auto    period = std::chrono::nanoseconds(net.cycleTimeNs());
  for (int ch = 0; ch < kNumBits; ++ch) io->writeDigital(static_cast<std::size_t>(ch), false);
  drive->moveTo(home);

  // --- 4. Combined loop ---
  const auto start = std::chrono::steady_clock::now();
  int active_bit = -1;

  while (net.isRunning() && !g_interrupted) {
    const auto   now     = std::chrono::steady_clock::now();
    const double elapsed = std::chrono::duration<double>(now - start).count();
    const int    bit     = static_cast<int>(elapsed / kBitIntervalS);
    if (bit >= kNumBits) break;

    // advance the active output bit once per interval
    if (bit != active_bit) {
      active_bit = bit;
      for (int ch = 0; ch < kNumBits; ++ch) io->writeDigital(static_cast<std::size_t>(ch), false);
      io->writeDigital(static_cast<std::size_t>(bit), true);
      std::cout << "Bit " << bit << " ON\n";
    }

    // send sine position setpoint
    drive->moveTo(home + static_cast<int32_t>(0.5 * kAmplitudeCounts * (std::cos(kTwoPi * kFrequencyHz * elapsed) - 1.0)));
    std::this_thread::sleep_for(period);
  }

  // --- 5. Stop ---
  for (int ch = 0; ch < kNumBits; ++ch) io->writeDigital(static_cast<std::size_t>(ch), false);
  drive->moveTo(home);
  net.stop();
  return 0;
}
```
