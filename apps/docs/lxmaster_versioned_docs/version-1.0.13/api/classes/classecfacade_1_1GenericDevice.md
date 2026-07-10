---
title: "ecfacade::GenericDevice"
summary: "Application handle for a device whose profile implements none of the typed capability contracts (not an Axis, IoModule, or Encoder)  e.g."

slug: /api/classes/GenericDevice
sidebar_label: "GenericDevice"
---

<!-- GENERATED - do not edit. Produced from the LXMASTER public headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->
# ecfacade::GenericDevice



Application handle for a device whose profile implements none of the typed capability contracts (not an `Axis`, `[IoModule](/lxmaster/api/classes/IoModule)`, or `Encoder`) &ndash; e.g.  [More...](#detailed-description)


`#include <generic_device.hpp>`

Inherits from DeviceFacade

## Detailed Description

```cpp
class ecfacade::GenericDevice;
```

Application handle for a device whose profile implements none of the typed capability contracts (not an `Axis`, `[IoModule](/lxmaster/api/classes/IoModule)`, or `Encoder`) &ndash; e.g. 

an EtherCAT IMU or any other vendor device modelled by a custom `[ecdev::IDeviceProfile](/lxmaster/api/classes/IDeviceProfile)`.

It adds nothing beyond `[DeviceFacade]`: the generic device is reached via `EcNetwork::devices()`, brought to OPERATIONAL with `configure()`, and its custom profile is obtained with `deviceProfile()` (then recovered to the concrete profile type with a `profileName()`-guarded `static_cast`, RTTI-free, once at setup &ndash; see `deviceProfile()`). A device that also exposes a typed capability still appears here in addition to its typed list, so `devices()` is the complete set of profile-carrying slaves. 

-------------------------------

Updated on 2026-07-04 at 22:59:44 +0000