<!-- GENERATED - do not edit. Produced from the LXMASTER public
     headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->
---
title: ecfacade::DeviceFacade
summary: Shared base for every application-facing device handle (IoModule, Axis, Encoder). 

---

# ecfacade::DeviceFacade



Shared base for every application-facing device handle ([IoModule](/lxmaster/api/classes/classecfacade_1_1iomodule), [Axis](), [Encoder](/lxmaster/api/classes/classecfacade_1_1encoder)).  [More...](#detailed-description)


`#include <device_facade.hpp>`

Inherited by [ecfacade::Axis](/lxmaster/api/classes/classecfacade_1_1axis), [ecfacade::Encoder](/lxmaster/api/classes/classecfacade_1_1encoder), [ecfacade::GenericDevice](/lxmaster/api/classes/classecfacade_1_1genericdevice), [ecfacade::IoModule](/lxmaster/api/classes/classecfacade_1_1iomodule)

## Public Functions

|                | Name           |
| -------------- | -------------- |
| const std::string & | **[name](/lxmaster/api/classes/classecfacade_1_1devicefacade#function-name)**() const<br>ENI/ESI slave name this handle maps to (for logs / UI).  |
| [ecdev::IDeviceProfile](/lxmaster/api/classes/classecdev_1_1ideviceprofile) * | **[deviceProfile](/lxmaster/api/classes/classecfacade_1_1devicefacade#function-deviceprofile)**() const<br>The underlying device-class profile, for advanced callers that bound a custom profile (e.g.  |
| void | **[configure](/lxmaster/api/classes/classecfacade_1_1devicefacade#function-configure)**(ecdev::BringupState maxState)<br>Opt this device into a maximum bring-up state.  |
| void | **[configure](/lxmaster/api/classes/classecfacade_1_1devicefacade#function-configure)**()<br>Convenience for the common "bring this device fully operational" case (configure(Op)).  |
| | **[DeviceFacade](/lxmaster/api/classes/classecfacade_1_1devicefacade#function-devicefacade)**(ecdev::IEthercatDevice * device, std::string name) |

## Protected Attributes

|                | Name           |
| -------------- | -------------- |
| std::string | **[name_](/lxmaster/api/classes/classecfacade_1_1devicefacade#variable-name-)**  |
| ecdev::IEthercatDevice * | **[device_](/lxmaster/api/classes/classecfacade_1_1devicefacade#variable-device-)**  |

## Detailed Description

```cpp
class ecfacade::DeviceFacade;
```

Shared base for every application-facing device handle ([IoModule](/lxmaster/api/classes/classecfacade_1_1iomodule), [Axis](), [Encoder](/lxmaster/api/classes/classecfacade_1_1encoder)). 

Holds the (non-owning) runtime device pointer and the slave name, and exposes the only app-facing entry point for opting a device into a higher EtherCAT bring-up ceiling. The underlying `ecdev::IEthercatDevice::setMaxBringupState` is library-internal; the application never calls it directly &ndash; it calls `[configure()](/lxmaster/api/classes/classecfacade_1_1devicefacade#function-configure)` here instead.

Non-polymorphic on purpose: facades are stored by value in homogeneous containers and are never destroyed through a base pointer, so no virtual destructor is required. 

## Public Functions Documentation

### function name

```cpp
const std::string & name() const
```

ENI/ESI slave name this handle maps to (for logs / UI). 

### function deviceProfile

```cpp
ecdev::IDeviceProfile * deviceProfile() const
```

The underlying device-class profile, for advanced callers that bound a custom profile (e.g. 

a subclass of `[ecdev::CiA402DriveProfile](/lxmaster/api/classes/classecdev_1_1cia402driveprofile)` exposing extra vendor PDO variables). Returns `nullptr` when the device carries no profile (a passive slave). Most applications use the typed handles (`[Axis](/lxmaster/api/classes/classecfacade_1_1axis)`/`[IoModule](/lxmaster/api/classes/classecfacade_1_1iomodule)`/`[Encoder](/lxmaster/api/classes/classecfacade_1_1encoder)`) and never need this.

To recover your concrete profile type, do NOT use `dynamic_cast`&ndash; this is an RT system and the runtime is RTTI-free. Guard on the unique `profileName()` you registered and `static_cast`, once, at setup, caching the typed pointer (never per cycle): [ecdev::IDeviceProfile](/lxmaster/api/classes/classecdev_1_1ideviceprofile)* p = handle->[deviceProfile()](/lxmaster/api/classes/classecfacade_1_1devicefacade#function-deviceprofile); if (p && std::strcmp(p->profileName(), "vendor:my-device") == 0) my_ = static_cast<MyProfile*>(p); 


### function configure

```cpp
void configure(
    ecdev::BringupState maxState
)
```

Opt this device into a maximum bring-up state. 

Call only between `EcNetwork::prepare()` and `EcNetwork::start()`. Not calling `[configure()](/lxmaster/api/classes/classecfacade_1_1devicefacade#function-configure)` leaves the device at its default PRE_OP. 


### function configure

```cpp
void configure()
```

Convenience for the common "bring this device fully operational" case (configure(Op)). 

### function DeviceFacade

```cpp
DeviceFacade(
    ecdev::IEthercatDevice * device,
    std::string name
)
```


## Protected Attributes Documentation

### variable name_

```cpp
std::string name_;
```


### variable device_

```cpp
ecdev::IEthercatDevice * device_;
```


-------------------------------

Updated on 2026-07-04 at 20:22:54 +0000