---
title: "ecfacade::IoModule"
summary: "High-level digital/analog I/O handle."

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
| void | **[writeDigital](/lxmaster/api/classes/IoModule#function-writedigital)**(std::size_t channel, bool value)<br>Command a digital output channel.  |
| void | **[writeAnalog](/lxmaster/api/classes/IoModule#function-writeanalog)**(std::size_t channel, std::int32_t value)<br>Command an analog output channel (raw counts).  |
| bool | **[readDigital](/lxmaster/api/classes/IoModule#function-readdigital)**(std::size_t channel) const<br>Read the current state of a digital input channel.  |
| std::int32_t | **[readAnalog](/lxmaster/api/classes/IoModule#function-readanalog)**(std::size_t channel) const<br>Read the current value of an analog input channel (raw counts).  |
| [ecdev::IIoProfile](/lxmaster/api/classes/IIoProfile) * | **[ioProfile](/lxmaster/api/classes/IoModule#function-ioprofile)**() const<br>Escape hatch to the underlying I/O profile contract for callers that need capabilities beyond the standard channel accessors.  |
| bool | **[digitalOutputState](/lxmaster/api/classes/IoModule#function-digitaloutputstate)**(std::size_t channel) const<br>Read back the last value written to a digital output channel.  |
| std::size_t | **[digitalOutputCount](/lxmaster/api/classes/IoModule#function-digitaloutputcount)**() const<br>Number of digital output channels available on this module (process-image order).  |
| std::size_t | **[digitalInputCount](/lxmaster/api/classes/IoModule#function-digitalinputcount)**() const<br>Number of digital input channels available on this module (process-image order).  |
| std::int32_t | **[analogOutputState](/lxmaster/api/classes/IoModule#function-analogoutputstate)**(std::size_t channel) const<br>Read back the last value written to an analog output channel (raw counts).  |
| std::size_t | **[analogOutputCount](/lxmaster/api/classes/IoModule#function-analogoutputcount)**() const<br>Number of analog output channels available on this module.  |
| std::size_t | **[analogInputCount](/lxmaster/api/classes/IoModule#function-analoginputcount)**() const<br>Number of analog input channels available on this module.  |
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

Command a digital output channel. 

**Parameters**: 

  * **channel** 0-based channel index. 
  * **value** `true` to assert the output, `false` to de-assert it. 


Out-of-range channels are silently ignored. RT-safe. 


### function writeAnalog

```cpp
void writeAnalog(
    std::size_t channel,
    std::int32_t value
)
```

Command an analog output channel (raw counts). 

**Parameters**: 

  * **channel** 0-based channel index. 
  * **value** Raw output value in process-image counts. 


Out-of-range channels are silently ignored. RT-safe. 


### function readDigital

```cpp
bool readDigital(
    std::size_t channel
) const
```

Read the current state of a digital input channel. 

**Parameters**: 

  * **channel** 0-based channel index. 


**Return**: The input state, or `false` for out-of-range channels. 

RT-safe. 


### function readAnalog

```cpp
std::int32_t readAnalog(
    std::size_t channel
) const
```

Read the current value of an analog input channel (raw counts). 

**Parameters**: 

  * **channel** 0-based channel index. 


**Return**: The raw input value, or `0` for out-of-range channels. 

RT-safe. 


### function ioProfile

```cpp
ecdev::IIoProfile * ioProfile() const
```

Escape hatch to the underlying I/O profile contract for callers that need capabilities beyond the standard channel accessors. 

**Return**: The `IIoProfile` backing this module. Never null while the module is valid. 

### function digitalOutputState

```cpp
bool digitalOutputState(
    std::size_t channel
) const
```

Read back the last value written to a digital output channel. 

**Parameters**: 

  * **channel** 0-based channel index. 


**Return**: The last commanded output state, or `false` for out-of-range channels. 

RT-safe. 


### function digitalOutputCount

```cpp
std::size_t digitalOutputCount() const
```

Number of digital output channels available on this module (process-image order). 

**Return**: Channel count; use as the exclusive upper bound for `[writeDigital()](/lxmaster/api/classes/IoModule#function-writedigital)`. 

### function digitalInputCount

```cpp
std::size_t digitalInputCount() const
```

Number of digital input channels available on this module (process-image order). 

**Return**: Channel count; use as the exclusive upper bound for `[readDigital()](/lxmaster/api/classes/IoModule#function-readdigital)`. 

### function analogOutputState

```cpp
std::int32_t analogOutputState(
    std::size_t channel
) const
```

Read back the last value written to an analog output channel (raw counts). 

**Parameters**: 

  * **channel** 0-based channel index. 


**Return**: The last commanded output value, or `0` for out-of-range channels. 

RT-safe. 


### function analogOutputCount

```cpp
std::size_t analogOutputCount() const
```

Number of analog output channels available on this module. 

**Return**: Channel count; use as the exclusive upper bound for `[writeAnalog()](/lxmaster/api/classes/IoModule#function-writeanalog)`. 

### function analogInputCount

```cpp
std::size_t analogInputCount() const
```

Number of analog input channels available on this module. 

**Return**: Channel count; use as the exclusive upper bound for `[readAnalog()](/lxmaster/api/classes/IoModule#function-readanalog)`. 

### function IoModule

```cpp
IoModule(
    ecdev::IIoProfile * io,
    std::string name,
    ecdev::IEthercatDevice * device
)
```


-------------------------------

Updated on 2026-07-13 at 20:44:41 +0000