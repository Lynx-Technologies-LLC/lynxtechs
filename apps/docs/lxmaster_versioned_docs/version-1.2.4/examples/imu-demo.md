---
title: "Imu Demo"
sidebar_position: 4
---

<!-- GENERATED - do not edit. Synced from lxmaster-demos by scripts/sync-examples.mjs. -->

# Imu Demo

# IMU Demo — custom device with no built-in profile

> Source: [imu_demo/main.cpp](https://github.com/Lynx-Technologies-LLC/lxmaster-demos/blob/main/imu_demo/main.cpp)

Shows how to support any EtherCAT device that has no built-in lxmaster profile and uses a custom PDO mapping — an IMU is used as the example, but the same pattern applies to any device: custom sensors, proprietary controllers, or anything else that does not fit the standard drive / I/O / encoder contracts.

The approach is to implement `IDeviceProfile` directly, resolve your PDO objects by CoE index once at PreOP, and snapshot them each cycle into lock-free atomics. The device is then accessed through the generic `GenericDevice` handle instead of `Axis` or `IoModule`.

---

### 1. Define the profile class

```cpp
class ImuProfile : public ecdev::IDeviceProfile {
public:
  const char* profileName() const override { return "vendor:imu"; }

  std::string configurePreOp(ecdev::ISlaveServices& svc, ecdev::ProcessImage& image) override {
    accel_ref_[0] = image.resolve(0x6000, 0x01);  // accel X
    accel_ref_[1] = image.resolve(0x6000, 0x02);  // accel Y
    accel_ref_[2] = image.resolve(0x6000, 0x03);  // accel Z
    gyro_ref_[0]  = image.resolve(0x6010, 0x01);  // gyro X
    gyro_ref_[1]  = image.resolve(0x6010, 0x02);  // gyro Y
    gyro_ref_[2]  = image.resolve(0x6010, 0x03);  // gyro Z
    return {};
  }

  void readInputs(const ecdev::ProcessImage& image, bool wkc_valid, bool) override {
    if (!wkc_valid) return;
    for (int i = 0; i < 3; ++i) {
      std::int16_t v = 0;
      if (image.readI16(accel_ref_[i], &v)) accel_[i].store(v, std::memory_order_release);
      if (image.readI16(gyro_ref_[i],  &v))  gyro_[i].store(v, std::memory_order_release);
    }
  }
  ...
};
```

`configurePreOp` is called once before cyclic data flows. `image.resolve()` converts a CoE object index + subindex into a fast handle (`PdoEntryRef`) that avoids repeated map lookups at runtime.

`readInputs` is called every EtherCAT cycle by the real-time thread. It reads the six mapped words directly from the process image and stores them into lock-free atomics so the application thread can read them safely without blocking the RT thread.

---

### 2. Register the profile & prepare

```cpp
cfg.extra_profile_factories.push_back(
    ecdev::makeIdentityProfileFactory(
        ecdev::DeviceIdentityMatch{kImuVendorId, kImuProductCode},
        demo::ImuProfile::make, "vendor:imu"));

lxmaster::EcNetwork net(cfg);
net.prepare();
```

The profile is bound to the IMU's vendor ID and product code. When `prepare()` scans the ENI, any slave with a matching identity gets `ImuProfile` assigned to it. The device is then reachable through `net.devices()` rather than `net.axes()` or `net.ioModules()` because it has no typed facade.

---

### 3. Find the IMU device

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
imu_dev->configure();
```

`net.devices()` iterates every profile-carrying slave. The IMU is identified by its unique profile name and cast once to the concrete type — no RTTI or `dynamic_cast` needed. Calling `configure()` on the `GenericDevice` opts it into the OPERATIONAL bring-up.

---

### 4. Start & sample

```cpp
net.start();

for (int i = 0; i < 5; ++i) {
    std::this_thread::sleep_for(std::chrono::milliseconds(100));
    std::cout << "accel=[" << imu->accel(0) << ", " << imu->accel(1) << ", " << imu->accel(2)
              << "] gyro=[" << imu->gyro(0)  << ", " << imu->gyro(1)  << ", " << imu->gyro(2) << "]\n";
}
```

Once the bus is running, `imu->accel()` and `imu->gyro()` read from the atomics that the RT thread updates each cycle. The application thread never touches the process image directly.

---

### 5. Stop

```cpp
net.stop();
```

`net.stop()` gracefully shuts down the cyclic thread and transitions all slaves back to INIT.

## Source: `main.cpp`

```cpp
#include <atomic>
#include <chrono>
#include <cstdint>
#include <cstring>
#include <iostream>
#include <memory>
#include <thread>
#include <vector>

#include <lxmaster/lxmaster.hpp>

// Direct device-layer headers for defining a brand-new device class.
#include "devices/device_profile.hpp"
#include "devices/identity_profile.hpp"
#include "devices/process_image.hpp"
#include "devices/profile_registry.hpp"
#include "devices/slave_services.hpp"

/**
 * Custom profile for an EtherCAT IMU.
 * Implements IDeviceProfile directly — no typed Axis / IoModule facade.
 * PDO refs are resolved once at PreOP; values are snapshotted each cycle
 * into lock-free atomics that application threads read through the getters.
 */
namespace demo {

class ImuProfile : public ecdev::IDeviceProfile {
public:
  const char* profileName() const override { return "vendor:imu"; }

  // Called once before cyclic data flows: resolve the six mapped TxPDO objects.
  std::string configurePreOp(ecdev::ISlaveServices& svc, ecdev::ProcessImage& image) override {
    (void)svc;
    accel_ref_[0] = image.resolve(0x6000, 0x01);
    accel_ref_[1] = image.resolve(0x6000, 0x02);
    accel_ref_[2] = image.resolve(0x6000, 0x03);
    gyro_ref_[0]  = image.resolve(0x6010, 0x01);
    gyro_ref_[1]  = image.resolve(0x6010, 0x02);
    gyro_ref_[2]  = image.resolve(0x6010, 0x03);
    return {};  // non-empty string aborts bring-up with that reason
  }

  // Called every EtherCAT cycle: copy mapped words into the lock-free snapshot.
  void readInputs(const ecdev::ProcessImage& image, bool wkc_valid, bool) override {
    if (!wkc_valid) return;
    for (int i = 0; i < 3; ++i) {
      std::int16_t v = 0;
      if (image.readI16(accel_ref_[i], &v)) accel_[i].store(v, std::memory_order_release);
      if (image.readI16(gyro_ref_[i],  &v))  gyro_[i].store(v, std::memory_order_release);
    }
  }

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

constexpr std::uint32_t kImuVendorId    = 0x00000ABC;
constexpr std::uint32_t kImuProductCode = 0x00010001;
constexpr const char*   kEniPath        = "/home/user/myenifolder/myenifile.xml";

int main() {
  // --- 1. Config & register IMU profile ---
  lxmaster::NetworkConfig cfg = lxmaster::NetworkConfig::defaults();
  cfg.eni.eni_path = kEniPath;
  cfg.extra_profile_factories.push_back(
      ecdev::makeIdentityProfileFactory(
          ecdev::DeviceIdentityMatch{kImuVendorId, kImuProductCode},
          demo::ImuProfile::make, "vendor:imu"));

  lxmaster::EcNetwork net(cfg);
  if (!net.prepare()) { std::cerr << "prepare failed: " << net.lastError() << "\n"; return 1; }

  // --- 2. Find the IMU device ---
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
  imu_dev->configure();

  // --- 3. Start & sample ---
  if (!net.start()) { std::cerr << "start failed: " << net.lastError() << "\n"; return 1; }

  for (int i = 0; i < 5; ++i) {
    std::this_thread::sleep_for(std::chrono::milliseconds(100));
    std::cout << "accel=[" << imu->accel(0) << ", " << imu->accel(1) << ", " << imu->accel(2)
              << "] gyro=[" << imu->gyro(0) << ", " << imu->gyro(1) << ", " << imu->gyro(2) << "]\n";
  }

  // --- 4. Stop ---
  net.stop();
  return 0;
}
```
