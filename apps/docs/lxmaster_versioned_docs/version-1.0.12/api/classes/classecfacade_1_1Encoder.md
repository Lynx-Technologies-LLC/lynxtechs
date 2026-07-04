---
title: "ecfacade::Encoder"
summary: "High-level encoder handle."

slug: /api/classes/Encoder
sidebar_label: "Encoder"
---
<!-- GENERATED - do not edit. Produced from the LXMASTER public
     headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->

# ecfacade::Encoder

High-level encoder handle.  [More...](#detailed-description)

`#include <encoder.hpp>`

Inherits from ecfacade::DeviceFacade

## Public Functions

|                | Name           |
| -------------- | -------------- |
| std::int32_t | **[velocity](/lxmaster/api/classes/Encoder#function-velocity)**() const |
| std::uint16_t | **[status](/lxmaster/api/classes/Encoder#function-status)**() const |
| std::int32_t | **[position](/lxmaster/api/classes/Encoder#function-position)**() const |
| [ecdev::IEncoderProfile](/lxmaster/api/classes/IEncoderProfile) * | **[encoderProfile](/lxmaster/api/classes/Encoder#function-encoderprofile)**() const |
| | **[Encoder](/lxmaster/api/classes/Encoder#function-encoder)**([ecdev::IEncoderProfile](/lxmaster/api/classes/IEncoderProfile) * enc, std::string name, ecdev::IEthercatDevice * device) |

## Additional inherited members

**Public Functions inherited from ecfacade::DeviceFacade**

|                | Name           |
| -------------- | -------------- |
| const std::string & | **name**() const<br>ENI/ESI slave name this handle maps to (for logs / UI).  |
| [ecdev::IDeviceProfile](/lxmaster/api/classes/IDeviceProfile) * | **deviceProfile**() const<br>The underlying device-class profile, for advanced callers that bound a custom profile (e.g.  |
| void | **configure**(ecdev::BringupState maxState)<br>Opt this device into a maximum bring-up state.  |
| void | **configure**()<br>Convenience for the common "bring this device fully operational" case (configure(Op)).  |
| | **DeviceFacade**(ecdev::IEthercatDevice * device, std::string name) |

**Protected Attributes inherited from ecfacade::DeviceFacade**

|                | Name           |
| -------------- | -------------- |
| std::string | **name_**  |
| ecdev::IEthercatDevice * | **device_**  |

## Detailed Description

```cpp
class ecfacade::Encoder;
```

High-level encoder handle. 

Thin wrapper over an `[ecdev::IEncoderProfile](/lxmaster/api/classes/IEncoderProfile)`; the application reads position/velocity/status without seeing CoE objects or the backend. 

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