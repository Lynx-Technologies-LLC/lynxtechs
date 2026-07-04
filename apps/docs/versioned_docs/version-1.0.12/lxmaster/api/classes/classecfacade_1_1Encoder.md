<!-- GENERATED - do not edit. Produced from the LXMASTER public
     headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->
---
title: ecfacade::Encoder
summary: High-level encoder handle. 

---

# ecfacade::Encoder



High-level encoder handle.  [More...](#detailed-description)


`#include <encoder.hpp>`

Inherits from [ecfacade::DeviceFacade](/lxmaster/api/classes/classecfacade_1_1devicefacade)

## Public Functions

|                | Name           |
| -------------- | -------------- |
| std::int32_t | **[velocity](/lxmaster/api/classes/classecfacade_1_1encoder#function-velocity)**() const |
| std::uint16_t | **[status](/lxmaster/api/classes/classecfacade_1_1encoder#function-status)**() const |
| std::int32_t | **[position](/lxmaster/api/classes/classecfacade_1_1encoder#function-position)**() const |
| [ecdev::IEncoderProfile](/lxmaster/api/classes/classecdev_1_1iencoderprofile) * | **[encoderProfile](/lxmaster/api/classes/classecfacade_1_1encoder#function-encoderprofile)**() const |
| | **[Encoder](/lxmaster/api/classes/classecfacade_1_1encoder#function-encoder)**([ecdev::IEncoderProfile](/lxmaster/api/classes/classecdev_1_1iencoderprofile) * enc, std::string name, ecdev::IEthercatDevice * device) |

## Additional inherited members

**Public Functions inherited from [ecfacade::DeviceFacade](/lxmaster/api/classes/classecfacade_1_1devicefacade)**

|                | Name           |
| -------------- | -------------- |
| const std::string & | **[name](/lxmaster/api/classes/classecfacade_1_1devicefacade#function-name)**() const<br>ENI/ESI slave name this handle maps to (for logs / UI).  |
| [ecdev::IDeviceProfile](/lxmaster/api/classes/classecdev_1_1ideviceprofile) * | **[deviceProfile](/lxmaster/api/classes/classecfacade_1_1devicefacade#function-deviceprofile)**() const<br>The underlying device-class profile, for advanced callers that bound a custom profile (e.g.  |
| void | **[configure](/lxmaster/api/classes/classecfacade_1_1devicefacade#function-configure)**(ecdev::BringupState maxState)<br>Opt this device into a maximum bring-up state.  |
| void | **[configure](/lxmaster/api/classes/classecfacade_1_1devicefacade#function-configure)**()<br>Convenience for the common "bring this device fully operational" case (configure(Op)).  |
| | **[DeviceFacade](/lxmaster/api/classes/classecfacade_1_1devicefacade#function-devicefacade)**(ecdev::IEthercatDevice * device, std::string name) |

**Protected Attributes inherited from [ecfacade::DeviceFacade](/lxmaster/api/classes/classecfacade_1_1devicefacade)**

|                | Name           |
| -------------- | -------------- |
| std::string | **[name_](/lxmaster/api/classes/classecfacade_1_1devicefacade#variable-name-)**  |
| ecdev::IEthercatDevice * | **[device_](/lxmaster/api/classes/classecfacade_1_1devicefacade#variable-device-)**  |


## Detailed Description

```cpp
class ecfacade::Encoder;
```

High-level encoder handle. 

Thin wrapper over an `[ecdev::IEncoderProfile](/lxmaster/api/classes/classecdev_1_1iencoderprofile)`; the application reads position/velocity/status without seeing CoE objects or the backend. 

## Public Functions Documentation

### function velocity

```cpp
std::int32_t velocity() const
```


### function status

```cpp
std::uint16_t status() const
```


### function position

```cpp
std::int32_t position() const
```


### function encoderProfile

```cpp
ecdev::IEncoderProfile * encoderProfile() const
```


### function Encoder

```cpp
Encoder(
    ecdev::IEncoderProfile * enc,
    std::string name,
    ecdev::IEthercatDevice * device
)
```


-------------------------------

Updated on 2026-07-04 at 20:22:54 +0000