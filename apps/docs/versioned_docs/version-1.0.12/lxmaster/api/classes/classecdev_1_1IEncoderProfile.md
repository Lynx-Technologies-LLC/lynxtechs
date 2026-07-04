<!-- GENERATED - do not edit. Produced from the LXMASTER public
     headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->
---
title: ecdev::IEncoderProfile
summary: Facade-facing contract for an encoder / position sensor (CiA 406 family). 

---

# ecdev::IEncoderProfile



Facade-facing contract for an encoder / position sensor (CiA 406 family).  [More...](#detailed-description)


`#include <encoder_profile.hpp>`

Inherited by [ecdev::CiA406EncoderProfile](/lxmaster/api/classes/classecdev_1_1cia406encoderprofile)

## Public Functions

|                | Name           |
| -------------- | -------------- |
| virtual | **[~IEncoderProfile](/lxmaster/api/classes/classecdev_1_1iencoderprofile#function-~iencoderprofile)**() =default |
| virtual std::int32_t | **[velocity](/lxmaster/api/classes/classecdev_1_1iencoderprofile#function-velocity)**() const =0<br>Latest velocity value, if the sensor maps one (otherwise 0).  |
| virtual std::uint16_t | **[status](/lxmaster/api/classes/classecdev_1_1iencoderprofile#function-status)**() const =0<br>Raw status/operating-status word, if mapped (otherwise 0).  |
| virtual std::int32_t | **[position](/lxmaster/api/classes/classecdev_1_1iencoderprofile#function-position)**() const =0<br>Latest position value (counts) from the sensor.  |

## Detailed Description

```cpp
class ecdev::IEncoderProfile;
```

Facade-facing contract for an encoder / position sensor (CiA 406 family). 

The `Encoder` facade depends only on this. Safe to call from an application thread while the RT cycle runs. 

## Public Functions Documentation

### function ~IEncoderProfile

```cpp
virtual ~IEncoderProfile() =default
```


### function velocity

```cpp
virtual std::int32_t velocity() const =0
```

Latest velocity value, if the sensor maps one (otherwise 0). 

**Reimplemented by**: [ecdev::CiA406EncoderProfile::velocity](/lxmaster/api/classes/classecdev_1_1cia406encoderprofile#function-velocity)


### function status

```cpp
virtual std::uint16_t status() const =0
```

Raw status/operating-status word, if mapped (otherwise 0). 

**Reimplemented by**: [ecdev::CiA406EncoderProfile::status](/lxmaster/api/classes/classecdev_1_1cia406encoderprofile#function-status)


### function position

```cpp
virtual std::int32_t position() const =0
```

Latest position value (counts) from the sensor. 

**Reimplemented by**: [ecdev::CiA406EncoderProfile::position](/lxmaster/api/classes/classecdev_1_1cia406encoderprofile#function-position)


-------------------------------

Updated on 2026-07-04 at 20:22:54 +0000