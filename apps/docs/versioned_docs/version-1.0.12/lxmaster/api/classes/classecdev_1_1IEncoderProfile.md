---
title: "ecdev::IEncoderProfile"
summary: "Facade-facing contract for an encoder / position sensor (CiA 406 family)."

slug: /lxmaster/api/classes/IEncoderProfile
sidebar_label: "IEncoderProfile"
---
<!-- GENERATED - do not edit. Produced from the LXMASTER public
     headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->

# ecdev::IEncoderProfile



Facade-facing contract for an encoder / position sensor (CiA 406 family).  [More...](#detailed-description)


`#include <encoder_profile.hpp>`

Inherited by [ecdev::CiA406EncoderProfile](/lxmaster/api/classes/CiA406EncoderProfile)

## Public Functions

|                | Name           |
| -------------- | -------------- |
| virtual | **[~IEncoderProfile](/lxmaster/api/classes/IEncoderProfile#function-~iencoderprofile)**() =default |
| virtual std::int32_t | **[velocity](/lxmaster/api/classes/IEncoderProfile#function-velocity)**() const =0<br>Latest velocity value, if the sensor maps one (otherwise 0).  |
| virtual std::uint16_t | **[status](/lxmaster/api/classes/IEncoderProfile#function-status)**() const =0<br>Raw status/operating-status word, if mapped (otherwise 0).  |
| virtual std::int32_t | **[position](/lxmaster/api/classes/IEncoderProfile#function-position)**() const =0<br>Latest position value (counts) from the sensor.  |

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

**Reimplemented by**: [ecdev::CiA406EncoderProfile::velocity](/lxmaster/api/classes/CiA406EncoderProfile#function-velocity)


### function status

```cpp
virtual std::uint16_t status() const =0
```

Raw status/operating-status word, if mapped (otherwise 0). 

**Reimplemented by**: [ecdev::CiA406EncoderProfile::status](/lxmaster/api/classes/CiA406EncoderProfile#function-status)


### function position

```cpp
virtual std::int32_t position() const =0
```

Latest position value (counts) from the sensor. 

**Reimplemented by**: [ecdev::CiA406EncoderProfile::position](/lxmaster/api/classes/CiA406EncoderProfile#function-position)


-------------------------------

Updated on 2026-07-04 at 20:22:54 +0000