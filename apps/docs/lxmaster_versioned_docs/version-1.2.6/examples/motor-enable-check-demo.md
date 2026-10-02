---
title: "Motor Enable Check Demo"
sidebar_position: 5
---

<!-- GENERATED - do not edit. Synced from lxmaster-demos by scripts/sync-examples.mjs. -->

# Motor Enable Check Demo

# Motor Enable Check Demo — enable + brake/verification check

> Source: [motor_enable_check_demo/main.cpp](https://github.com/Lynx-Technologies-LLC/lxmaster-demos/blob/main/motor_enable_check_demo/main.cpp)

Enables a single axis and reports every software-observable signal LXMASTER has for whether that actually worked: did the drive reach Operation Enabled, and — with one small, safe verification step — is the shaft genuinely free to move.

There is no facade-level read of vendor safety objects (FSoE/STO/SBC): `Axis` and `CiA402DriveProfile` only expose the standard CiA402 set (statusword, position/velocity/torque, mode, enabled/faulted). So "is the brake released" is answered indirectly here — by commanding a small step and checking whether the shaft actually got there — rather than by reading a safety status bit directly.

---

### 1. Config & prepare (with logging on)

```cpp
lxmaster::NetworkConfig cfg = lxmaster::NetworkConfig::defaults();
cfg.eni.eni_path = "/home/user/myenifolder/myenifile.xml";
cfg.debug.enabled   = true;
cfg.debug.min_level = ecdev::LogLevel::Info;
cfg.debug.category_mask = static_cast<std::uint32_t>(ecdev::LogCat::Bringup) |
                           static_cast<std::uint32_t>(ecdev::LogCat::State) |
                           static_cast<std::uint32_t>(ecdev::LogCat::Coe);

lxmaster::EcNetwork net(cfg);
net.prepare();
```

Unlike the other demos, this one turns `cfg.debug` on by default (`Info`, categories `Bringup`/`State`/`Coe`). Since the whole point of this demo is diagnosing bring-up/enable problems, any AL-state timeout, rejected mailbox init command, or CoE abort during PRE-OP shows up in this same run instead of needing a second pass with logging enabled. Note that `Info`/`Debug`/`Trace` output requires a debug build of LXMASTER (`Error`/`Warn` are always compiled in) — see the "Errors, logging, and debugging" tutorial in the LXMASTER docs.

---

### 2. Configure the axis

```cpp
lxmaster::Axis* drive = axes.front();
drive->setDriveMode(lxmaster::DriveOpMode::Csp);
drive->configure();
```

Same as the other servo demos: CSP mode, `configure()` opts the axis into the OPERATIONAL bring-up.

---

### 3. Start & capture home

```cpp
net.start();
std::this_thread::sleep_for(std::chrono::milliseconds(50));
const int32_t home = drive->actualPosition();
```

---

### 4. Enable & watch for Operation Enabled

```cpp
drive->enable();
while (net.isRunning() && !g_interrupted) {
  if (drive->isEnabled()) { /* reached it */ break; }
  if (drive->isFaulted()) { /* faulted trying to get there */ break; }
  if (/* kEnableTimeout elapsed */) break;
  // print statusword()/modeDisplay()/isEnabled()/isFaulted() every 200ms
}
```

This is layer one: did the drive even reach *Operation Enabled*? If it faults or times out here, that alone is informative — a drive that can't leave `Switch On Disabled` (or that faults immediately) because a safety input is blocking it is a very different situation from one that enables cleanly but keeps a brake engaged mechanically.

---

### 5. Verification move

Only runs if step 4 succeeded:

```cpp
HoldResult step = holdTarget(net, drive, home + kVerifyStepCounts, kVerifyHoldSeconds);
HoldResult back = holdTarget(net, drive, home, kReturnHoldSeconds);
```

`holdTarget()` commands one fixed target every cycle for a fixed duration, printing `target`/`actual`/`followingError`/`torque` every 200ms, and returns the position where the hold ended. `kVerifyStepCounts` (2000 by default) is intentionally small — shrink it in `main.cpp` if your axis has a short travel range or fine encoder resolution.

---

### 6. Verdict

```cpp
const int32_t final_following_error = abs((home + kVerifyStepCounts) - step.end_position);
if (step.faulted) {
  // inconclusive -- check statusword / fault code
} else if (final_following_error <= kFollowingErrorOkCounts) {
  // shaft tracked the step -- brake appears released
} else {
  // shaft stayed near home despite the commanded step -- brake likely still engaged
}
```

`kFollowingErrorOkCounts` is `kVerifyStepCounts / 10` — a generous "close enough" band that scales if you change the step size. A large, persistent following error (the shaft never gets near the target) combined with `actualTorque()` climbing while nothing moves is the software signature of a mechanically blocked shaft — most likely a brake that never released.

---

### 7. Safe shutdown & report

```cpp
drive->moveTo(home);
drive->disable();
net.stop();
net.reportDeviceStatus(std::cout);
```

`reportDeviceStatus()` is always called, whichever way the run went — it prints the AL status and CiA402 fault code (`0x603F`), which is the fastest way to see *why* an enable attempt failed if step 4 timed out or faulted.

---

## Reading the output

- **Never reached Operation Enabled** → look at the `cfg.debug` bring-up log and the device status report first; this points at an AL/CoE/safety-input problem before the shaft is even in play.
- **Enabled, but the verification move shows a large following error and the shaft stayed near home** → strong signal something is still mechanically holding the shaft (a brake that didn't release being the prime suspect).
- **Enabled and the shaft tracked the step** → the axis is genuinely free to move; whatever was previously stopping motion is no longer in effect.

This demo does not know anything about *why* a brake would or wouldn't be engaged (FSoE/SBC, a hardwired STO-gated brake circuit, or a plain non-safety brake output) — it only reports what LXMASTER can see: did the drive enable, and did the shaft actually move when commanded.

## Source: `main.cpp`

```cpp
#include <atomic>
#include <chrono>
#include <cstdint>
#include <csignal>
#include <iomanip>
#include <iostream>
#include <thread>
#include <vector>

#include <lxmaster/lxmaster.hpp>

static std::atomic<bool> g_interrupted{false};

// --- Tunables -----------------------------------------------------------
// Small, conservative step used purely to check whether the shaft is actually
// free to move once the drive reports "enabled". Shrink this if your axis has
// a short travel range or fine encoder resolution.
constexpr int32_t kVerifyStepCounts = 2000;

constexpr auto kEnableTimeout    = std::chrono::seconds(5);
constexpr double kVerifyHoldSeconds = 1.5;
constexpr double kReturnHoldSeconds = 1.0;
constexpr auto kStatusPrintInterval = std::chrono::milliseconds(200);

// A following error at or below this (counts) after holding a target is
// treated as "got there". Scaled off the verification step itself so it
// stays sane if you change kVerifyStepCounts.
constexpr int32_t kFollowingErrorOkCounts = kVerifyStepCounts / 10;

namespace {

int32_t absInt32(int32_t v) { return v < 0 ? -v : v; }

void printEnableStatus(lxmaster::Axis* drive) {
  std::cout << "    statusword=0x" << std::hex << std::setw(4) << std::setfill('0')
            << drive->statusword() << std::dec << std::setfill(' ')
            << " mode=" << drive->modeDisplay()
            << " enabled=" << (drive->isEnabled() ? "true" : "false")
            << " faulted=" << (drive->isFaulted() ? "true" : "false") << "\n";
}

// Commands `target` every cycle for `duration_s`, printing status every
// kStatusPrintInterval. Returns the axis's actual position when the hold
// ended (either the duration elapsed, the drive faulted, or the run was
// interrupted/stopped).
struct HoldResult {
  int32_t start_position       = 0;
  int32_t end_position         = 0;
  int32_t max_abs_torque       = 0;
  bool    faulted              = false;
};

HoldResult holdTarget(lxmaster::EcNetwork& net, lxmaster::Axis* drive, int32_t target,
                      double duration_s) {
  HoldResult result;
  result.start_position = drive->actualPosition();
  result.end_position   = result.start_position;

  const auto period = std::chrono::nanoseconds(net.cycleTimeNs());
  const auto start   = std::chrono::steady_clock::now();
  auto next_print     = start;

  while (net.isRunning() && !g_interrupted) {
    const auto now = std::chrono::steady_clock::now();
    if (std::chrono::duration<double>(now - start).count() >= duration_s) break;

    drive->moveTo(target);

    const int32_t actual          = drive->actualPosition();
    const int32_t following_error = target - actual;
    const int32_t torque          = drive->actualTorque();
    if (absInt32(torque) > result.max_abs_torque) result.max_abs_torque = absInt32(torque);
    result.end_position = actual;

    if (drive->isFaulted()) {
      result.faulted = true;
      std::cout << "    target=" << target << " actual=" << actual
                << " followingError=" << following_error << " torque=" << torque
                << " FAULTED (statusword=0x" << std::hex << drive->statusword() << std::dec
                << ")\n";
      break;
    }

    if (now >= next_print) {
      std::cout << "    target=" << target << " actual=" << actual
                << " followingError=" << following_error << " torque=" << torque << "\n";
      next_print = now + kStatusPrintInterval;
    }

    std::this_thread::sleep_for(period);
  }

  return result;
}

}  // namespace

int main() {
  signal(SIGINT,  [](int){ g_interrupted = true; });
  signal(SIGTERM, [](int){ g_interrupted = true; });

  // --- 1. Config & prepare ---
  // cfg.debug is turned on so a bring-up problem (a rejected mailbox init
  // command, an AL-state timeout, a CoE abort, etc.) shows up in this run's
  // own output instead of needing a second pass with logging enabled.
  lxmaster::NetworkConfig cfg = lxmaster::NetworkConfig::defaults();
  cfg.eni.eni_path = "/home/user/myenifolder/myenifile.xml";
  cfg.debug.enabled   = true;
  cfg.debug.min_level = ecdev::LogLevel::Info;
  cfg.debug.category_mask = static_cast<std::uint32_t>(ecdev::LogCat::Bringup) |
                             static_cast<std::uint32_t>(ecdev::LogCat::State) |
                             static_cast<std::uint32_t>(ecdev::LogCat::Coe);

  lxmaster::EcNetwork net(cfg);
  if (!net.prepare()) { std::cerr << "prepare failed: " << net.lastError() << "\n"; return 1; }

  std::vector<lxmaster::Axis*> axes = net.axes();
  if (axes.empty()) { std::cerr << "No motion axes in ENI.\n"; return 1; }

  // --- 2. Configure axis ---
  lxmaster::Axis* drive = axes.front();
  drive->setDriveMode(lxmaster::DriveOpMode::Csp);
  drive->configure();

  // --- 3. Start & capture home ---
  if (!net.start()) { std::cerr << "start failed: " << net.lastError() << "\n"; return 1; }
  std::this_thread::sleep_for(std::chrono::milliseconds(50));

  const int32_t home = drive->actualPosition();
  std::cout << "Home position: " << home << " counts\n";

  // --- 4. Enable & watch for Operation Enabled ---
  std::cout << "Requesting enable...\n";
  drive->enable();

  bool reached_enabled = false;
  bool enable_faulted  = false;
  {
    const auto deadline   = std::chrono::steady_clock::now() + kEnableTimeout;
    auto       next_print = std::chrono::steady_clock::now();
    while (net.isRunning() && !g_interrupted) {
      const auto now = std::chrono::steady_clock::now();
      if (drive->isEnabled()) { reached_enabled = true; printEnableStatus(drive); break; }
      if (drive->isFaulted()) { enable_faulted = true; printEnableStatus(drive); break; }
      if (now >= deadline) { printEnableStatus(drive); break; }
      if (now >= next_print) {
        printEnableStatus(drive);
        next_print = now + kStatusPrintInterval;
      }
      std::this_thread::sleep_for(std::chrono::milliseconds(10));
    }
  }

  bool verified_moved = false;
  HoldResult step_result{};
  HoldResult back_result{};

  if (reached_enabled && net.isRunning() && !g_interrupted) {
    std::cout << "Enabled. Running verification move: "
              << "target=" << (home + kVerifyStepCounts) << " (home + " << kVerifyStepCounts
              << ")\n";

    // --- 5. Verification move ---
    step_result = holdTarget(net, drive, home + kVerifyStepCounts, kVerifyHoldSeconds);

    std::cout << "Returning to home: target=" << home << "\n";
    back_result = holdTarget(net, drive, home, kReturnHoldSeconds);

    // --- 6. Verdict ---
    const int32_t final_following_error = absInt32((home + kVerifyStepCounts) - step_result.end_position);
    const int32_t displacement           = absInt32(step_result.end_position - home);

    std::cout << "\n--- Verdict ---\n";
    if (step_result.faulted || back_result.faulted) {
      std::cout << "Drive FAULTED during the verification move. Inconclusive -- check the "
                   "statusword above and the CiA402 fault code (0x603F) in the device status "
                   "report below.\n";
    } else if (final_following_error <= kFollowingErrorOkCounts) {
      verified_moved = true;
      std::cout << "Shaft tracked the commanded motion (moved " << displacement
                << " counts, final following error " << final_following_error
                << " counts, max torque seen " << step_result.max_abs_torque
                << "). Brake appears released.\n";
    } else {
      std::cout << "Shaft did NOT reach the commanded position (moved only " << displacement
                << " of " << kVerifyStepCounts << " counts, final following error "
                << final_following_error << " counts, max torque seen "
                << step_result.max_abs_torque
                << "). Brake likely still engaged (or another mechanical block).\n";
    }
  } else if (enable_faulted) {
    std::cout << "\nDrive FAULTED while trying to enable -- see statusword above and the "
                 "CiA402 fault code (0x603F) in the device status report below.\n";
  } else if (!reached_enabled) {
    std::cout << "\nDrive did not reach Operation Enabled within "
              << kEnableTimeout.count() << "s -- see statusword above and the device status "
                 "report below.\n";
  }

  // --- 7. Safe shutdown ---
  if (net.isRunning()) {
    drive->moveTo(home);
    drive->disable();
  }
  net.stop();

  std::cout << "\n--- Device status report ---\n";
  net.reportDeviceStatus(std::cout);

  if (g_interrupted) { std::cout << "\nInterrupted.\n"; return 130; }
  return (reached_enabled && verified_moved) ? 0 : 1;
}
```
