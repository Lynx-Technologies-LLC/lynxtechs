---
title: "State Walk Demo"
sidebar_position: 11
---

<!-- GENERATED - do not edit. Synced from lxmaster-demos by scripts/sync-examples.mjs. -->

# State Walk Demo

# State Walk Demo — ESM state-machine walk

> Source: [state_walk_demo/main.cpp](https://github.com/Lynx-Technologies-LLC/lxmaster-demos/blob/main/state_walk_demo/main.cpp)

Walks one device, or every device in lock-step, through the EtherCAT ESM states INIT → PRE_OP → SAFE_OP → PRE_OP → INIT, pausing 2 seconds after each confirmed step. The device to walk is selected by a command-line argument: `0` walks the whole network together, `N` walks only device `N` (1-based bus position), and an out-of-range `N` is a hard error.

Unlike the other demos, this one talks to the bus through the lower-level `ecmaster::EcMaster` API instead of `lxmaster::EcNetwork`. `EcNetwork` only ever walks bring-up forward (to PRE_OP, then SAFE_OP/OP) for every slave together, with no way to target a single device or walk back down — exactly the two things this demo needs. `EcMaster`'s broadcast/subset primitives give us that, and they are installed and exported by the LXMASTER package the same way the `ecnet` facade headers are (`#include <ecmaster/ec_master.hpp>`).

---

### 1. Parse the device index

```cpp
const long parsed = std::strtol(argv[1], &endp, 10);
if (endp == argv[1] || *endp != '\0' || parsed < 0) {
  std::cerr << "error: device index must be a non-negative integer, got \"" << argv[1] << "\"\n\n";
  printUsage(argv[0]);
  return 1;
}
const std::uint16_t device_index = static_cast<std::uint16_t>(parsed);
```

A non-numeric or negative argument is rejected immediately. Range-checking against the live device count happens after the bus is scanned (step 3) — that's the only place the count is actually known.

---

### 2. Open the bus & discover devices

```cpp
ecmaster::EcMaster master;
master.init(ifname);          // ifname from LXMASTER_RT_IFACE
master.configInit(false);     // discovers slaves, reaches PRE_OP
const int device_count = master.slaveCount();
```

`configInit()` is the `EcMaster`-level equivalent of `EcNetwork::prepare()`'s bus-scan step: it discovers every slave and brings the whole network to PRE_OP, which is also the state every fresh bring-up needs before the walk can force it back down to INIT.

---

### 3. Validate the index & build the target list

```cpp
if (device_index > static_cast<std::uint16_t>(device_count)) {
  std::cerr << "error: device index " << device_index << " is out of range -- ...";
  return 1;
}

std::vector<std::uint16_t> targets;
if (device_index == 0) {
  for (std::uint16_t i = 1; i <= static_cast<std::uint16_t>(device_count); ++i) targets.push_back(i);
} else {
  targets = {device_index};
}
```

`targets` is the list of 1-based slave indices every subsequent state request is addressed to. Index `0` fills it with every device on the bus; any other in-range index narrows it to a single device. Every state transition below is written in terms of `targets`, so "walk all" and "walk one" are the same code path.

---

### 4. Walk INIT → PRE_OP → SAFE_OP → PRE_OP → INIT

```cpp
constexpr ecmaster::EcState kWalk[] = {
    ecmaster::EcState::Init, ecmaster::EcState::PreOp, ecmaster::EcState::SafeOp,
    ecmaster::EcState::PreOp, ecmaster::EcState::Init,
};

for (std::size_t step = 0; step < kWalkLen && !g_interrupted; ++step) {
  const ecmaster::EcState state = kWalk[step];
  bool ok = (state == ecmaster::EcState::SafeOp)
                ? master.ensureListedSafeOperational(targets)
                : walkToState(master, targets, state, /*timeout=*/std::chrono::milliseconds(5000));
  if (!ok) { /* print diagnostics, exit 1 */ }
  std::this_thread::sleep_for(kStepDelay);   // 2 s between steps
}
```

The INIT and PRE_OP legs use `walkToState()`, a small helper that calls `writeListedStateRequest(targets, state)` then polls `listedSlavesInState(targets, state)` — no process-data exchange needed, matching how `EcNetwork`'s own INIT/PRE_OP bring-up works. The SAFE_OP leg instead calls `ensureListedSafeOperational(targets)`, the one call that correctly walks a slave subset PRE_OP → SAFE_OP with the process-data exchange real hardware needs for that specific transition. Right before that leg, `configMap()` is called once (a soft-fail warning, not fatal, for mailbox-only devices with no PDOs) so the required SM2/SM3 sync managers are actually configured.

Ctrl+C sets an atomic flag that's checked between polling iterations and between steps, so the walk stops cleanly instead of leaving a request half-sent.

---

### 5. Exit

`ecmaster::EcMaster`'s destructor calls `close()`, so there is no explicit teardown call — every return path (success, validation error, transition timeout, or interrupt) leaves the bus in a clean state automatically.

## Source: `main.cpp`

```cpp
#include <atomic>
#include <chrono>
#include <csignal>
#include <cstdint>
#include <cstdlib>
#include <cstring>
#include <iostream>
#include <string>
#include <thread>
#include <vector>

#include <ecmaster/ec_master.hpp>

// Walks one device (or every device, in lock-step) through the EtherCAT ESM states
// INIT -> PRE_OP -> SAFE_OP -> PRE_OP -> INIT, pausing 2 seconds after each confirmed step.
//
// This demo talks to the bus through the lower-level ecmaster::EcMaster API rather than the
// lxmaster::EcNetwork facade: EcNetwork only ever walks bring-up forward (PRE_OP then SAFE_OP/OP)
// for every slave together, with no way to target a single device or walk back down. EcMaster's
// broadcast/subset state primitives (writeListedStateRequest / listedSlavesInState /
// ensureListedSafeOperational) give us exactly that, and they are installed + exported by the
// LXMASTER package the same way the ecnet facade headers are.

namespace {

std::atomic<bool> g_interrupted{false};

constexpr auto kStepDelay = std::chrono::seconds(2);
constexpr int  kStateConfirmTimeoutMs = 5000;

// The walk this demo performs: INIT -> PRE_OP -> SAFE_OP -> PRE_OP -> INIT.
constexpr ecmaster::EcState kWalk[] = {
    ecmaster::EcState::Init,
    ecmaster::EcState::PreOp,
    ecmaster::EcState::SafeOp,
    ecmaster::EcState::PreOp,
    ecmaster::EcState::Init,
};
constexpr std::size_t kWalkLen = sizeof(kWalk) / sizeof(kWalk[0]);

const char* stateName(ecmaster::EcState s) {
  switch (s) {
    case ecmaster::EcState::Init:   return "INIT";
    case ecmaster::EcState::PreOp:  return "PRE_OP";
    case ecmaster::EcState::SafeOp: return "SAFE_OP";
    case ecmaster::EcState::Op:     return "OP";
    default:                       return "?";
  }
}

void printUsage(const char* exe) {
  std::cerr
      << "Usage: " << exe << " <device-index>\n"
      << "\n"
      << "Walks one or all EtherCAT devices through INIT -> PRE_OP -> SAFE_OP -> PRE_OP -> INIT,\n"
      << "pausing 2 seconds after each state is confirmed.\n"
      << "\n"
      << "  device-index   0   walk every device on the network, in lock-step.\n"
      << "                 N   walk only device N (1-based bus position).\n"
      << "\n"
      << "The index must be within [0, device count] as discovered on the live network, or the\n"
      << "program prints an error and exits. The EtherCAT interface is taken from the\n"
      << "LXMASTER_RT_IFACE environment variable (set by 'sudo lxmaster host setup').\n";
}

// Broadcasts/writes an AL-state request to `targets` and polls for confirmation. Used for the
// INIT and PRE_OP legs of the walk, which (per ec_master.hpp) do not need a process-data exchange
// to confirm — matching how EcNetwork's own INIT/PRE_OP bring-up legs work.
bool walkToState(ecmaster::EcMaster& master, const std::vector<std::uint16_t>& targets,
                  ecmaster::EcState state, std::chrono::milliseconds timeout) {
  master.refreshStates();
  if (master.listedSlavesInState(targets, state)) return true;

  master.writeListedStateRequest(targets, state);

  const auto deadline = std::chrono::steady_clock::now() + timeout;
  while (std::chrono::steady_clock::now() < deadline) {
    if (g_interrupted) return false;
    std::this_thread::sleep_for(std::chrono::milliseconds(20));
    master.refreshStates();
    if (master.listedSlavesInState(targets, state)) return true;
  }
  return false;
}

// Prints per-slave AL-status diagnostics for whichever targets did not reach `want`.
void printTimeoutDiagnostics(ecmaster::EcMaster& master, const std::vector<std::uint16_t>& targets,
                             ecmaster::EcState want) {
  master.refreshStates();
  for (std::uint16_t idx : targets) {
    const ecmaster::SlaveInfo info = master.slaveInfo(idx);
    if (!info.valid || (info.state & 0x0FU) != static_cast<std::uint16_t>(want)) {
      std::cerr << "  " << ecmaster::formatSlaveAlStatus(static_cast<int>(idx), info) << "\n";
    }
  }
}

}  // namespace

int main(int argc, char* argv[]) {
  std::signal(SIGINT,  [](int) { g_interrupted = true; });
  std::signal(SIGTERM, [](int) { g_interrupted = true; });

  if (argc == 2 && (std::strcmp(argv[1], "-h") == 0 || std::strcmp(argv[1], "--help") == 0)) {
    printUsage(argv[0]);
    return 0;
  }
  if (argc != 2) {
    std::cerr << "error: expected exactly one argument, the device index.\n\n";
    printUsage(argv[0]);
    return 1;
  }

  // --- Parse the device index ---
  char* endp = nullptr;
  const long parsed = std::strtol(argv[1], &endp, 10);
  if (endp == argv[1] || *endp != '\0' || parsed < 0) {
    std::cerr << "error: device index must be a non-negative integer, got \"" << argv[1] << "\"\n\n";
    printUsage(argv[0]);
    return 1;
  }
  const std::uint16_t device_index = static_cast<std::uint16_t>(parsed);

  // --- Open the bus & discover devices ---
  const char* ifname = std::getenv("LXMASTER_RT_IFACE");
  if (ifname == nullptr || ifname[0] == '\0') {
    std::cerr << "error: LXMASTER_RT_IFACE is not set. Run 'sudo lxmaster host setup' first.\n";
    return 1;
  }

  ecmaster::EcMaster master;
  if (!master.init(ifname)) {
    std::cerr << "error: failed to open EtherCAT interface \"" << ifname << "\"";
    if (!master.initError().empty()) std::cerr << ": " << master.initError();
    std::cerr << "\n";
    return 1;
  }
  if (!master.configInit(false)) {
    std::cerr << "error: no EtherCAT devices found on \"" << ifname << "\"\n";
    return 1;
  }

  const int device_count = master.slaveCount();
  if (device_count <= 0) {
    std::cerr << "error: no EtherCAT devices found on \"" << ifname << "\"\n";
    return 1;
  }

  if (device_index > static_cast<std::uint16_t>(device_count)) {
    std::cerr << "error: device index " << device_index << " is out of range -- the network has "
              << device_count << " device(s); valid indices are 0 (all) through " << device_count
              << ".\n";
    return 1;
  }

  std::vector<std::uint16_t> targets;
  std::string label;
  if (device_index == 0) {
    targets.reserve(static_cast<std::size_t>(device_count));
    for (std::uint16_t i = 1; i <= static_cast<std::uint16_t>(device_count); ++i) targets.push_back(i);
    label = "all " + std::to_string(device_count) + " device(s)";
  } else {
    targets = {device_index};
    label = "device " + std::to_string(device_index);
  }

  std::cout << "Walking " << label << " through INIT -> PRE_OP -> SAFE_OP -> PRE_OP -> INIT "
            << "(2 s between steps)...\n";

  bool process_data_mapped = false;

  for (std::size_t step = 0; step < kWalkLen && !g_interrupted; ++step) {
    const ecmaster::EcState state = kWalk[step];
    bool ok = false;

    if (state == ecmaster::EcState::SafeOp) {
      // SM2/SM3 must be configured before PRE_OP -> SAFE_OP is a legal transition. Map process
      // data lazily, right before this leg, while the targets are already sitting in PRE_OP from
      // the previous step -- mirroring the order EcNetwork's own bring-up uses. A device with no
      // process data at all can still legitimately reach SAFE_OP, so a mapping failure is a
      // warning, not fatal.
      if (!process_data_mapped) {
        if (!master.configMap(ecmaster::kDefaultIoMapBytes)) {
          std::cerr << "warning: no process data mapped (mailbox-only device?) -- attempting "
                       "SAFE_OP anyway\n";
        }
        process_data_mapped = true;
      }
      ok = master.ensureListedSafeOperational(targets);
    } else {
      ok = walkToState(master, targets, state,
                        std::chrono::milliseconds(kStateConfirmTimeoutMs));
    }

    if (!ok) {
      if (g_interrupted) break;
      std::cerr << "error: " << label << " failed to reach " << stateName(state) << "\n";
      printTimeoutDiagnostics(master, targets, state);
      return 1;
    }

    std::cout << "  [" << (step + 1) << "/" << kWalkLen << "] " << label << " reached "
              << stateName(state) << "\n";

    if (step + 1 < kWalkLen && !g_interrupted) {
      std::this_thread::sleep_for(kStepDelay);
    }
  }

  if (g_interrupted) {
    std::cout << "Interrupted.\n";
    return 130;
  }

  std::cout << "Walk complete.\n";
  return 0;
}
```
