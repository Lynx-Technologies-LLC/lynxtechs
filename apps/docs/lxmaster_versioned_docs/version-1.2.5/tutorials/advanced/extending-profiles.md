---
sidebar_position: 3
title: Extending a built-in profile
---

# Extending a built-in profile

**Goal:** customize the behaviour of a specific drive by subclassing the built-in
CiA402 profile — adding vendor-specific data or logic — while keeping the standard
`Axis` API your application already uses.

This is the first of the two capstone tutorials on the
[device-profile concept](../basics/device-profiles). Here you *reuse* a built-in
profile and add to it; in the [next one](./custom-device-profile) you write a
profile from scratch.

## When to extend vs. write from scratch

Reach for extension when your device is *fundamentally* a standard device with
extras:

| Situation | Approach |
| --- | --- |
| A CiA402 servo that also exposes a vendor temperature / diagnostic PDO | **Extend** `CiA402DriveProfile` (this page) |
| A CiA402 servo needing slightly different startup logic | **Extend** `CiA402DriveProfile` |
| A device that is not a drive/I/O/encoder at all (a custom sensor) | **Write from scratch** ([next page](./custom-device-profile)) |

Extending keeps everything the built-in profile already does — the DS402 state
machine, fault recovery, standard PDO handling — so you only write the delta.

## EtherCAT background: standard vs. vendor objects

The CiA402 standard defines the common objects (controlword, statusword, target
position, …). But the object dictionary reserves a **manufacturer-specific range**
(`0x2000`–`0x5FFF`) where a vendor can expose anything: a drive temperature, a
second encoder, a bus-voltage reading. If those objects are mapped into the drive's
TxPDO by the ENI, they arrive every cycle alongside the standard data — the built-in
profile just does not know to read them. Extending the profile is how you teach it
to.

## The recipe

The [Custom Profile Demo](../../examples/custom-profile-demo) shows all four steps.

### 1. Subclass `CiA402DriveProfile`

```cpp
#include "devices/cia402_drive_profile.hpp"
#include "devices/identity_profile.hpp"
#include "devices/profile_registry.hpp"

namespace demo {

class A6ExtendedProfile : public ecdev::CiA402DriveProfile {
public:
  using CiA402DriveProfile::CiA402DriveProfile;   // inherit constructors

  const char* profileName() const override { return "a6-custom"; }

  // The factory hook the registry calls to build one of these.
  static std::unique_ptr<ecdev::IDeviceProfile> make(
      const ecdev::ProfileSelectionInput& in) {
    ecdev::CiA402DriveProfile::Config cfg;
    cfg.op_mode                      = in.op_mode;
    cfg.auto_fault_reset_and_recover = in.auto_fault_reset_and_recover;
    cfg.startup_fault_autoreset      = in.startup_fault_autoreset;
    return std::make_unique<A6ExtendedProfile>(cfg);
  }
};

}  // namespace demo
```

Because you inherit `CiA402DriveProfile`, all standard motion behaviour comes for
free. The two things every extended profile provides:

- **`profileName()`** — a unique string. This is how you recover the concrete type
  at runtime without RTTI (see step 4).
- **`make()`** — a static factory that copies the selection defaults into the base
  `Config` and constructs your subclass.

### 2. Register it against a device identity

An extended profile is bound to a specific vendor ID + product code. Registering it
in `extra_profile_factories` makes it win over the generic CiA402 family fallback
(recall the [claim-score selection](../basics/device-profiles#how-lxmaster-picks-a-profile-for-each-slave)
— an identity match outranks the family):

```cpp
constexpr std::uint32_t kVendorId    = 0x00400000;
constexpr std::uint32_t kProductCode = 0x00000715;

lxmaster::NetworkConfig cfg = lxmaster::NetworkConfig::defaults();
cfg.eni.eni_path = "/path/to/bus.eni.xml";

cfg.extra_profile_factories.push_back(
    ecdev::makeIdentityProfileFactory(
        ecdev::DeviceIdentityMatch{kVendorId, kProductCode},
        demo::A6ExtendedProfile::make, "cia402:a6-custom"));

lxmaster::EcNetwork net(cfg);
net.prepare();
```

Now any slave in the ENI matching that identity gets `A6ExtendedProfile`; every
other CiA402 drive still gets the built-in. No static registration, no linker
tricks.

### 3. Use the standard `Axis` — nothing changes

```cpp
lxmaster::Axis* drive = net.axes().front();
drive->setDriveMode(lxmaster::DriveOpMode::Csp);
drive->configure();
net.start();
```

This is the whole point of the facade/profile split: because your subclass still
implements the motion contract, it still surfaces as an `Axis`. All your existing
motion code keeps working unchanged.

### 4. Reach your extra behaviour when you need it

When you *do* need the custom bits, get the profile via the escape hatch, confirm
it is yours by name, and cast once:

```cpp
ecdev::IDeviceProfile* prof = drive->deviceProfile();
if (prof && std::strcmp(prof->profileName(), "a6-custom") == 0) {
  auto* mine = static_cast<demo::A6ExtendedProfile*>(prof);
  // ... call methods you added to A6ExtendedProfile ...
}
```

The name check makes the `static_cast` safe without `dynamic_cast` — a deliberate
pattern that keeps the hot path RTTI-free.

## Adding vendor PDOs

To surface an extra object the drive maps, override `readInputs()`, **chain to the
base class first** (so standard data is still processed), then read your object from
the process image into a lock-free member the application can read:

```cpp
void readInputs(const ecdev::ProcessImage& image, bool wkc_valid, bool changed) override {
  ecdev::CiA402DriveProfile::readInputs(image, wkc_valid, changed);  // keep standard behaviour
  if (!wkc_valid) return;
  std::int16_t t = 0;
  if (image.readI16(temp_ref_, &t)) temperature_.store(t, std::memory_order_release);
}
```

You would resolve `temp_ref_` once in `configurePreOp()` (chaining to the base
there too). The full process-image API — `resolve()`, `readI16()`, and friends — is
exactly what the [next tutorial](./custom-device-profile) uses to build a profile
from nothing, so it is covered in depth there.

## Recap

- **Extend** a built-in profile when your device is a standard device with extras;
  you keep the DS402 state machine, fault handling, and the `Axis` facade.
- Subclass `CiA402DriveProfile`, override `profileName()`, and provide a static
  `make()`.
- Register it with `makeIdentityProfileFactory` so the identity match beats the
  family fallback.
- Recover your type via `deviceProfile()` + name check + `static_cast`.
- Add vendor PDOs by overriding `readInputs()`/`configurePreOp()` and chaining to
  the base.

## Next

Now the finale: a device that fits *no* built-in profile at all —
[Writing your own device profile](./custom-device-profile).
