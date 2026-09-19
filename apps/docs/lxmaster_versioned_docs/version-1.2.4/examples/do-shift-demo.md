---
title: "Do Shift Demo"
sidebar_position: 3
---

<!-- GENERATED - do not edit. Synced from lxmaster-demos by scripts/sync-examples.mjs. -->

# Do Shift Demo

# DO Shift Demo — digital output bit walk

> Source: [do_shift_demo/main.cpp](https://github.com/Lynx-Technologies-LLC/lxmaster-demos/blob/main/do_shift_demo/main.cpp)

Walks a single active bit across 16 digital outputs on a CiA401 I/O module, one bit per second.

---

### 1. Config & prepare

```cpp
lxmaster::NetworkConfig cfg = lxmaster::NetworkConfig::defaults();
cfg.eni.eni_path = "/home/user/myenifolder/myenifile.xml";

lxmaster::EcNetwork net(cfg);
net.prepare();
```

`NetworkConfig::defaults()` reads the EtherCAT interface name from the environment (set by `lxmaster host setup`). The ENI file describes the bus topology and PDO layout — `prepare()` parses it and brings all slaves to PreOP.

---

### 2. Find IO module & configure

```cpp
lxmaster::IoModule* mod = nullptr;
for (lxmaster::IoModule* m : net.ioModules()) {
    if (m->digitalOutputCount() >= kNumBits) { mod = m; break; }
}
mod->configure();
```

`net.ioModules()` returns every CiA401 I/O module found in the ENI. The first one with at least 16 digital outputs is selected. Calling `configure()` opts it into the OPERATIONAL bring-up — devices without `configure()` stay at PreOP.

---

### 3. Start

```cpp
net.start();
for (int ch = 0; ch < kNumBits; ++ch) mod->writeDigital(ch, false);
```

`net.start()` launches the real-time cyclic thread. All outputs are cleared to a known state before the walk begins.

---

### 4. Walk loop

```cpp
while (net.isRunning() && !g_interrupted) {
    const int bit = static_cast<int>(elapsed_seconds / kBitIntervalS);
    if (bit >= kNumBits) break;

    if (bit != active_bit) {
        active_bit = bit;
        for (int ch = 0; ch < kNumBits; ++ch) mod->writeDigital(ch, false);
        mod->writeDigital(bit, true);
    }
    std::this_thread::sleep_for(std::chrono::milliseconds(50));
}
```

The current bit index is derived from elapsed time. When it advances, all outputs are cleared and only the new bit is set high with `writeDigital()`. The loop polls at 50 ms — much slower than the EtherCAT cycle — because the bit interval is one full second.

---

### 5. Stop

```cpp
for (int ch = 0; ch < kNumBits; ++ch) mod->writeDigital(ch, false);
net.stop();
```

All outputs are cleared before `net.stop()` tears down the bus.

## Source: `main.cpp`

```cpp
#include <atomic>
#include <chrono>
#include <csignal>
#include <cstddef>
#include <iostream>
#include <thread>

#include <lxmaster/lxmaster.hpp>

static std::atomic<bool> g_interrupted{false};

constexpr int    kNumBits      = 16;
constexpr double kBitIntervalS = 1.0;

int main() {
  signal(SIGINT,  [](int){ g_interrupted = true; });
  signal(SIGTERM, [](int){ g_interrupted = true; });

  // --- 1. Config & prepare ---
  lxmaster::NetworkConfig cfg = lxmaster::NetworkConfig::defaults();
  cfg.eni.eni_path = "/home/user/myenifolder/myenifile.xml";

  lxmaster::EcNetwork net(cfg);
  if (!net.prepare()) { std::cerr << "prepare failed: " << net.lastError() << "\n"; return 1; }

  // --- 2. Find IO module & configure ---
  lxmaster::IoModule* mod = nullptr;
  for (lxmaster::IoModule* m : net.ioModules()) {
    if (m->digitalOutputCount() >= static_cast<std::size_t>(kNumBits)) { mod = m; break; }
  }
  if (!mod) { std::cerr << "No IO module with >= " << kNumBits << " digital outputs.\n"; return 1; }
  mod->configure();

  // --- 3. Start ---
  if (!net.start()) { std::cerr << "start failed: " << net.lastError() << "\n"; return 1; }
  for (int ch = 0; ch < kNumBits; ++ch) mod->writeDigital(static_cast<std::size_t>(ch), false);
  std::this_thread::sleep_for(std::chrono::milliseconds(50));

  // --- 4. Walk loop ---
  const auto start = std::chrono::steady_clock::now();
  int active_bit = -1;

  while (net.isRunning() && !g_interrupted) {
    const auto now = std::chrono::steady_clock::now();
    const int bit  = static_cast<int>(std::chrono::duration<double>(now - start).count() / kBitIntervalS);
    if (bit >= kNumBits) break;

    if (bit != active_bit) {
      active_bit = bit;
      for (int ch = 0; ch < kNumBits; ++ch) mod->writeDigital(static_cast<std::size_t>(ch), false);
      mod->writeDigital(static_cast<std::size_t>(bit), true);
      std::cout << "Bit " << bit << " ON\n";
    }
    std::this_thread::sleep_for(std::chrono::milliseconds(50));
  }

  // --- 5. Stop ---
  for (int ch = 0; ch < kNumBits; ++ch) mod->writeDigital(static_cast<std::size_t>(ch), false);
  net.stop();
  return 0;
}
```
