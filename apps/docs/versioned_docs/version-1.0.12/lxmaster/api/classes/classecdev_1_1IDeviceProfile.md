---
title: "ecdev::IDeviceProfile"
summary: "Device-class behaviour plugged onto a GenericEniDevice."

slug: /lxmaster/api/classes/IDeviceProfile
sidebar_label: "IDeviceProfile"
---
<!-- GENERATED - do not edit. Produced from the LXMASTER public
     headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->

# ecdev::IDeviceProfile

Device-class behaviour plugged onto a `[GenericEniDevice]`.  [More...](#detailed-description)

`#include <device_profile.hpp>`

Inherits from IDeviceLifecycle

Inherited by [ecdev::CiA402DriveProfile](/lxmaster/api/classes/CiA402DriveProfile), [ecdev::CiA406EncoderProfile](/lxmaster/api/classes/CiA406EncoderProfile), [ecdev::GenericIoProfile](/lxmaster/api/classes/GenericIoProfile)

## Public Functions

|                | Name           |
| -------------- | -------------- |
| | **[~IDeviceProfile](/lxmaster/api/classes/IDeviceProfile#function-~ideviceprofile)**() override =default |
| virtual void | **[writeOutputs](/lxmaster/api/classes/IDeviceProfile#function-writeoutputs)**([ProcessImage](/lxmaster/api/classes/ProcessImage) & image, std::uint64_t cycle_count) |
| virtual void | **[resolveTopology](/lxmaster/api/classes/IDeviceProfile#function-resolvetopology)**(const [ProcessImage](/lxmaster/api/classes/ProcessImage) & image)<br>Resolve the static channel/PDO topology from the ENI-derived process image.  |
| virtual void | **[readInputs](/lxmaster/api/classes/IDeviceProfile#function-readinputs)**(const [ProcessImage](/lxmaster/api/classes/ProcessImage) & image, bool wkc_valid, bool operational) |
| virtual const char * | **[profileName](/lxmaster/api/classes/IDeviceProfile#function-profilename)**() const =0<br>Stable identifier for diagnostics (e.g.  |
| virtual void | **[primeOutputs](/lxmaster/api/classes/IDeviceProfile#function-primeoutputs)**([ProcessImage](/lxmaster/api/classes/ProcessImage) & image) |
| virtual std::string | **[prepareSafeOp](/lxmaster/api/classes/IDeviceProfile#function-preparesafeop)**(ISlaveServices & svc, [ProcessImage](/lxmaster/api/classes/ProcessImage) & image) |
| virtual std::string | **[configurePreOp](/lxmaster/api/classes/IDeviceProfile#function-configurepreop)**(ISlaveServices & svc, [ProcessImage](/lxmaster/api/classes/ProcessImage) & image) |
| virtual void | **[captureExitDiagnostics](/lxmaster/api/classes/IDeviceProfile#function-captureexitdiagnostics)**(ISlaveServices & svc)<br>End-of-run, after the RT thread has joined; safe to do SDO reads via `svc`.  |
| virtual [IMotionProfile](/lxmaster/api/classes/IMotionProfile) * | **[asMotion](/lxmaster/api/classes/IDeviceProfile#function-asmotion)**() |
| virtual [IIoProfile](/lxmaster/api/classes/IIoProfile) * | **[asIo](/lxmaster/api/classes/IDeviceProfile#function-asio)**() |
| virtual [IEncoderProfile](/lxmaster/api/classes/IEncoderProfile) * | **[asEncoder](/lxmaster/api/classes/IDeviceProfile#function-asencoder)**() |

## Detailed Description

```cpp
class ecdev::IDeviceProfile;
```

Device-class behaviour plugged onto a `[GenericEniDevice]`. 

A profile understands the PDO semantics of one EtherCAT device class (CiA 402 drive, CiA 401 digital/analog I/O, CiA 406 encoder, ...) and nothing about the backend, the ENI XML, or the master. It interacts with the world through exactly two narrow contracts:

* `[ISlaveServices]` for setup-time SDO / register / PDO-pulse work (NOT on the RT path).
* `[ProcessImage](/lxmaster/api/classes/ProcessImage)` for per-cycle reads/writes of mapped objects (RT path).

Selection is done by a `[ProfileRegistry](/lxmaster/api/classes/ProfileRegistry)`; a new device class is added by registering a new profile, with no change to the generic device or the orchestration layer.

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

**Reimplemented by**: [ecdev::CiA402DriveProfile::writeOutputs](/lxmaster/api/classes/CiA402DriveProfile#function-writeoutputs), [ecdev::GenericIoProfile::writeOutputs](/lxmaster/api/classes/GenericIoProfile#function-writeoutputs)

### function resolveTopology

```cpp
inline virtual void resolveTopology(
    const ProcessImage & image
)
```

Resolve the static channel/PDO topology from the ENI-derived process image. 

**Reimplemented by**: [ecdev::GenericIoProfile::resolveTopology](/lxmaster/api/classes/GenericIoProfile#function-resolvetopology)

Called once when the profile is attached to its device (during binding, before `start()`), so facade capability queries such as `IIoProfile::digitalOutputCount()` are valid as soon as the bus is bound — before any live PRE_OP SDO work. The image carries only ENI geometry here (it is not yet bound to the live IOmap), which is all a structural resolve needs. Default: no-op. Idempotent: `configurePreOp` may resolve again from the same image during `start()`. 

### function readInputs

```cpp
inline virtual void readInputs(
    const ProcessImage & image,
    bool wkc_valid,
    bool operational
)
```

**Reimplemented by**: [ecdev::CiA402DriveProfile::readInputs](/lxmaster/api/classes/CiA402DriveProfile#function-readinputs), [ecdev::CiA406EncoderProfile::readInputs](/lxmaster/api/classes/CiA406EncoderProfile#function-readinputs), [ecdev::GenericIoProfile::readInputs](/lxmaster/api/classes/GenericIoProfile#function-readinputs)

### function profileName

```cpp
virtual const char * profileName() const =0
```

Stable identifier for diagnostics (e.g. 

**Reimplemented by**: [ecdev::CiA401IoProfile::profileName](/lxmaster/api/classes/CiA401IoProfile#function-profilename), [ecdev::CiA402DriveProfile::profileName](/lxmaster/api/classes/CiA402DriveProfile#function-profilename), [ecdev::CiA406EncoderProfile::profileName](/lxmaster/api/classes/CiA406EncoderProfile#function-profilename), [ecdev::GenericIoProfile::profileName](/lxmaster/api/classes/GenericIoProfile#function-profilename)

"CiA402-drive"). 

### function primeOutputs

```cpp
inline virtual void primeOutputs(
    ProcessImage & image
)
```

**Reimplemented by**: [ecdev::CiA402DriveProfile::primeOutputs](/lxmaster/api/classes/CiA402DriveProfile#function-primeoutputs)

### function prepareSafeOp

```cpp
inline virtual std::string prepareSafeOp(
    ISlaveServices & svc,
    ProcessImage & image
)
```

**Reimplemented by**: [ecdev::CiA402DriveProfile::prepareSafeOp](/lxmaster/api/classes/CiA402DriveProfile#function-preparesafeop)

### function configurePreOp

```cpp
inline virtual std::string configurePreOp(
    ISlaveServices & svc,
    ProcessImage & image
)
```

**Reimplemented by**: [ecdev::CiA402DriveProfile::configurePreOp](/lxmaster/api/classes/CiA402DriveProfile#function-configurepreop), [ecdev::CiA406EncoderProfile::configurePreOp](/lxmaster/api/classes/CiA406EncoderProfile#function-configurepreop), [ecdev::GenericIoProfile::configurePreOp](/lxmaster/api/classes/GenericIoProfile#function-configurepreop)

### function captureExitDiagnostics

```cpp
inline virtual void captureExitDiagnostics(
    ISlaveServices & svc
)
```

End-of-run, after the RT thread has joined; safe to do SDO reads via `svc`. 

**Reimplemented by**: [ecdev::CiA402DriveProfile::captureExitDiagnostics](/lxmaster/api/classes/CiA402DriveProfile#function-captureexitdiagnostics)

### function asMotion

```cpp
inline virtual IMotionProfile * asMotion()
```

**Reimplemented by**: [ecdev::CiA402DriveProfile::asMotion](/lxmaster/api/classes/CiA402DriveProfile#function-asmotion)

### function asIo

```cpp
inline virtual IIoProfile * asIo()
```

**Reimplemented by**: [ecdev::GenericIoProfile::asIo](/lxmaster/api/classes/GenericIoProfile#function-asio)

### function asEncoder

```cpp
inline virtual IEncoderProfile * asEncoder()
```

**Reimplemented by**: [ecdev::CiA406EncoderProfile::asEncoder](/lxmaster/api/classes/CiA406EncoderProfile#function-asencoder)

-------------------------------

Updated on 2026-07-04 at 20:22:54 +0000