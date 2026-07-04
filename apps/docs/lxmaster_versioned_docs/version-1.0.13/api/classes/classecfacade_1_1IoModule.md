---
title:" \"ecfacade::IoModule\""
summary:" \"High-level digital/analog I/O handle.\""

slug: /api/classes/IoModule
sidebar_label: "IoModule"
---

<!-- GENERATED - do not edit. Produced from the LXMASTER public headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->
# ecfacade::IoModule



High-level digital/analog I/O handle.  [More...](#detailed-description)


`#include <io_module.hpp>`

Inherits from DeviceFacade

## Public Functions

|                | Name           |
| -------------- | -------------- |
| void | **[writeDigital](/lxmaster/api/classes/IoModule#function-writedigital)**(std::size_t channel, bool value) |
| void | **[writeAnalog](/lxmaster/api/classes/IoModule#function-writeanalog)**(std::size_t channel, std::int32_t value) |
| bool | **[readDigital](/lxmaster/api/classes/IoModule#function-readdigital)**(std::size_t channel) const |
| std::int32_t | **[readAnalog](/lxmaster/api/classes/IoModule#function-readanalog)**(std::size_t channel) const |
| [ecdev::IIoProfile](/lxmaster/api/classes/IIoProfile) * | **[ioProfile](/lxmaster/api/classes/IoModule#function-ioprofile)**() const |
| bool | **[digitalOutputState](/lxmaster/api/classes/IoModule#function-digitaloutputstate)**(std::size_t channel) const |
| std::size_t | **[digitalOutputCount](/lxmaster/api/classes/IoModule#function-digitaloutputcount)**() const |
| std::size_t | **[digitalInputCount](/lxmaster/api/classes/IoModule#function-digitalinputcount)**() const |
| std::int32_t | **[analogOutputState](/lxmaster/api/classes/IoModule#function-analogoutputstate)**(std::size_t channel) const |
| std::size_t | **[analogOutputCount](/lxmaster/api/classes/IoModule#function-analogoutputcount)**() const |
| std::size_t | **[analogInputCount](/lxmaster/api/classes/IoModule#function-analoginputcount)**() const |
| | **[IoModule](/lxmaster/api/classes/IoModule#function-iomodule)**([ecdev::IIoProfile](/lxmaster/api/classes/IIoProfile) * io, std::string name, ecdev::IEthercatDevice * device) |

## Detailed Description

```cpp
class ecfacade::IoModule;
```

High-level digital/analog I/O handle. 

Thin wrapper over an `[ecdev::IIoProfile](/lxmaster/api/classes/IIoProfile)`; the application reads/writes named-by-index channels without seeing CoE objects, PDO offsets, or the backend. Safe to use from the application thread during the RT cycle. 

## Public Functions Documentation

### function writeDigital

```cpp
void writeDigital(
    std::size_t channel,
    bool value
)
```


### function writeAnalog

```cpp
void writeAnalog(
    std::size_t channel,
    std::int32_t value
)
```


### function readDigital

```cpp
bool readDigital(
    std::size_t channel
) const
```


### function readAnalog

```cpp
std::int32_t readAnalog(
    std::size_t channel
) const
```


### function ioProfile

```cpp
ecdev::IIoProfile * ioProfile() const
```


### function digitalOutputState

```cpp
bool digitalOutputState(
    std::size_t channel
) const
```


### function digitalOutputCount

```cpp
std::size_t digitalOutputCount() const
```


### function digitalInputCount

```cpp
std::size_t digitalInputCount() const
```


### function analogOutputState

```cpp
std::int32_t analogOutputState(
    std::size_t channel
) const
```


### function analogOutputCount

```cpp
std::size_t analogOutputCount() const
```


### function analogInputCount

```cpp
std::size_t analogInputCount() const
```


### function IoModule

```cpp
IoModule(
    ecdev::IIoProfile * io,
    std::string name,
    ecdev::IEthercatDevice * device
)
```


-------------------------------

Updated on 2026-07-04 at 22:59:44 +0000