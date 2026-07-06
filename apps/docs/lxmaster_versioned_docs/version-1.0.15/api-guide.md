---
sidebar_position: 6
title: API Guide
---

# LXMASTER API Guide

:::caution
This page is a narrative guide and may lag behind the latest release. For the authoritative and up-to-date interface, refer to the [C++ API Reference](/lxmaster/api).
:::

The entire library is consumed through a single umbrella header and the flat
`lxmaster::` namespace alias:

```cpp
#include <lxmaster/lxmaster.hpp>
```

No other headers are needed for application code. Link against
`lxmaster::lxmaster` from CMake:

```cmake
find_package(lxmaster CONFIG REQUIRED)
target_link_libraries(my_app PRIVATE lxmaster::lxmaster)
```

---

## `NetworkConfig`

`lxmaster::NetworkConfig` holds every knob for a network session. Most programs
start from `NetworkConfig::defaults()`, which reads the per-host environment
written by `lxmaster host setup`, and only override the ENI path:

```cpp
lxmaster::NetworkConfig cfg = lxmaster::NetworkConfig::defaults();
cfg.eni.eni_path = "network.eni.xml";   // required
```

`defaults()` sources the following from the host config
(`/etc/profile.d/lxmaster-config.sh`):

| Env var | `NetworkConfig` field | Effect |
| --- | --- | --- |
| `LXMASTER_RT_IFACE` | `bus.ifname` | EtherCAT NIC name |
| `LXMASTER_RT_CPU` | `rt.cpu_affinity` | RT thread CPU index |
| `LXMASTER_RT_PRIORITY` | `rt.rt_priority` | SCHED_FIFO priority (default 49) |
| `LXMASTER_EC_SYNC_TO_DC` | `dc.ec_sync_to_dc` | DC alignment gate |
| `LXMASTER_DC_SYNC_KP_DIV` | `dc.dc_sync_kp_div` | DC-sync PI proportional divisor |
| `LXMASTER_DC_SYNC_KI_DIV` | `dc.dc_sync_ki_div` | DC-sync PI integral divisor |

### Sub-config structs

**`EniConfig`** — ENI (EtherCAT Network Information) file:

```cpp
cfg.eni.eni_path = "/path/to/network.eni.xml";  // required; generate with lxmaster eni gen
```

The cyclic period (`bus.cycle_ns`) and sync mode (DC/SM-event) are read from
the ENI — not from code. There is no code override.

**`BusConfig`** — raw network parameters (usually left at defaults):

```cpp
cfg.bus.ifname = "eth0";  // EtherCAT NIC; normally from LXMASTER_RT_IFACE
```

**`RtConfig`** — real-time scheduling:

```cpp
cfg.rt.enable_rt_scheduling = true;  // set false for dev/testing without root
cfg.rt.rt_priority          = 49;    // SCHED_FIFO priority
cfg.rt.cpu_affinity         = 3;     // pin the cyclic thread to CPU 3 (-1 = no pin)
```

**`DcConfig`** — distributed-clock tuning (rarely changed in application code):

```cpp
cfg.dc.dc_sync_kp_div = 3;   // PI proportional divisor (larger = less aggressive)
cfg.dc.dc_sync_ki_div = 20;  // PI integral divisor
cfg.dc.dc_lock_warmup_cycles = 200;  // cycles before allowing OP entry
```

**`DebugConfig`** — logging:

```cpp
cfg.debug.enabled  = true;              // enable logging (off by default)
cfg.debug.log_file = "/tmp/lxm.log";   // empty = stderr/stdout
```

**`on_bus_fault`** — fault notification callback:

```cpp
cfg.on_bus_fault = [](const lxmaster::BusFault& fault) {
    std::cerr << "Bus fault: " << fault.description << "\n";
    // Safe to call EcNetwork::stop() from here (runs on a detached helper thread).
};
```

**`extra_profile_factories`** — register a custom device class without the
static `LXMASTER_REGISTER_DEVICE` macro (see [Custom device profiles](#custom-device-profiles)):

```cpp
cfg.extra_profile_factories.push_back(
    ecdev::makeIdentityProfileFactory(
        ecdev::DeviceIdentityMatch{kVendorId, kProductCode},
        MyProfile::make,
        "vendor:my-device"));
```

---

## `EcNetwork`

`lxmaster::EcNetwork` owns the EtherCAT master, the cyclic RT thread, and every
device handle. It is non-copyable.

### Lifecycle

```cpp
lxmaster::EcNetwork net(cfg);
```

**One-step bring-up** (most programs):

```cpp
if (!net.start()) {
    std::cerr << net.lastError() << "\n";
    return 1;
}
// ... run ...
net.stop();
```

**Two-step bring-up** — use this when you need to inspect discovered devices
and configure them (e.g. choose operating mode) before committing:

```cpp
// Step 1: load ENI, open NIC, reach PRE_OP, bind devices.
if (!net.prepare()) {
    std::cerr << net.lastError() << "\n";
    return 1;
}

// axes() / ioModules() / encoders() / devices() are valid here.
for (lxmaster::Axis* ax : net.axes()) {
    ax->setDriveMode(lxmaster::DriveOpMode::Csp);
    ax->configure();  // raise this axis to OPERATIONAL
}

// Step 2: commit modes, reach OPERATIONAL, spawn the cyclic thread.
if (!net.start()) {
    std::cerr << net.lastError() << "\n";
    return 1;
}
```

:::note
`start()` calls `prepare()` automatically when it has not run, so the single-step
form is safe. Calling `prepare()` after `start()` is an error.
:::

### Method reference

| Method | Description |
| --- | --- |
| `bool prepare()` | Phase 1: load ENI, open NIC, reach PRE_OP, bind devices. Returns `false` on failure. |
| `bool start()` | Phase 2 (calls `prepare()` if needed): configure DC, reach OP, spawn cyclic thread. |
| `void stop()` | Stop the cyclic thread and close the master. Safe to call multiple times. |
| `bool isRunning()` | `true` while the cyclic thread is live. |
| `std::uint32_t cycleTimeNs()` | Cyclic period in ns from the ENI. Valid after `start()`. |
| `std::string lastError()` | Last error string (thread-safe). |
| `std::uint64_t cycleCount()` | Total RT cycles since `start()`. |
| `void reportDeviceStatus(std::ostream&)` | Print per-device exit status. Call after `stop()`. |

### Device accessors

Call these after `prepare()` or `start()`:

```cpp
std::vector<lxmaster::Axis*>          axes       = net.axes();
std::vector<lxmaster::IoModule*>      ioModules  = net.ioModules();
std::vector<lxmaster::Encoder*>       encoders   = net.encoders();
std::vector<lxmaster::GenericDevice*> devices    = net.devices();
```

`devices()` is the complete set of profile-carrying slaves. A device also
appears in its typed list (`axes()`, etc.) when it implements that capability.
Use `devices()` for device classes that fit none of the typed contracts (e.g. an
IMU).

### Diagnostics

```cpp
EcNetwork::JitterStats  js = net.jitterStats();   // cyclic timing
EcNetwork::DcSyncStats  dc = net.dcSyncStats();   // DC alignment
```

Both are updated throughout the run and finalized at `stop()`.

---

## `Axis`

`lxmaster::Axis` is the motion handle — analogous to a TwinCAT NC axis. It wraps
a CiA402 profile (or any custom profile implementing `IMotionProfile`). Use it
from the application thread; all methods are RT-safe (lock-free backing).

### Operating modes

Set the operating mode between `prepare()` and `start()` (or live, if the ENI
maps object 0x6060 into the RxPDO):

```cpp
ax->setDriveMode(lxmaster::DriveOpMode::Csp);  // Cyclic Synchronous Position
ax->setDriveMode(lxmaster::DriveOpMode::Csv);  // Cyclic Synchronous Velocity
ax->setDriveMode(lxmaster::DriveOpMode::Cst);  // Cyclic Synchronous Torque
```

| Enum value | Mode | Command method |
| --- | --- | --- |
| `DriveOpMode::Csp` | Cyclic Synchronous Position | `moveTo(counts)` |
| `DriveOpMode::Csv` | Cyclic Synchronous Velocity | `moveAtVelocity(counts_per_sec)` |
| `DriveOpMode::Cst` | Cyclic Synchronous Torque | `applyTorque(per_mille_rated)` |

### Commands

```cpp
ax->enable();                    // power up, hold position
ax->disable();                   // power down gracefully
ax->resetFault();                // clear a latched fault (one-shot)

ax->moveTo(pos);                 // CSP: absolute target in encoder counts
ax->moveAtVelocity(vel);         // CSV: velocity in counts/s
ax->applyTorque(tm);             // CST: torque in per-mille of rated
```

### Status

```cpp
std::int32_t  pos     = ax->actualPosition();    // encoder counts
std::int32_t  cmd     = ax->commandedPosition();
std::int32_t  vel     = ax->actualVelocity();
std::int32_t  torque  = ax->actualTorque();      // per-mille; 0 if unmapped
std::int32_t  modeDisp = ax->modeDisplay();      // 0x6061 (8=CSP,9=CSV,10=CST)
bool          enabled  = ax->isEnabled();
bool          faulted  = ax->isFaulted();
std::uint16_t sw       = ax->statusword();       // raw CiA402 statusword
std::string   nm       = ax->name();             // ENI slave name
```

### Typical CSP pattern

```cpp
// After net.start():
std::this_thread::sleep_for(std::chrono::milliseconds(50));
const std::int32_t hold = ax->actualPosition();

while (net.isRunning()) {
    ax->moveTo(computeTarget());
    std::this_thread::sleep_for(std::chrono::nanoseconds(net.cycleTimeNs()));
}
```

---

## `IoModule`

`lxmaster::IoModule` wraps a digital/analog I/O device (e.g. the LXDIO33-16).
All channel indices are zero-based.

### Introspection

```cpp
std::size_t di = mod->digitalInputCount();
std::size_t dout = mod->digitalOutputCount();
std::size_t ai  = mod->analogInputCount();
std::size_t aout = mod->analogOutputCount();
std::string nm  = mod->name();
```

### Digital I/O

```cpp
bool state = mod->readDigital(channel);          // read a digital input
bool out   = mod->digitalOutputState(channel);   // read back a digital output
mod->writeDigital(channel, true);                // write a digital output
```

### Analog I/O

```cpp
std::int32_t val = mod->readAnalog(channel);     // read an analog input
std::int32_t out = mod->analogOutputState(channel);
mod->writeAnalog(channel, value);
```

### Typical pattern

```cpp
// After net.prepare(), opt the module into OPERATIONAL:
mod->configure();

// After net.start(), clear all outputs then walk through channels:
for (std::size_t ch = 0; ch < mod->digitalOutputCount(); ++ch)
    mod->writeDigital(ch, false);

mod->writeDigital(3, true);  // channel 3 high
```

---

## `Encoder`

`lxmaster::Encoder` wraps a CiA 406 encoder device.

```cpp
std::int32_t  pos    = enc->position();   // encoder counts
std::int32_t  vel    = enc->velocity();
std::uint16_t status = enc->status();
std::string   nm     = enc->name();
```

---

## `GenericDevice`

Use `lxmaster::GenericDevice` for any device that is neither an axis, an I/O
module, nor an encoder — for example a custom IMU, gateway, or any vendor device
with a bespoke profile.

```cpp
// After net.prepare():
for (lxmaster::GenericDevice* d : net.devices()) {
    ecdev::IDeviceProfile* p = d->deviceProfile();
    if (p && std::strcmp(p->profileName(), "vendor:imu") == 0) {
        d->configure();   // raise to OPERATIONAL
        imu = static_cast<ImuProfile*>(p);
    }
}
```

:::note No RTTI
The cyclic runtime is compiled without RTTI. Never use `dynamic_cast` on the
device path. Guard on `profileName()` and `static_cast` exactly once at setup;
cache the typed pointer.
:::

---

## Custom device profiles

LXMASTER allows you to bind a custom profile to any slave identified by vendor
ID + product code.

### Option A — extend a built-in profile

Subclass the built-in CiA402 drive profile to inherit the full motion contract,
then add vendor-specific PDO variables:

```cpp
#include "devices/cia402_drive_profile.hpp"
#include "devices/identity_profile.hpp"
#include "devices/profile_registry.hpp"

class MyDriveProfile : public ecdev::CiA402DriveProfile {
public:
  using CiA402DriveProfile::CiA402DriveProfile;
  const char* profileName() const override { return "vendor:my-drive"; }

  // Override readInputs to snapshot extra vendor PDOs.
  void readInputs(const ecdev::ProcessImage& img, bool wkc, bool op) override {
    CiA402DriveProfile::readInputs(img, wkc, op);  // chain to base first
    std::int32_t v = 0;
    if (wkc && img.readI32(extra_ref_, &v))
      extra_.store(v, std::memory_order_release);
  }

  std::int32_t extraValue() const noexcept {
    return extra_.load(std::memory_order_acquire);
  }

  static std::unique_ptr<ecdev::IDeviceProfile> make(
      const ecdev::ProfileSelectionInput& in) {
    ecdev::CiA402DriveProfile::Config cfg;
    cfg.op_mode = in.op_mode;
    return std::make_unique<MyDriveProfile>(cfg);
  }

private:
  ecdev::PdoEntryRef extra_ref_{};
  std::atomic<std::int32_t> extra_{0};
};
```

Register with the network config:

```cpp
cfg.extra_profile_factories.push_back(
    ecdev::makeIdentityProfileFactory(
        ecdev::DeviceIdentityMatch{kVendorId, kProductCode},
        MyDriveProfile::make,
        "cia402:my-drive"));
```

Because `MyDriveProfile` inherits `asMotion()`, the `Axis` facade keeps working.
Access the vendor extension through `axis->deviceProfile()`:

```cpp
ecdev::IDeviceProfile* p = drive->deviceProfile();
if (p && std::strcmp(p->profileName(), "vendor:my-drive") == 0)
    auto* mine = static_cast<MyDriveProfile*>(p);
```

### Option B — brand-new device class

For a device that fits none of the typed contracts (e.g. an IMU), implement
`ecdev::IDeviceProfile` directly:

```cpp
#include "devices/device_profile.hpp"
#include "devices/process_image.hpp"
#include "devices/slave_services.hpp"

class ImuProfile : public ecdev::IDeviceProfile {
public:
  const char* profileName() const override { return "vendor:imu"; }

  // Called once at PRE_OP: resolve PDO object references.
  std::string configurePreOp(ecdev::ISlaveServices& svc,
                             ecdev::ProcessImage& img) override {
    (void)svc;
    accel_ref_[0] = img.resolve(0x6000, 0x01);
    accel_ref_[1] = img.resolve(0x6000, 0x02);
    accel_ref_[2] = img.resolve(0x6000, 0x03);
    // Return non-empty string to abort bring-up with that reason.
    return {};
  }

  // Called every RT cycle: copy PDO words into lock-free atomics.
  void readInputs(const ecdev::ProcessImage& img, bool wkc, bool) override {
    if (!wkc) return;
    for (int i = 0; i < 3; ++i) {
      std::int16_t v = 0;
      if (img.readI16(accel_ref_[i], &v))
        accel_[i].store(v, std::memory_order_release);
    }
  }

  std::int16_t accel(int axis) const noexcept {
    return accel_[axis].load(std::memory_order_acquire);
  }

  static std::unique_ptr<ecdev::IDeviceProfile> make(
      const ecdev::ProfileSelectionInput&) {
    return std::make_unique<ImuProfile>();
  }

private:
  ecdev::PdoEntryRef accel_ref_[3]{};
  std::atomic<std::int16_t> accel_[3]{};
};
```

Register and use via `GenericDevice`:

```cpp
cfg.extra_profile_factories.push_back(
    ecdev::makeIdentityProfileFactory(
        ecdev::DeviceIdentityMatch{kImuVendorId, kImuProductCode},
        ImuProfile::make, "vendor:imu"));

lxmaster::EcNetwork net(cfg);
net.prepare();

ImuProfile* imu = nullptr;
lxmaster::GenericDevice* imu_dev = nullptr;
for (lxmaster::GenericDevice* d : net.devices()) {
    auto* p = d->deviceProfile();
    if (p && std::strcmp(p->profileName(), "vendor:imu") == 0) {
        imu_dev = d;
        imu = static_cast<ImuProfile*>(p);
    }
}
imu_dev->configure();  // raise to OPERATIONAL
net.start();

// Application thread:
std::cout << imu->accel(0) << "\n";
```

### `IDeviceProfile` method reference

| Method | Thread | Description |
| --- | --- | --- |
| `profileName()` | any | Unique stable identifier string. |
| `resolveTopology(image)` | bind | Resolve PDO topology from ENI geometry (before live bus). Default: no-op. |
| `configurePreOp(svc, img)` | bring-up | SDO setup + PDO reference resolution. Non-empty return aborts. |
| `prepareSafeOp(svc, img)` | bring-up | Additional SAFE\_OP preparation. |
| `writeOutputs(img, cycle)` | **RT** | Write output PDO values each cycle. |
| `readInputs(img, wkc, op)` | **RT** | Snapshot input PDO values each cycle. |
| `primeOutputs(img)` | bring-up | Prime outputs before first SAFE\_OP exchange. |
| `captureExitDiagnostics(svc)` | shutdown | SDO diagnostics after RT thread joins. |

---

## `DeviceFacade` base (shared by all handles)

All device handles (`Axis`, `IoModule`, `Encoder`, `GenericDevice`) share:

```cpp
const std::string& name()   // ENI slave name
void configure()            // raise to OPERATIONAL (call between prepare/start)
void configure(ecdev::BringupState)  // raise to a specific ESM state
ecdev::IDeviceProfile* deviceProfile()  // underlying profile; nullptr for passive slaves
```

Not calling `configure()` leaves a device at PRE\_OP (passive; not cyclic).

---

## Error handling pattern

Every `start()` and `prepare()` call follows the same pattern:

```cpp
if (!net.start()) {
    std::cerr << "Failed: " << net.lastError() << "\n";
    return 1;
}
```

`lastError()` is thread-safe and is also written when the cyclic watchdog trips
during a run. Check `net.isRunning()` in the control loop; if it returns `false`
mid-run, read `net.lastError()` to find out why, then call `net.stop()`.

```cpp
while (net.isRunning() && !interrupted) {
    // ... command axes ...
}

if (!net.isRunning() && !interrupted) {
    std::cerr << "Network stopped: " << net.lastError() << "\n";
}
net.stop();
net.reportDeviceStatus(std::cerr);
```
