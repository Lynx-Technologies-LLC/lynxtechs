---
title:" \"ecdev::IIoProfile\""
summary:" \"Facade-facing contract for a digital/analog I/O device (CiA 401 family).\""

slug: /api/classes/IIoProfile
sidebar_label: "IIoProfile"
---

<!-- GENERATED - do not edit. Produced from the LXMASTER public headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->
# ecdev::IIoProfile



Facade-facing contract for a digital/analog I/O device (CiA 401 family).  [More...](#detailed-description)


`#include <io_profile.hpp>`

Inherited by [ecdev::GenericIoProfile](/lxmaster/api/classes/GenericIoProfile)

## Public Functions

|                | Name           |
| -------------- | -------------- |
| virtual | **[~IIoProfile](/lxmaster/api/classes/IIoProfile#function-~iioprofile)**() =default |
| virtual void | **[setDigitalOutput](/lxmaster/api/classes/IIoProfile#function-setdigitaloutput)**(std::size_t channel, bool value) =0<br>Command a digital output channel; out-of-range is a no-op.  |
| virtual void | **[setAnalogOutput](/lxmaster/api/classes/IIoProfile#function-setanalogoutput)**(std::size_t channel, std::int32_t value) =0<br>Command an analog output channel (raw counts); out-of-range is a no-op.  |
| virtual std::size_t | **[digitalOutputCount](/lxmaster/api/classes/IIoProfile#function-digitaloutputcount)**() const =0 |
| virtual bool | **[digitalOutput](/lxmaster/api/classes/IIoProfile#function-digitaloutput)**(std::size_t channel) const =0 |
| virtual std::size_t | **[digitalInputCount](/lxmaster/api/classes/IIoProfile#function-digitalinputcount)**() const =0 |
| virtual bool | **[digitalInput](/lxmaster/api/classes/IIoProfile#function-digitalinput)**(std::size_t channel) const =0<br>Read a digital input/output channel; out-of-range returns false.  |
| virtual std::size_t | **[analogOutputCount](/lxmaster/api/classes/IIoProfile#function-analogoutputcount)**() const =0 |
| virtual std::int32_t | **[analogOutput](/lxmaster/api/classes/IIoProfile#function-analogoutput)**(std::size_t channel) const =0 |
| virtual std::size_t | **[analogInputCount](/lxmaster/api/classes/IIoProfile#function-analoginputcount)**() const =0 |
| virtual std::int32_t | **[analogInput](/lxmaster/api/classes/IIoProfile#function-analoginput)**(std::size_t channel) const =0<br>Read an analog input/output channel (raw counts); out-of-range returns 0.  |

## Detailed Description

```cpp
class ecdev::IIoProfile;
```

Facade-facing contract for a digital/analog I/O device (CiA 401 family). 

The `IoModule` facade depends only on this &ndash; never on PDO offsets, CoE objects, or the backend. Channels are numbered from 0 in process-image order. All methods are safe to call from an application thread while the RT cycle runs (backed by lock-free state). 

## Public Functions Documentation

### function ~IIoProfile

```cpp
virtual ~IIoProfile() =default
```


### function setDigitalOutput

```cpp
virtual void setDigitalOutput(
    std::size_t channel,
    bool value
) =0
```

Command a digital output channel; out-of-range is a no-op. 

**Reimplemented by**: [ecdev::GenericIoProfile::setDigitalOutput](/lxmaster/api/classes/GenericIoProfile#function-setdigitaloutput)


### function setAnalogOutput

```cpp
virtual void setAnalogOutput(
    std::size_t channel,
    std::int32_t value
) =0
```

Command an analog output channel (raw counts); out-of-range is a no-op. 

**Reimplemented by**: [ecdev::GenericIoProfile::setAnalogOutput](/lxmaster/api/classes/GenericIoProfile#function-setanalogoutput)


### function digitalOutputCount

```cpp
virtual std::size_t digitalOutputCount() const =0
```


**Reimplemented by**: [ecdev::GenericIoProfile::digitalOutputCount](/lxmaster/api/classes/GenericIoProfile#function-digitaloutputcount)


### function digitalOutput

```cpp
virtual bool digitalOutput(
    std::size_t channel
) const =0
```


**Reimplemented by**: [ecdev::GenericIoProfile::digitalOutput](/lxmaster/api/classes/GenericIoProfile#function-digitaloutput)


### function digitalInputCount

```cpp
virtual std::size_t digitalInputCount() const =0
```


**Reimplemented by**: [ecdev::GenericIoProfile::digitalInputCount](/lxmaster/api/classes/GenericIoProfile#function-digitalinputcount)


### function digitalInput

```cpp
virtual bool digitalInput(
    std::size_t channel
) const =0
```

Read a digital input/output channel; out-of-range returns false. 

**Reimplemented by**: [ecdev::GenericIoProfile::digitalInput](/lxmaster/api/classes/GenericIoProfile#function-digitalinput)


### function analogOutputCount

```cpp
virtual std::size_t analogOutputCount() const =0
```


**Reimplemented by**: [ecdev::GenericIoProfile::analogOutputCount](/lxmaster/api/classes/GenericIoProfile#function-analogoutputcount)


### function analogOutput

```cpp
virtual std::int32_t analogOutput(
    std::size_t channel
) const =0
```


**Reimplemented by**: [ecdev::GenericIoProfile::analogOutput](/lxmaster/api/classes/GenericIoProfile#function-analogoutput)


### function analogInputCount

```cpp
virtual std::size_t analogInputCount() const =0
```


**Reimplemented by**: [ecdev::GenericIoProfile::analogInputCount](/lxmaster/api/classes/GenericIoProfile#function-analoginputcount)


### function analogInput

```cpp
virtual std::int32_t analogInput(
    std::size_t channel
) const =0
```

Read an analog input/output channel (raw counts); out-of-range returns 0. 

**Reimplemented by**: [ecdev::GenericIoProfile::analogInput](/lxmaster/api/classes/GenericIoProfile#function-analoginput)


-------------------------------

Updated on 2026-07-04 at 22:59:44 +0000