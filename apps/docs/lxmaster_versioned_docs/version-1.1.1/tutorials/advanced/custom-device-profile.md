---
sidebar_position: 4
title: Writing your own device profile
---

# Writing your own device profile

**Goal:** support an EtherCAT device that fits *none* of the built-in profiles —
a custom sensor, a proprietary controller, an IMU — by implementing a device
profile from scratch and reaching it through the `GenericDevice` facade.

This is the capstone of the series. It brings together both core concepts: you
will write a [device profile](../basics/device-profiles) and access it through a
[facade](../basics/facades) — this time the generic one, because your device has no
typed contract.

## When you need this

The [previous tutorial](./extending-profiles) extended a standard drive. But some
devices are not drives, I/O, or encoders at all. If a slave maps process data and
no built-in profile claims it, bring-up **fails with a hard error** — LXMASTER
refuses to guess. Writing a profile is how you tell it what that device's data
means.

We use an IMU (accelerometer + gyroscope) as the example, following the
[IMU Demo](../../examples/imu-demo). The exact same pattern applies to any custom
device.

## EtherCAT background: resolving PDO objects

Recall that a device's cyclic data lives in its object dictionary and is mapped
into PDOs by the ENI. To read a value you need to know *where in the process image*
a given object landed. Rather than compute byte offsets, a profile asks the
process image to **resolve** a CoE index + subindex into a fast handle
(`PdoEntryRef`) once, then uses that handle to read the value cheaply every cycle:

```
0x6000:01 (accel X)  --image.resolve()-->  PdoEntryRef  --image.readI16()-->  value
```

Resolving once at PRE-OP and reading via the handle each cycle keeps the real-time
path free of map lookups. See [How Data Flows](../../ethercat-basics/data-communication)
for the object-dictionary/PDO relationship.

## The `IDeviceProfile` contract

A profile from scratch implements `ecdev::IDeviceProfile`. The three members that
matter for a read-only sensor:

| Member | When it runs | What you do |
| --- | --- | --- |
| `profileName()` | any time | Return a unique name (for identification / casting). |
| `configurePreOp()` | once, at PRE-OP | Resolve your PDO object handles. Return `{}` for success, or a reason string to abort bring-up. |
| `readInputs()` | every cycle, on the **RT thread** | Copy mapped values into lock-free atomics. |

A device with outputs also implements `writeOutputs()` (called each cycle to pack
outputs into the process image) — same idea in the other direction.

:::caution `readInputs()` runs on the real-time thread
It must be non-blocking: no allocation, no locks, no syscalls. Do the expensive
work (resolving handles) once in `configurePreOp()`; in `readInputs()` only read
and store into atomics. This is the boundary that keeps the application thread and
the RT thread decoupled.
:::

## 1. Implement the profile

```cpp
#include "devices/device_profile.hpp"
#include "devices/identity_profile.hpp"
#include "devices/process_image.hpp"
#include "devices/profile_registry.hpp"
#include "devices/slave_services.hpp"

namespace demo {

class ImuProfile : public ecdev::IDeviceProfile {
public:
  const char* profileName() const override { return "vendor:imu"; }

  // Resolve the six mapped TxPDO objects once, before cyclic data flows.
  std::string configurePreOp(ecdev::ISlaveServices& svc,
                             ecdev::ProcessImage& image) override {
    (void)svc;
    accel_ref_[0] = image.resolve(0x6000, 0x01);  // accel X
    accel_ref_[1] = image.resolve(0x6000, 0x02);  // accel Y
    accel_ref_[2] = image.resolve(0x6000, 0x03);  // accel Z
    gyro_ref_[0]  = image.resolve(0x6010, 0x01);  // gyro X
    gyro_ref_[1]  = image.resolve(0x6010, 0x02);  // gyro Y
    gyro_ref_[2]  = image.resolve(0x6010, 0x03);  // gyro Z
    return {};   // a non-empty string here aborts bring-up with that reason
  }

  // Snapshot the mapped words into lock-free atomics every cycle.
  void readInputs(const ecdev::ProcessImage& image, bool wkc_valid, bool) override {
    if (!wkc_valid) return;                     // ignore cycles with a bad work counter
    for (int i = 0; i < 3; ++i) {
      std::int16_t v = 0;
      if (image.readI16(accel_ref_[i], &v)) accel_[i].store(v, std::memory_order_release);
      if (image.readI16(gyro_ref_[i],  &v))  gyro_[i].store(v, std::memory_order_release);
    }
  }

  // Application-facing getters read the atomics the RT thread updates.
  std::int16_t accel(int i) const noexcept { return accel_[i].load(std::memory_order_acquire); }
  std::int16_t gyro (int i) const noexcept { return  gyro_[i].load(std::memory_order_acquire); }

  static std::unique_ptr<ecdev::IDeviceProfile> make(const ecdev::ProfileSelectionInput&) {
    return std::make_unique<ImuProfile>();
  }

private:
  ecdev::PdoEntryRef        accel_ref_[3]{};
  ecdev::PdoEntryRef        gyro_ref_[3]{};
  std::atomic<std::int16_t> accel_[3]{};
  std::atomic<std::int16_t> gyro_[3]{};
};

}  // namespace demo
```

The `PdoEntryRef` handles are resolved once; the atomics are the lock-free bridge
between the RT thread (writer) and your application thread (reader). This
writer/reader-with-atomics pattern is exactly how the built-in facades stay RT-safe
too.

## 2. Register it and prepare

Bind the profile to the device's identity, just like an extended profile:

```cpp
constexpr std::uint32_t kImuVendorId    = 0x00000ABC;
constexpr std::uint32_t kImuProductCode = 0x00010001;

lxmaster::NetworkConfig cfg = lxmaster::NetworkConfig::defaults();
cfg.eni.eni_path = "/path/to/bus.eni.xml";
cfg.extra_profile_factories.push_back(
    ecdev::makeIdentityProfileFactory(
        ecdev::DeviceIdentityMatch{kImuVendorId, kImuProductCode},
        demo::ImuProfile::make, "vendor:imu"));

lxmaster::EcNetwork net(cfg);
if (!net.prepare()) { std::cerr << net.lastError() << "\n"; return 1; }
```

## 3. Find it through `GenericDevice`

Because your profile implements no typed contract, the device does **not** appear in
`axes()`, `ioModules()`, or `encoders()`. It appears in `net.devices()` as a
`GenericDevice`. Identify it by profile name and recover your concrete type:

```cpp
lxmaster::GenericDevice* imu_dev = nullptr;
demo::ImuProfile*        imu     = nullptr;
for (lxmaster::GenericDevice* d : net.devices()) {
  ecdev::IDeviceProfile* p = d->deviceProfile();
  if (p && std::strcmp(p->profileName(), "vendor:imu") == 0) {
    imu_dev = d;
    imu     = static_cast<demo::ImuProfile*>(p);
    break;
  }
}
if (!imu) { std::cerr << "IMU not found in ENI.\n"; return 1; }
imu_dev->configure();   // opt it into the OPERATIONAL bring-up
```

`configure()` on the `GenericDevice` is what walks it to OPERATIONAL — the same opt-in
step you used for axes and I/O modules.

## 4. Start and sample

```cpp
if (!net.start()) { std::cerr << net.lastError() << "\n"; return 1; }

for (int i = 0; i < 5; ++i) {
  std::this_thread::sleep_for(std::chrono::milliseconds(100));
  std::cout << "accel=[" << imu->accel(0) << ", " << imu->accel(1) << ", " << imu->accel(2)
            << "] gyro=[" << imu->gyro(0) << ", " << imu->gyro(1) << ", " << imu->gyro(2) << "]\n";
}

net.stop();
```

Your getters read the atomics the RT thread refreshed each cycle; the application
thread never touches the process image directly. That is a complete, working driver
for a device LXMASTER had never heard of.

## Making it permanent

`extra_profile_factories` binds a profile for a single run — perfect for
application-specific devices. For a device class you want available everywhere
without per-app registration, the durable path is a **self-registering translation
unit** using the `LXMASTER_REGISTER_DEVICE` macro: the profile adds itself to the
process-wide built-in registry at static-init time, so any application that links it
picks it up automatically — exactly how the built-in CiA402/401/406 profiles
register themselves.

## Recap

- When no built-in profile claims a slave, bring-up fails — writing a profile is
  how you add support.
- Implement `IDeviceProfile`: `profileName()`, `configurePreOp()` (resolve handles
  once), `readInputs()` (snapshot to atomics on the RT thread), plus `writeOutputs()`
  for output devices.
- Keep `readInputs()`/`writeOutputs()` non-blocking; the atomics bridge to the app
  thread.
- Register with `makeIdentityProfileFactory`, find the device via `net.devices()`
  as a `GenericDevice`, and recover your type by name.
- For permanent support, self-register with `LXMASTER_REGISTER_DEVICE`.

## You've finished the series

You now understand the two ideas the whole API rests on — **facades** and **device
profiles** — and you can go from a first bring-up all the way to teaching LXMASTER
about brand-new hardware. From here:

- Browse the full [example projects](../../examples/) for complete, buildable
  source.
- Revisit the [LXMASTER overview](../../overview) and the API reference for every
  method and option.
- Deepen the fundamentals in [EtherCAT Basics](../../ethercat-basics/what-is-ethercat).
