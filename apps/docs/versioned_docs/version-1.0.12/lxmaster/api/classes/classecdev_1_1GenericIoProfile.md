<!-- GENERATED - do not edit. Produced from the LXMASTER public
     headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->
---
title: ecdev::GenericIoProfile
summary: Protocol-agnostic digital/analog I/O profile. 

---

# ecdev::GenericIoProfile



Protocol-agnostic digital/analog I/O profile.  [More...](#detailed-description)


`#include <generic_io_profile.hpp>`

Inherits from [ecdev::IDeviceProfile](/lxmaster/api/classes/classecdev_1_1ideviceprofile), [ecdev::IIoProfile](/lxmaster/api/classes/classecdev_1_1iioprofile), IDeviceLifecycle

Inherited by [ecdev::CiA401IoProfile](/lxmaster/api/classes/classecdev_1_1cia401ioprofile)

## Public Functions

|                | Name           |
| -------------- | -------------- |
| virtual void | **[writeOutputs](/lxmaster/api/classes/classecdev_1_1genericioprofile#function-writeoutputs)**([ProcessImage](/lxmaster/api/classes/classecdev_1_1processimage) & image, std::uint64_t cycle_count) override |
| virtual void | **[setDigitalOutput](/lxmaster/api/classes/classecdev_1_1genericioprofile#function-setdigitaloutput)**(std::size_t channel, bool value) override<br>Command a digital output channel; out-of-range is a no-op.  |
| virtual void | **[setAnalogOutput](/lxmaster/api/classes/classecdev_1_1genericioprofile#function-setanalogoutput)**(std::size_t channel, std::int32_t value) override<br>Command an analog output channel (raw counts); out-of-range is a no-op.  |
| virtual void | **[resolveTopology](/lxmaster/api/classes/classecdev_1_1genericioprofile#function-resolvetopology)**(const [ProcessImage](/lxmaster/api/classes/classecdev_1_1processimage) & image) override<br>Resolve the static channel/PDO topology from the ENI-derived process image.  |
| virtual void | **[readInputs](/lxmaster/api/classes/classecdev_1_1genericioprofile#function-readinputs)**(const [ProcessImage](/lxmaster/api/classes/classecdev_1_1processimage) & image, bool wkc_valid, bool operational) override |
| virtual const char * | **[profileName](/lxmaster/api/classes/classecdev_1_1genericioprofile#function-profilename)**() const override<br>Stable identifier for diagnostics (e.g.  |
| virtual std::size_t | **[digitalOutputCount](/lxmaster/api/classes/classecdev_1_1genericioprofile#function-digitaloutputcount)**() const override |
| virtual bool | **[digitalOutput](/lxmaster/api/classes/classecdev_1_1genericioprofile#function-digitaloutput)**(std::size_t ch) const override |
| virtual std::size_t | **[digitalInputCount](/lxmaster/api/classes/classecdev_1_1genericioprofile#function-digitalinputcount)**() const override |
| virtual bool | **[digitalInput](/lxmaster/api/classes/classecdev_1_1genericioprofile#function-digitalinput)**(std::size_t channel) const override<br>Read a digital input/output channel; out-of-range returns false.  |
| virtual std::string | **[configurePreOp](/lxmaster/api/classes/classecdev_1_1genericioprofile#function-configurepreop)**(ISlaveServices & svc, [ProcessImage](/lxmaster/api/classes/classecdev_1_1processimage) & image) override |
| virtual [IIoProfile](/lxmaster/api/classes/classecdev_1_1iioprofile) * | **[asIo](/lxmaster/api/classes/classecdev_1_1genericioprofile#function-asio)**() override |
| virtual std::size_t | **[analogOutputCount](/lxmaster/api/classes/classecdev_1_1genericioprofile#function-analogoutputcount)**() const override |
| virtual std::int32_t | **[analogOutput](/lxmaster/api/classes/classecdev_1_1genericioprofile#function-analogoutput)**(std::size_t ch) const override |
| virtual std::size_t | **[analogInputCount](/lxmaster/api/classes/classecdev_1_1genericioprofile#function-analoginputcount)**() const override |
| virtual std::int32_t | **[analogInput](/lxmaster/api/classes/classecdev_1_1genericioprofile#function-analoginput)**(std::size_t channel) const override<br>Read an analog input/output channel (raw counts); out-of-range returns 0.  |

## Public Attributes

|                | Name           |
| -------------- | -------------- |
| constexpr std::size_t | **[kMaxDigital](/lxmaster/api/classes/classecdev_1_1genericioprofile#variable-kmaxdigital)**  |
| constexpr std::size_t | **[kMaxAnalog](/lxmaster/api/classes/classecdev_1_1genericioprofile#variable-kmaxanalog)**  |

## Additional inherited members

**Public Functions inherited from [ecdev::IDeviceProfile](/lxmaster/api/classes/classecdev_1_1ideviceprofile)**

|                | Name           |
| -------------- | -------------- |
| | **[~IDeviceProfile](/lxmaster/api/classes/classecdev_1_1ideviceprofile#function-~ideviceprofile)**() override =default |
| virtual void | **[primeOutputs](/lxmaster/api/classes/classecdev_1_1ideviceprofile#function-primeoutputs)**([ProcessImage](/lxmaster/api/classes/classecdev_1_1processimage) & image) |
| virtual std::string | **[prepareSafeOp](/lxmaster/api/classes/classecdev_1_1ideviceprofile#function-preparesafeop)**(ISlaveServices & svc, [ProcessImage](/lxmaster/api/classes/classecdev_1_1processimage) & image) |
| virtual void | **[captureExitDiagnostics](/lxmaster/api/classes/classecdev_1_1ideviceprofile#function-captureexitdiagnostics)**(ISlaveServices & svc)<br>End-of-run, after the RT thread has joined; safe to do SDO reads via `svc`.  |
| virtual [IMotionProfile](/lxmaster/api/classes/classecdev_1_1imotionprofile) * | **[asMotion](/lxmaster/api/classes/classecdev_1_1ideviceprofile#function-asmotion)**() |
| virtual [IEncoderProfile](/lxmaster/api/classes/classecdev_1_1iencoderprofile) * | **[asEncoder](/lxmaster/api/classes/classecdev_1_1ideviceprofile#function-asencoder)**() |

**Public Functions inherited from [ecdev::IIoProfile](/lxmaster/api/classes/classecdev_1_1iioprofile)**

|                | Name           |
| -------------- | -------------- |
| virtual | **[~IIoProfile](/lxmaster/api/classes/classecdev_1_1iioprofile#function-~iioprofile)**() =default |


## Detailed Description

```cpp
class ecdev::GenericIoProfile;
```

Protocol-agnostic digital/analog I/O profile. 

Exposes a slave's mapped process data as typed channels through `[IIoProfile](/lxmaster/api/classes/classecdev_1_1iioprofile)`, which the `IoModule` facade wraps &ndash; with no dependence on CoE, a specific CiA profile, or any vendor object layout. Works for simple (non-CoE) terminals (e.g. Beckhoff EL2xxx/EL1xxx) as well as CoE I/O.

Channel model (purely structural, from the process image):

* A PDO object in the CiA 401 digital area (0x6000-0x63FF) is treated as packed booleans and expanded to one digital channel per bit.
* Any other 1-bit entry is a single digital channel (e.g. Beckhoff 0x7000:01 BOOL outputs).
* Any wider entry is a scalar analog channel (8/16/32-bit). Direction follows the PDO (RxPDO = output, TxPDO = input).

Subclasses (e.g. `[CiA401IoProfile](/lxmaster/api/classes/classecdev_1_1cia401ioprofile)`) may override `[profileName()](/lxmaster/api/classes/classecdev_1_1genericioprofile#function-profilename)` and add device-class specific setup; the channel logic here is shared. 

## Public Functions Documentation

### function writeOutputs

```cpp
virtual void writeOutputs(
    ProcessImage & image,
    std::uint64_t cycle_count
) override
```


**Reimplements**: [ecdev::IDeviceProfile::writeOutputs](/lxmaster/api/classes/classecdev_1_1ideviceprofile#function-writeoutputs)


### function setDigitalOutput

```cpp
inline virtual void setDigitalOutput(
    std::size_t channel,
    bool value
) override
```

Command a digital output channel; out-of-range is a no-op. 

**Reimplements**: [ecdev::IIoProfile::setDigitalOutput](/lxmaster/api/classes/classecdev_1_1iioprofile#function-setdigitaloutput)


### function setAnalogOutput

```cpp
inline virtual void setAnalogOutput(
    std::size_t channel,
    std::int32_t value
) override
```

Command an analog output channel (raw counts); out-of-range is a no-op. 

**Reimplements**: [ecdev::IIoProfile::setAnalogOutput](/lxmaster/api/classes/classecdev_1_1iioprofile#function-setanalogoutput)


### function resolveTopology

```cpp
inline virtual void resolveTopology(
    const ProcessImage & image
) override
```

Resolve the static channel/PDO topology from the ENI-derived process image. 

**Reimplements**: [ecdev::IDeviceProfile::resolveTopology](/lxmaster/api/classes/classecdev_1_1ideviceprofile#function-resolvetopology)


Called once when the profile is attached to its device (during binding, before `start()`), so facade capability queries such as `IIoProfile::digitalOutputCount()` are valid as soon as the bus is bound — before any live PRE_OP SDO work. The image carries only ENI geometry here (it is not yet bound to the live IOmap), which is all a structural resolve needs. Default: no-op. Idempotent: `configurePreOp` may resolve again from the same image during `start()`. 


### function readInputs

```cpp
virtual void readInputs(
    const ProcessImage & image,
    bool wkc_valid,
    bool operational
) override
```


**Reimplements**: [ecdev::IDeviceProfile::readInputs](/lxmaster/api/classes/classecdev_1_1ideviceprofile#function-readinputs)


### function profileName

```cpp
inline virtual const char * profileName() const override
```

Stable identifier for diagnostics (e.g. 

**Reimplements**: [ecdev::IDeviceProfile::profileName](/lxmaster/api/classes/classecdev_1_1ideviceprofile#function-profilename)


"CiA402-drive"). 


### function digitalOutputCount

```cpp
inline virtual std::size_t digitalOutputCount() const override
```


**Reimplements**: [ecdev::IIoProfile::digitalOutputCount](/lxmaster/api/classes/classecdev_1_1iioprofile#function-digitaloutputcount)


### function digitalOutput

```cpp
inline virtual bool digitalOutput(
    std::size_t ch
) const override
```


**Reimplements**: [ecdev::IIoProfile::digitalOutput](/lxmaster/api/classes/classecdev_1_1iioprofile#function-digitaloutput)


### function digitalInputCount

```cpp
inline virtual std::size_t digitalInputCount() const override
```


**Reimplements**: [ecdev::IIoProfile::digitalInputCount](/lxmaster/api/classes/classecdev_1_1iioprofile#function-digitalinputcount)


### function digitalInput

```cpp
inline virtual bool digitalInput(
    std::size_t channel
) const override
```

Read a digital input/output channel; out-of-range returns false. 

**Reimplements**: [ecdev::IIoProfile::digitalInput](/lxmaster/api/classes/classecdev_1_1iioprofile#function-digitalinput)


### function configurePreOp

```cpp
virtual std::string configurePreOp(
    ISlaveServices & svc,
    ProcessImage & image
) override
```


**Reimplements**: [ecdev::IDeviceProfile::configurePreOp](/lxmaster/api/classes/classecdev_1_1ideviceprofile#function-configurepreop)


### function asIo

```cpp
inline virtual IIoProfile * asIo() override
```


**Reimplements**: [ecdev::IDeviceProfile::asIo](/lxmaster/api/classes/classecdev_1_1ideviceprofile#function-asio)


### function analogOutputCount

```cpp
inline virtual std::size_t analogOutputCount() const override
```


**Reimplements**: [ecdev::IIoProfile::analogOutputCount](/lxmaster/api/classes/classecdev_1_1iioprofile#function-analogoutputcount)


### function analogOutput

```cpp
inline virtual std::int32_t analogOutput(
    std::size_t ch
) const override
```


**Reimplements**: [ecdev::IIoProfile::analogOutput](/lxmaster/api/classes/classecdev_1_1iioprofile#function-analogoutput)


### function analogInputCount

```cpp
inline virtual std::size_t analogInputCount() const override
```


**Reimplements**: [ecdev::IIoProfile::analogInputCount](/lxmaster/api/classes/classecdev_1_1iioprofile#function-analoginputcount)


### function analogInput

```cpp
inline virtual std::int32_t analogInput(
    std::size_t channel
) const override
```

Read an analog input/output channel (raw counts); out-of-range returns 0. 

**Reimplements**: [ecdev::IIoProfile::analogInput](/lxmaster/api/classes/classecdev_1_1iioprofile#function-analoginput)


## Public Attributes Documentation

### variable kMaxDigital

```cpp
static constexpr std::size_t kMaxDigital = 256;
```


### variable kMaxAnalog

```cpp
static constexpr std::size_t kMaxAnalog = 64;
```


-------------------------------

Updated on 2026-07-04 at 20:22:54 +0000