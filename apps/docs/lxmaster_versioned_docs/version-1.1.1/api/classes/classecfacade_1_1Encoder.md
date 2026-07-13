---
title: "ecfacade::Encoder"
summary: "High-level encoder handle."

slug: /api/classes/Encoder
sidebar_label: "Encoder"
---

<!-- GENERATED - do not edit. Produced from the LXMASTER public headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->
# ecfacade::Encoder



High-level encoder handle.  [More...](#detailed-description)


`#include <encoder.hpp>`

Inherits from DeviceFacade

## Public Functions

|                | Name           |
| -------------- | -------------- |
| std::int32_t | **[velocity](/lxmaster/api/classes/Encoder#function-velocity)**() const<br>Latest velocity reading from the sensor (counts/s).  |
| std::uint16_t | **[status](/lxmaster/api/classes/Encoder#function-status)**() const<br>Raw operating-status word from the sensor.  |
| std::int32_t | **[position](/lxmaster/api/classes/Encoder#function-position)**() const<br>Latest position reading from the sensor (encoder counts, CiA406 0x6004).  |
| [ecdev::IEncoderProfile](/lxmaster/api/classes/IEncoderProfile) * | **[encoderProfile](/lxmaster/api/classes/Encoder#function-encoderprofile)**() const<br>Escape hatch to the underlying encoder profile contract for callers that need capabilities beyond the standard position/velocity/status accessors.  |
| | **[Encoder](/lxmaster/api/classes/Encoder#function-encoder)**([ecdev::IEncoderProfile](/lxmaster/api/classes/IEncoderProfile) * enc, std::string name, ecdev::IEthercatDevice * device) |

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

Latest velocity reading from the sensor (counts/s). 

Returns 0 if the device does not map a velocity object. RT-safe. 


### function status

```cpp
std::uint16_t status() const
```

Raw operating-status word from the sensor. 

Returns 0 if the device does not map a status object. Consult the device datasheet for bit definitions. RT-safe. 


### function position

```cpp
std::int32_t position() const
```

Latest position reading from the sensor (encoder counts, CiA406 0x6004). 

RT-safe. 


### function encoderProfile

```cpp
ecdev::IEncoderProfile * encoderProfile() const
```

Escape hatch to the underlying encoder profile contract for callers that need capabilities beyond the standard position/velocity/status accessors. 

**Return**: The `IEncoderProfile` backing this encoder. Never null while the encoder is valid. 

### function Encoder

```cpp
Encoder(
    ecdev::IEncoderProfile * enc,
    std::string name,
    ecdev::IEthercatDevice * device
)
```


-------------------------------

Updated on 2026-07-13 at 20:44:41 +0000