---
title: "ecfacade::GenericDevice"
summary: "Application handle for a device whose profile implements none of the typed capability contracts (not an Axis, IoModule, or Encoder)  e.g."

slug: /lxmaster/api/classes/GenericDevice
sidebar_label: "GenericDevice"
---
<!-- GENERATED - do not edit. Produced from the LXMASTER public
     headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->

# ecfacade::GenericDevice



Application handle for a device whose profile implements none of the typed capability contracts (not an `[Axis]()`, `[IoModule](/lxmaster/api/classes/IoModule)`, or `[Encoder]()`) &ndash; e.g.  [More...](#detailed-description)


`#include <generic_device.hpp>`

Inherits from [ecfacade::DeviceFacade](/lxmaster/api/classes/DeviceFacade)

## Public Functions

|                | Name           |
| -------------- | -------------- |
| | **[DeviceFacade](/lxmaster/api/classes/GenericDevice#function-devicefacade)**(ecdev::IEthercatDevice * device, std::string name) |

## Additional inherited members

**Public Functions inherited from [ecfacade::DeviceFacade](/lxmaster/api/classes/DeviceFacade)**

|                | Name           |
| -------------- | -------------- |
| const std::string & | **[name](/lxmaster/api/classes/DeviceFacade#function-name)**() const<br>ENI/ESI slave name this handle maps to (for logs / UI).  |
| [ecdev::IDeviceProfile](/lxmaster/api/classes/IDeviceProfile) * | **[deviceProfile](/lxmaster/api/classes/DeviceFacade#function-deviceprofile)**() const<br>The underlying device-class profile, for advanced callers that bound a custom profile (e.g.  |
| void | **[configure](/lxmaster/api/classes/DeviceFacade#function-configure)**(ecdev::BringupState maxState)<br>Opt this device into a maximum bring-up state.  |
| void | **[configure](/lxmaster/api/classes/DeviceFacade#function-configure)**()<br>Convenience for the common "bring this device fully operational" case (configure(Op)).  |

**Protected Attributes inherited from [ecfacade::DeviceFacade](/lxmaster/api/classes/DeviceFacade)**

|                | Name           |
| -------------- | -------------- |
| std::string | **[name_](/lxmaster/api/classes/DeviceFacade#variable-name-)**  |
| ecdev::IEthercatDevice * | **[device_](/lxmaster/api/classes/DeviceFacade#variable-device-)**  |


## Detailed Description

```cpp
class ecfacade::GenericDevice;
```

Application handle for a device whose profile implements none of the typed capability contracts (not an `[Axis]()`, `[IoModule](/lxmaster/api/classes/IoModule)`, or `[Encoder]()`) &ndash; e.g. 

an EtherCAT IMU or any other vendor device modelled by a custom `[ecdev::IDeviceProfile](/lxmaster/api/classes/IDeviceProfile)`.

It adds nothing beyond `[DeviceFacade](/lxmaster/api/classes/DeviceFacade)`: the generic device is reached via `EcNetwork::devices()`, brought to OPERATIONAL with `[configure()](/lxmaster/api/classes/DeviceFacade#function-configure)`, and its custom profile is obtained with `[deviceProfile()](/lxmaster/api/classes/DeviceFacade#function-deviceprofile)` (then recovered to the concrete profile type with a `profileName()`-guarded `static_cast`, RTTI-free, once at setup &ndash; see `[deviceProfile()](/lxmaster/api/classes/DeviceFacade#function-deviceprofile)`). A device that also exposes a typed capability still appears here in addition to its typed list, so `devices()` is the complete set of profile-carrying slaves. 

## Public Functions Documentation

### function DeviceFacade

```cpp
DeviceFacade(
    ecdev::IEthercatDevice * device,
    std::string name
)
```


-------------------------------

Updated on 2026-07-04 at 20:22:54 +0000