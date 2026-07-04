---
title:" \"ecfacade::Encoder\""
summary:" \"High-level encoder handle.\""

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
| std::int32_t | **[velocity](/lxmaster/api/classes/Encoder#function-velocity)**() const |
| std::uint16_t | **[status](/lxmaster/api/classes/Encoder#function-status)**() const |
| std::int32_t | **[position](/lxmaster/api/classes/Encoder#function-position)**() const |
| [ecdev::IEncoderProfile](/lxmaster/api/classes/IEncoderProfile) * | **[encoderProfile](/lxmaster/api/classes/Encoder#function-encoderprofile)**() const |
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

Updated on 2026-07-04 at 22:59:44 +0000