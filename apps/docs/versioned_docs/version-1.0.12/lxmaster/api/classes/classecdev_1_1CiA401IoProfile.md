<!-- GENERATED - do not edit. Produced from the LXMASTER public
     headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->
---
title: ecdev::CiA401IoProfile
summary: CiA 401 (CANopen generic I/O) profile. 

---

# ecdev::CiA401IoProfile



CiA 401 (CANopen generic I/O) profile.  [More...](#detailed-description)


`#include <cia401_io_profile.hpp>`

Inherits from [ecdev::GenericIoProfile](/lxmaster/api/classes/classecdev_1_1genericioprofile), [ecdev::IDeviceProfile](/lxmaster/api/classes/classecdev_1_1ideviceprofile), [ecdev::IIoProfile](/lxmaster/api/classes/classecdev_1_1iioprofile), IDeviceLifecycle

## Public Functions

|                | Name           |
| -------------- | -------------- |
| virtual const char * | **[profileName](/lxmaster/api/classes/classecdev_1_1cia401ioprofile#function-profilename)**() const override<br>Stable identifier for diagnostics (e.g.  |

## Additional inherited members

**Public Functions inherited from [ecdev::GenericIoProfile](/lxmaster/api/classes/classecdev_1_1genericioprofile)**

|                | Name           |
| -------------- | -------------- |
| virtual void | **[writeOutputs](/lxmaster/api/classes/classecdev_1_1genericioprofile#function-writeoutputs)**([ProcessImage](/lxmaster/api/classes/classecdev_1_1processimage) & image, std::uint64_t cycle_count) override |
| virtual void | **[setDigitalOutput](/lxmaster/api/classes/classecdev_1_1genericioprofile#function-setdigitaloutput)**(std::size_t channel, bool value) override<br>Command a digital output channel; out-of-range is a no-op.  |
| virtual void | **[setAnalogOutput](/lxmaster/api/classes/classecdev_1_1genericioprofile#function-setanalogoutput)**(std::size_t channel, std::int32_t value) override<br>Command an analog output channel (raw counts); out-of-range is a no-op.  |
| virtual void | **[resolveTopology](/lxmaster/api/classes/classecdev_1_1genericioprofile#function-resolvetopology)**(const [ProcessImage](/lxmaster/api/classes/classecdev_1_1processimage) & image) override<br>Resolve the static channel/PDO topology from the ENI-derived process image.  |
| virtual void | **[readInputs](/lxmaster/api/classes/classecdev_1_1genericioprofile#function-readinputs)**(const [ProcessImage](/lxmaster/api/classes/classecdev_1_1processimage) & image, bool wkc_valid, bool operational) override |
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

**Public Attributes inherited from [ecdev::GenericIoProfile](/lxmaster/api/classes/classecdev_1_1genericioprofile)**

|                | Name           |
| -------------- | -------------- |
| constexpr std::size_t | **[kMaxDigital](/lxmaster/api/classes/classecdev_1_1genericioprofile#variable-kmaxdigital)**  |
| constexpr std::size_t | **[kMaxAnalog](/lxmaster/api/classes/classecdev_1_1genericioprofile#variable-kmaxanalog)**  |

**Public Functions inherited from [ecdev::IDeviceProfile](/lxmaster/api/classes/classecdev_1_1ideviceprofile)**

|                | Name           |
| -------------- | -------------- |
| | **[~IDeviceProfile](/lxmaster/api/classes/classecdev_1_1ideviceprofile#function-~ideviceprofile)**() override =default |
| virtual void | **[writeOutputs](/lxmaster/api/classes/classecdev_1_1ideviceprofile#function-writeoutputs)**([ProcessImage](/lxmaster/api/classes/classecdev_1_1processimage) & image, std::uint64_t cycle_count) |
| virtual void | **[resolveTopology](/lxmaster/api/classes/classecdev_1_1ideviceprofile#function-resolvetopology)**(const [ProcessImage](/lxmaster/api/classes/classecdev_1_1processimage) & image)<br>Resolve the static channel/PDO topology from the ENI-derived process image.  |
| virtual void | **[readInputs](/lxmaster/api/classes/classecdev_1_1ideviceprofile#function-readinputs)**(const [ProcessImage](/lxmaster/api/classes/classecdev_1_1processimage) & image, bool wkc_valid, bool operational) |
| virtual void | **[primeOutputs](/lxmaster/api/classes/classecdev_1_1ideviceprofile#function-primeoutputs)**([ProcessImage](/lxmaster/api/classes/classecdev_1_1processimage) & image) |
| virtual std::string | **[prepareSafeOp](/lxmaster/api/classes/classecdev_1_1ideviceprofile#function-preparesafeop)**(ISlaveServices & svc, [ProcessImage](/lxmaster/api/classes/classecdev_1_1processimage) & image) |
| virtual std::string | **[configurePreOp](/lxmaster/api/classes/classecdev_1_1ideviceprofile#function-configurepreop)**(ISlaveServices & svc, [ProcessImage](/lxmaster/api/classes/classecdev_1_1processimage) & image) |
| virtual void | **[captureExitDiagnostics](/lxmaster/api/classes/classecdev_1_1ideviceprofile#function-captureexitdiagnostics)**(ISlaveServices & svc)<br>End-of-run, after the RT thread has joined; safe to do SDO reads via `svc`.  |
| virtual [IMotionProfile](/lxmaster/api/classes/classecdev_1_1imotionprofile) * | **[asMotion](/lxmaster/api/classes/classecdev_1_1ideviceprofile#function-asmotion)**() |
| virtual [IIoProfile](/lxmaster/api/classes/classecdev_1_1iioprofile) * | **[asIo](/lxmaster/api/classes/classecdev_1_1ideviceprofile#function-asio)**() |
| virtual [IEncoderProfile](/lxmaster/api/classes/classecdev_1_1iencoderprofile) * | **[asEncoder](/lxmaster/api/classes/classecdev_1_1ideviceprofile#function-asencoder)**() |

**Public Functions inherited from [ecdev::IIoProfile](/lxmaster/api/classes/classecdev_1_1iioprofile)**

|                | Name           |
| -------------- | -------------- |
| virtual | **[~IIoProfile](/lxmaster/api/classes/classecdev_1_1iioprofile#function-~iioprofile)**() =default |
| virtual void | **[setDigitalOutput](/lxmaster/api/classes/classecdev_1_1iioprofile#function-setdigitaloutput)**(std::size_t channel, bool value) =0<br>Command a digital output channel; out-of-range is a no-op.  |
| virtual void | **[setAnalogOutput](/lxmaster/api/classes/classecdev_1_1iioprofile#function-setanalogoutput)**(std::size_t channel, std::int32_t value) =0<br>Command an analog output channel (raw counts); out-of-range is a no-op.  |
| virtual std::size_t | **[digitalOutputCount](/lxmaster/api/classes/classecdev_1_1iioprofile#function-digitaloutputcount)**() const =0 |
| virtual bool | **[digitalOutput](/lxmaster/api/classes/classecdev_1_1iioprofile#function-digitaloutput)**(std::size_t channel) const =0 |
| virtual std::size_t | **[digitalInputCount](/lxmaster/api/classes/classecdev_1_1iioprofile#function-digitalinputcount)**() const =0 |
| virtual bool | **[digitalInput](/lxmaster/api/classes/classecdev_1_1iioprofile#function-digitalinput)**(std::size_t channel) const =0<br>Read a digital input/output channel; out-of-range returns false.  |
| virtual std::size_t | **[analogOutputCount](/lxmaster/api/classes/classecdev_1_1iioprofile#function-analogoutputcount)**() const =0 |
| virtual std::int32_t | **[analogOutput](/lxmaster/api/classes/classecdev_1_1iioprofile#function-analogoutput)**(std::size_t channel) const =0 |
| virtual std::size_t | **[analogInputCount](/lxmaster/api/classes/classecdev_1_1iioprofile#function-analoginputcount)**() const =0 |
| virtual std::int32_t | **[analogInput](/lxmaster/api/classes/classecdev_1_1iioprofile#function-analoginput)**(std::size_t channel) const =0<br>Read an analog input/output channel (raw counts); out-of-range returns 0.  |


## Detailed Description

```cpp
class ecdev::CiA401IoProfile;
```

CiA 401 (CANopen generic I/O) profile. 

A dedicated profile for genuine CoE CiA401 devices, selected ahead of `[GenericIoProfile](/lxmaster/api/classes/classecdev_1_1genericioprofile)` for slaves that expose the CiA401 standard object ranges over a CoE mailbox. The channel model is inherited from `[GenericIoProfile](/lxmaster/api/classes/classecdev_1_1genericioprofile)`; this class is the seam where CiA401-specific setup (configuration objects, input filters, interrupt masks) would be added. Non-CoE / vendor I/O terminals fall through to `[GenericIoProfile](/lxmaster/api/classes/classecdev_1_1genericioprofile)` instead. 

## Public Functions Documentation

### function profileName

```cpp
inline virtual const char * profileName() const override
```

Stable identifier for diagnostics (e.g. 

**Reimplements**: [ecdev::IDeviceProfile::profileName](/lxmaster/api/classes/classecdev_1_1ideviceprofile#function-profilename)


"CiA402-drive"). 


-------------------------------

Updated on 2026-07-04 at 20:22:54 +0000