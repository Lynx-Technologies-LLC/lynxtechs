---
title: "Custom Profile Demo"
sidebar_position: 2
---

<!-- GENERATED - do not edit. Synced from lxmaster-demos by scripts/sync-examples.mjs. -->

# Custom Profile Demo

# Custom Profile Demo — extending a built-in drive profile

> Source: [custom_profile_demo/main.cpp](https://github.com/Lynx-Technologies-LLC/lxmaster-demos/blob/main/custom_profile_demo/main.cpp)

Shows how to subclass the built-in `CiA402DriveProfile` to add vendor-specific behaviour while keeping the standard `Axis` motion interface intact.

---

### 1. Define the custom profile class

```cpp
class A6ExtendedProfile : public ecdev::CiA402DriveProfile {
public:
  using CiA402DriveProfile::CiA402DriveProfile;

  const char* profileName() const override { return "a6-custom"; }

  static std::unique_ptr<ecdev::IDeviceProfile> make(const ecdev::ProfileSelectionInput& in) {
    ecdev::CiA402DriveProfile::Config cfg;
    cfg.op_mode = in.op_mode;
    cfg.auto_fault_reset_and_recover = in.auto_fault_reset_and_recover;
    cfg.startup_fault_autoreset = in.startup_fault_autoreset;
    return std::make_unique<A6ExtendedProfile>(cfg);
  }
};
```

Inheriting `CiA402DriveProfile` means all standard CiA402 motion behaviour (state machine, fault recovery, PDO handling) is inherited for free. Only `profileName()` is overridden here — it returns a unique string used to identify this profile at runtime. The static `make()` factory is the hook that the profile registry calls to instantiate the class.

To expose extra vendor PDOs, override `readInputs()` and call the base class first, then read your additional objects from the process image.

---

### 2. Register the profile & prepare

```cpp
cfg.extra_profile_factories.push_back(
    ecdev::makeIdentityProfileFactory(
        ecdev::DeviceIdentityMatch{kA6VendorId, kA6ProductCode},
        demo::A6ExtendedProfile::make, "cia402:a6-custom"));

lxmaster::EcNetwork net(cfg);
net.prepare();
```

`makeIdentityProfileFactory` ties the custom class to a specific vendor ID and product code. When `prepare()` scans the ENI, any slave matching those IDs gets `A6ExtendedProfile` instead of the default `CiA402DriveProfile`. No static registration or linker tricks are needed.

---

### 3. Configure axis

```cpp
lxmaster::Axis* drive = net.axes().front();
drive->setDriveMode(lxmaster::DriveOpMode::Csp);
drive->configure();
```

The axis is accessed through the standard `Axis` facade — nothing about the motion API changes because of the custom profile. `configure()` walks the drive to OPERATIONAL.

---

### 4. Start & access the custom profile

```cpp
net.start();

ecdev::IDeviceProfile* prof = drive->deviceProfile();
if (prof && std::strcmp(prof->profileName(), "a6-custom") == 0) {
    auto* mine = static_cast<demo::A6ExtendedProfile*>(prof);
    std::cout << "Custom profile active: " << mine->profileName() << "\n";
}
```

`drive->deviceProfile()` returns the underlying profile object. The concrete type is recovered by checking the unique profile name and casting once — no RTTI or `dynamic_cast` needed. Any extra state or methods added to `A6ExtendedProfile` are accessible through `mine`.

---

### 5. Stop

```cpp
net.stop();
```

`net.stop()` gracefully shuts down the cyclic thread and transitions all slaves back to INIT.

## Source: `main.cpp`

```cpp
#include <chrono>
#include <cstdint>
#include <cstring>
#include <iostream>
#include <memory>
#include <thread>
#include <vector>

#include <lxmaster/lxmaster.hpp>

// Direct device-layer headers for binding a custom profile.
#include "devices/cia402_drive_profile.hpp"
#include "devices/identity_profile.hpp"
#include "devices/profile_registry.hpp"

/**
 * Custom profile that extends the built-in CiA402 drive profile.
 * Inherits all standard motion behaviour; only the profile name is overridden here.
 * To expose extra vendor PDOs, override readInputs() and chain to the base class.
 */
namespace demo {

class A6ExtendedProfile : public ecdev::CiA402DriveProfile {
public:
  using CiA402DriveProfile::CiA402DriveProfile;

  const char* profileName() const override { return "a6-custom"; }

  static std::unique_ptr<ecdev::IDeviceProfile> make(const ecdev::ProfileSelectionInput& in) {
    ecdev::CiA402DriveProfile::Config cfg;
    cfg.op_mode = in.op_mode;
    cfg.auto_fault_reset_and_recover = in.auto_fault_reset_and_recover;
    cfg.startup_fault_autoreset = in.startup_fault_autoreset;
    return std::make_unique<A6ExtendedProfile>(cfg);
  }
};

}  // namespace demo

constexpr std::uint32_t kA6VendorId    = 0x00400000;
constexpr std::uint32_t kA6ProductCode = 0x00000715;
constexpr const char*   kEniPath       = "/home/user/myenifolder/myenifile.xml";

int main() {
  // --- 1. Config & register custom profile ---
  lxmaster::NetworkConfig cfg = lxmaster::NetworkConfig::defaults();
  cfg.eni.eni_path = kEniPath;
  cfg.extra_profile_factories.push_back(
      ecdev::makeIdentityProfileFactory(
          ecdev::DeviceIdentityMatch{kA6VendorId, kA6ProductCode},
          demo::A6ExtendedProfile::make, "cia402:a6-custom"));

  lxmaster::EcNetwork net(cfg);
  if (!net.prepare()) { std::cerr << "prepare failed: " << net.lastError() << "\n"; return 1; }

  std::vector<lxmaster::Axis*> axes = net.axes();
  if (axes.empty()) { std::cerr << "No motion axes in ENI.\n"; return 1; }

  // --- 2. Configure axis ---
  lxmaster::Axis* drive = axes.front();
  drive->setDriveMode(lxmaster::DriveOpMode::Csp);
  drive->configure();

  // --- 3. Start & access custom profile ---
  if (!net.start()) { std::cerr << "start failed: " << net.lastError() << "\n"; return 1; }
  std::this_thread::sleep_for(std::chrono::milliseconds(50));

  // Recover the concrete type by checking the unique profile name, then static_cast once.
  ecdev::IDeviceProfile* prof = drive->deviceProfile();
  if (prof && std::strcmp(prof->profileName(), "a6-custom") == 0) {
    auto* mine = static_cast<demo::A6ExtendedProfile*>(prof);
    std::cout << "Custom profile active: " << mine->profileName() << "\n";
  }

  std::cout << "Actual position: " << drive->actualPosition() << " counts\n";

  // --- 4. Stop ---
  net.stop();
  return 0;
}
```
