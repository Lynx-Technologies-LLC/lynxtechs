---
title: "ecdev::IDeviceProfile"
summary: "Device-class behaviour plugged onto a GenericEniDevice."

slug: /api/classes/IDeviceProfile
sidebar_label: "IDeviceProfile"
---

<!-- GENERATED - do not edit. Produced from the LXMASTER public headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->
# ecdev::IDeviceProfile



Device-class behaviour plugged onto a `[GenericEniDevice]`.  [More...](#detailed-description)


`#include <device_profile.hpp>`

Inherits from IDeviceLifecycle

Inherited by [ecdev::CiA402DriveProfile](/lxmaster/api/classes/CiA402DriveProfile), [ecdev::CiA406EncoderProfile](/lxmaster/api/classes/CiA406EncoderProfile), [ecdev::GenericIoProfile](/lxmaster/api/classes/GenericIoProfile)

## Public Functions

|                | Name           |
| -------------- | -------------- |
| | **[~IDeviceProfile](/lxmaster/api/classes/IDeviceProfile#function-~ideviceprofile)**() override =default |
| virtual void | **[writeOutputs](/lxmaster/api/classes/IDeviceProfile#function-writeoutputs)**(ProcessImage & image, std::uint64_t cycle_count)<br>Write output PDO values for this cycle.  |
| virtual void | **[resolveTopology](/lxmaster/api/classes/IDeviceProfile#function-resolvetopology)**(const ProcessImage & image)<br>Resolve the static channel/PDO topology from the ENI-derived process image.  |
| virtual void | **[readInputs](/lxmaster/api/classes/IDeviceProfile#function-readinputs)**(const ProcessImage & image, bool wkc_valid, bool operational)<br>Read input PDO values captured this cycle.  |
| virtual const char * | **[profileName](/lxmaster/api/classes/IDeviceProfile#function-profilename)**() const =0<br>Stable identifier for diagnostics (e.g.  |
| virtual void | **[primeOutputs](/lxmaster/api/classes/IDeviceProfile#function-primeoutputs)**(ProcessImage & image)<br>Prime output PDO bytes to safe values immediately before the bus enters SAFE_OP (outputs start being transmitted).  |
| virtual std::string | **[prepareSafeOp](/lxmaster/api/classes/IDeviceProfile#function-preparesafeop)**(ISlaveServices & svc, ProcessImage & image)<br>Final configuration step before OPERATIONAL: the slave is in SAFE_OP and the PDO IOmap is live but outputs are not yet driven.  |
| virtual std::string | **[configurePreOp](/lxmaster/api/classes/IDeviceProfile#function-configurepreop)**(ISlaveServices & svc, ProcessImage & image)<br>Perform CoE / SDO configuration while the slave is in PRE_OP (bus not cycling).  |
| virtual void | **[captureExitDiagnostics](/lxmaster/api/classes/IDeviceProfile#function-captureexitdiagnostics)**(ISlaveServices & svc)<br>End-of-run hook called after the RT thread has joined; safe to perform SDO reads.  |
| virtual [IMotionProfile](/lxmaster/api/classes/IMotionProfile) * | **[asMotion](/lxmaster/api/classes/IDeviceProfile#function-asmotion)**()<br>Query whether this profile drives a motion (servo) axis.  |
| virtual [IIoProfile](/lxmaster/api/classes/IIoProfile) * | **[asIo](/lxmaster/api/classes/IDeviceProfile#function-asio)**()<br>Query whether this profile exposes digital/analog I/O channels.  |
| virtual [IEncoderProfile](/lxmaster/api/classes/IEncoderProfile) * | **[asEncoder](/lxmaster/api/classes/IDeviceProfile#function-asencoder)**()<br>Query whether this profile exposes position/velocity encoder readings.  |

## Detailed Description

```cpp
class ecdev::IDeviceProfile;
```

Device-class behaviour plugged onto a `[GenericEniDevice]`. 

A profile understands the PDO semantics of one EtherCAT device class (CiA 402 drive, CiA 401 digital/analog I/O, CiA 406 encoder, ...) and nothing about the backend, the ENI XML, or the master. It interacts with the world through exactly two narrow contracts:



* `[ISlaveServices]` for setup-time SDO / register / PDO-pulse work (NOT on the RT path).
* `[ProcessImage]` for per-cycle reads/writes of mapped objects (RT path).

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

Write output PDO values for this cycle. 

**Parameters**: 

  * **image** Live PDO byte map for this slave's output objects; write target values into it. 
  * **cycle_count** Total RT cycles executed since `start()` (monotonically increasing). 


**Reimplemented by**: [ecdev::CiA402DriveProfile::writeOutputs](/lxmaster/api/classes/CiA402DriveProfile#function-writeoutputs), [ecdev::GenericIoProfile::writeOutputs](/lxmaster/api/classes/GenericIoProfile#function-writeoutputs)


Called on the RT cyclic thread every cycle while OPERATIONAL. 


### function resolveTopology

```cpp
inline virtual void resolveTopology(
    const ProcessImage & image
)
```

Resolve the static channel/PDO topology from the ENI-derived process image. 

**Parameters**: 

  * **image** ENI-derived process image carrying the PDO geometry for this slave. 


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

Read input PDO values captured this cycle. 

**Parameters**: 

  * **image** Live PDO byte map for this slave's input objects. 
  * **wkc_valid** False when the work counter dropped this cycle — the slave may not have responded and input data may be stale. 
  * **operational** False during the OP-entry cooldown cycles after the master enters OPERATIONAL. Motion commands should be suppressed until this is true. 


**Reimplemented by**: [ecdev::CiA402DriveProfile::readInputs](/lxmaster/api/classes/CiA402DriveProfile#function-readinputs), [ecdev::CiA406EncoderProfile::readInputs](/lxmaster/api/classes/CiA406EncoderProfile#function-readinputs), [ecdev::GenericIoProfile::readInputs](/lxmaster/api/classes/GenericIoProfile#function-readinputs)


Called on the RT cyclic thread every cycle while OPERATIONAL. Profiles should guard state updates on `wkc_valid` and `operational` to avoid acting on stale data. 


### function profileName

```cpp
virtual const char * profileName() const =0
```

Stable identifier for diagnostics (e.g. 

**Return**: A null-terminated string literal naming this profile class. Must be stable for the lifetime of the profile object (a string literal in practice). 

**Reimplemented by**: [ecdev::CiA401IoProfile::profileName](/lxmaster/api/classes/CiA401IoProfile#function-profilename), [ecdev::CiA402DriveProfile::profileName](/lxmaster/api/classes/CiA402DriveProfile#function-profilename), [ecdev::CiA406EncoderProfile::profileName](/lxmaster/api/classes/CiA406EncoderProfile#function-profilename), [ecdev::GenericIoProfile::profileName](/lxmaster/api/classes/GenericIoProfile#function-profilename)


`"CiA402-drive"`). 


### function primeOutputs

```cpp
inline virtual void primeOutputs(
    ProcessImage & image
)
```

Prime output PDO bytes to safe values immediately before the bus enters SAFE_OP (outputs start being transmitted). 

**Parameters**: 

  * **image** Live PDO byte map; write safe initial output values into it. 


**Reimplemented by**: [ecdev::CiA402DriveProfile::primeOutputs](/lxmaster/api/classes/CiA402DriveProfile#function-primeoutputs)


For example, a CiA402 profile writes a Shutdown controlword here so the drive sees a valid initial state before the RT cycle starts. Called on the bring-up thread. 


### function prepareSafeOp

```cpp
inline virtual std::string prepareSafeOp(
    ISlaveServices & svc,
    ProcessImage & image
)
```

Final configuration step before OPERATIONAL: the slave is in SAFE_OP and the PDO IOmap is live but outputs are not yet driven. 

**Parameters**: 

  * **svc** Slave services handle for SDO reads/writes. 
  * **image** Live process image (IOmap is mapped but outputs are not yet driven). 


**Return**: Empty string on success; a non-empty human-readable reason string aborts bring-up. 

**Reimplemented by**: [ecdev::CiA402DriveProfile::prepareSafeOp](/lxmaster/api/classes/CiA402DriveProfile#function-preparesafeop)


Use this for last-moment readiness checks or any SDO writes that must happen after the IOmap is mapped. Called on the bring-up thread; never on the RT thread. 


### function configurePreOp

```cpp
inline virtual std::string configurePreOp(
    ISlaveServices & svc,
    ProcessImage & image
)
```

Perform CoE / SDO configuration while the slave is in PRE_OP (bus not cycling). 

**Parameters**: 

  * **svc** Slave services handle for SDO reads/writes and register access. 
  * **image** Process image for this slave; resolve PDO entry handles here for later cyclic use. 


**Return**: Empty string on success; a non-empty human-readable reason string aborts bring-up. 

**Reimplemented by**: [ecdev::CiA402DriveProfile::configurePreOp](/lxmaster/api/classes/CiA402DriveProfile#function-configurepreop), [ecdev::CiA406EncoderProfile::configurePreOp](/lxmaster/api/classes/CiA406EncoderProfile#function-configurepreop), [ecdev::GenericIoProfile::configurePreOp](/lxmaster/api/classes/GenericIoProfile#function-configurepreop)


Resolve process-image handles (PDO objects) for use in the cyclic path. Called on the bring-up thread; never on the RT thread. 


### function captureExitDiagnostics

```cpp
inline virtual void captureExitDiagnostics(
    ISlaveServices & svc
)
```

End-of-run hook called after the RT thread has joined; safe to perform SDO reads. 

**Parameters**: 

  * **svc** Slave services handle available for post-run SDO reads (e.g. fault codes). 


**Reimplemented by**: [ecdev::CiA402DriveProfile::captureExitDiagnostics](/lxmaster/api/classes/CiA402DriveProfile#function-captureexitdiagnostics)


### function asMotion

```cpp
inline virtual IMotionProfile * asMotion()
```

Query whether this profile drives a motion (servo) axis. 

**Return**: A non-null `IMotionProfile*` if so (used to back an `Axis` facade handle), or null if this profile does not implement the motion contract. 

**Reimplemented by**: [ecdev::CiA402DriveProfile::asMotion](/lxmaster/api/classes/CiA402DriveProfile#function-asmotion)


### function asIo

```cpp
inline virtual IIoProfile * asIo()
```

Query whether this profile exposes digital/analog I/O channels. 

**Return**: A non-null `IIoProfile*` if so (used to back an `IoModule` facade handle), or null if this profile does not implement the I/O contract. 

**Reimplemented by**: [ecdev::GenericIoProfile::asIo](/lxmaster/api/classes/GenericIoProfile#function-asio)


### function asEncoder

```cpp
inline virtual IEncoderProfile * asEncoder()
```

Query whether this profile exposes position/velocity encoder readings. 

**Return**: A non-null `IEncoderProfile*` if so (used to back an `Encoder` facade handle), or null if this profile does not implement the encoder contract. 

**Reimplemented by**: [ecdev::CiA406EncoderProfile::asEncoder](/lxmaster/api/classes/CiA406EncoderProfile#function-asencoder)


-------------------------------

Updated on 2026-07-13 at 20:44:41 +0000