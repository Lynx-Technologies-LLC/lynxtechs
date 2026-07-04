<!-- GENERATED - do not edit. Produced from the LXMASTER public
     headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->
---
title: ecdev::IDeviceProfile
summary: Device-class behaviour plugged onto a GenericEniDevice. 

---

# ecdev::IDeviceProfile



Device-class behaviour plugged onto a `[GenericEniDevice]`.  [More...](#detailed-description)


`#include <device_profile.hpp>`

Inherits from IDeviceLifecycle

Inherited by [ecdev::CiA402DriveProfile](/lxmaster/api/classes/classecdev_1_1cia402driveprofile), [ecdev::CiA406EncoderProfile](/lxmaster/api/classes/classecdev_1_1cia406encoderprofile), [ecdev::GenericIoProfile](/lxmaster/api/classes/classecdev_1_1genericioprofile)

## Public Functions

|                | Name           |
| -------------- | -------------- |
| | **[~IDeviceProfile](/lxmaster/api/classes/classecdev_1_1ideviceprofile#function-~ideviceprofile)**() override =default |
| virtual void | **[writeOutputs](/lxmaster/api/classes/classecdev_1_1ideviceprofile#function-writeoutputs)**([ProcessImage](/lxmaster/api/classes/classecdev_1_1processimage) & image, std::uint64_t cycle_count) |
| virtual void | **[resolveTopology](/lxmaster/api/classes/classecdev_1_1ideviceprofile#function-resolvetopology)**(const [ProcessImage](/lxmaster/api/classes/classecdev_1_1processimage) & image)<br>Resolve the static channel/PDO topology from the ENI-derived process image.  |
| virtual void | **[readInputs](/lxmaster/api/classes/classecdev_1_1ideviceprofile#function-readinputs)**(const [ProcessImage](/lxmaster/api/classes/classecdev_1_1processimage) & image, bool wkc_valid, bool operational) |
| virtual const char * | **[profileName](/lxmaster/api/classes/classecdev_1_1ideviceprofile#function-profilename)**() const =0<br>Stable identifier for diagnostics (e.g.  |
| virtual void | **[primeOutputs](/lxmaster/api/classes/classecdev_1_1ideviceprofile#function-primeoutputs)**([ProcessImage](/lxmaster/api/classes/classecdev_1_1processimage) & image) |
| virtual std::string | **[prepareSafeOp](/lxmaster/api/classes/classecdev_1_1ideviceprofile#function-preparesafeop)**(ISlaveServices & svc, [ProcessImage](/lxmaster/api/classes/classecdev_1_1processimage) & image) |
| virtual std::string | **[configurePreOp](/lxmaster/api/classes/classecdev_1_1ideviceprofile#function-configurepreop)**(ISlaveServices & svc, [ProcessImage](/lxmaster/api/classes/classecdev_1_1processimage) & image) |
| virtual void | **[captureExitDiagnostics](/lxmaster/api/classes/classecdev_1_1ideviceprofile#function-captureexitdiagnostics)**(ISlaveServices & svc)<br>End-of-run, after the RT thread has joined; safe to do SDO reads via `svc`.  |
| virtual [IMotionProfile](/lxmaster/api/classes/classecdev_1_1imotionprofile) * | **[asMotion](/lxmaster/api/classes/classecdev_1_1ideviceprofile#function-asmotion)**() |
| virtual [IIoProfile](/lxmaster/api/classes/classecdev_1_1iioprofile) * | **[asIo](/lxmaster/api/classes/classecdev_1_1ideviceprofile#function-asio)**() |
| virtual [IEncoderProfile](/lxmaster/api/classes/classecdev_1_1iencoderprofile) * | **[asEncoder](/lxmaster/api/classes/classecdev_1_1ideviceprofile#function-asencoder)**() |

## Detailed Description

```cpp
class ecdev::IDeviceProfile;
```

Device-class behaviour plugged onto a `[GenericEniDevice]`. 

A profile understands the PDO semantics of one EtherCAT device class (CiA 402 drive, CiA 401 digital/analog I/O, CiA 406 encoder, ...) and nothing about the backend, the ENI XML, or the master. It interacts with the world through exactly two narrow contracts:



* `[ISlaveServices]` for setup-time SDO / register / PDO-pulse work (NOT on the RT path).
* `[ProcessImage](/lxmaster/api/classes/classecdev_1_1processimage)` for per-cycle reads/writes of mapped objects (RT path).

Selection is done by a `[ProfileRegistry](/lxmaster/api/classes/classecdev_1_1profileregistry)`; a new device class is added by registering a new profile, with no change to the generic device or the orchestration layer.

Threading: `configurePreOp`/`prepareSafeOp`/shutdown hooks run on the bring-up/shutdown thread while the bus is not in OPERATIONAL; `writeOutputs`/`readInputs` run on the RT cyclic thread. A profile that exposes data to application threads must do so through its own lock-free state (e.g. atomics), exactly as the facades expect. 

## Public Functions Documentation

### function ~IDeviceProfile

```cpp
~IDeviceProfile() override =default
```


### function writeOutputs

```cpp
inline virtual void writeOutputs(
    ProcessImage & image,
    std::uint64_t cycle_count
)
```


**Reimplemented by**: [ecdev::CiA402DriveProfile::writeOutputs](/lxmaster/api/classes/classecdev_1_1cia402driveprofile#function-writeoutputs), [ecdev::GenericIoProfile::writeOutputs](/lxmaster/api/classes/classecdev_1_1genericioprofile#function-writeoutputs)


### function resolveTopology

```cpp
inline virtual void resolveTopology(
    const ProcessImage & image
)
```

Resolve the static channel/PDO topology from the ENI-derived process image. 

**Reimplemented by**: [ecdev::GenericIoProfile::resolveTopology](/lxmaster/api/classes/classecdev_1_1genericioprofile#function-resolvetopology)


Called once when the profile is attached to its device (during binding, before `start()`), so facade capability queries such as `IIoProfile::digitalOutputCount()` are valid as soon as the bus is bound — before any live PRE_OP SDO work. The image carries only ENI geometry here (it is not yet bound to the live IOmap), which is all a structural resolve needs. Default: no-op. Idempotent: `configurePreOp` may resolve again from the same image during `start()`. 


### function readInputs

```cpp
inline virtual void readInputs(
    const ProcessImage & image,
    bool wkc_valid,
    bool operational
)
```


**Reimplemented by**: [ecdev::CiA402DriveProfile::readInputs](/lxmaster/api/classes/classecdev_1_1cia402driveprofile#function-readinputs), [ecdev::CiA406EncoderProfile::readInputs](/lxmaster/api/classes/classecdev_1_1cia406encoderprofile#function-readinputs), [ecdev::GenericIoProfile::readInputs](/lxmaster/api/classes/classecdev_1_1genericioprofile#function-readinputs)


### function profileName

```cpp
virtual const char * profileName() const =0
```

Stable identifier for diagnostics (e.g. 

**Reimplemented by**: [ecdev::CiA401IoProfile::profileName](/lxmaster/api/classes/classecdev_1_1cia401ioprofile#function-profilename), [ecdev::CiA402DriveProfile::profileName](/lxmaster/api/classes/classecdev_1_1cia402driveprofile#function-profilename), [ecdev::CiA406EncoderProfile::profileName](/lxmaster/api/classes/classecdev_1_1cia406encoderprofile#function-profilename), [ecdev::GenericIoProfile::profileName](/lxmaster/api/classes/classecdev_1_1genericioprofile#function-profilename)


"CiA402-drive"). 


### function primeOutputs

```cpp
inline virtual void primeOutputs(
    ProcessImage & image
)
```


**Reimplemented by**: [ecdev::CiA402DriveProfile::primeOutputs](/lxmaster/api/classes/classecdev_1_1cia402driveprofile#function-primeoutputs)


### function prepareSafeOp

```cpp
inline virtual std::string prepareSafeOp(
    ISlaveServices & svc,
    ProcessImage & image
)
```


**Reimplemented by**: [ecdev::CiA402DriveProfile::prepareSafeOp](/lxmaster/api/classes/classecdev_1_1cia402driveprofile#function-preparesafeop)


### function configurePreOp

```cpp
inline virtual std::string configurePreOp(
    ISlaveServices & svc,
    ProcessImage & image
)
```


**Reimplemented by**: [ecdev::CiA402DriveProfile::configurePreOp](/lxmaster/api/classes/classecdev_1_1cia402driveprofile#function-configurepreop), [ecdev::CiA406EncoderProfile::configurePreOp](/lxmaster/api/classes/classecdev_1_1cia406encoderprofile#function-configurepreop), [ecdev::GenericIoProfile::configurePreOp](/lxmaster/api/classes/classecdev_1_1genericioprofile#function-configurepreop)


### function captureExitDiagnostics

```cpp
inline virtual void captureExitDiagnostics(
    ISlaveServices & svc
)
```

End-of-run, after the RT thread has joined; safe to do SDO reads via `svc`. 

**Reimplemented by**: [ecdev::CiA402DriveProfile::captureExitDiagnostics](/lxmaster/api/classes/classecdev_1_1cia402driveprofile#function-captureexitdiagnostics)


### function asMotion

```cpp
inline virtual IMotionProfile * asMotion()
```


**Reimplemented by**: [ecdev::CiA402DriveProfile::asMotion](/lxmaster/api/classes/classecdev_1_1cia402driveprofile#function-asmotion)


### function asIo

```cpp
inline virtual IIoProfile * asIo()
```


**Reimplemented by**: [ecdev::GenericIoProfile::asIo](/lxmaster/api/classes/classecdev_1_1genericioprofile#function-asio)


### function asEncoder

```cpp
inline virtual IEncoderProfile * asEncoder()
```


**Reimplemented by**: [ecdev::CiA406EncoderProfile::asEncoder](/lxmaster/api/classes/classecdev_1_1cia406encoderprofile#function-asencoder)


-------------------------------

Updated on 2026-07-04 at 20:22:54 +0000