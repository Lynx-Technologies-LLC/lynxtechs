---
title: "ecdev::CiA402DriveProfile"
summary: "CiA 402 (CANopen-over-EtherCAT) servo-drive profile."

slug: /api/classes/CiA402DriveProfile
sidebar_label: "CiA402DriveProfile"
---

<!-- GENERATED - do not edit. Produced from the LXMASTER public headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->
# ecdev::CiA402DriveProfile



CiA 402 (CANopen-over-EtherCAT) servo-drive profile.  [More...](#detailed-description)


`#include <cia402_drive_profile.hpp>`

Inherits from [ecdev::IDeviceProfile](/lxmaster/api/classes/IDeviceProfile), [ecdev::IMotionProfile](/lxmaster/api/classes/IMotionProfile), IDeviceLifecycle

## Public Classes

|                | Name           |
| -------------- | -------------- |
| struct | **[Config](/lxmaster/api/classes/CiA402DriveProfile-Config)** <br>Per-instance configuration for a `[CiA402DriveProfile](/lxmaster/api/classes/CiA402DriveProfile)`.  |

## Public Types

|                | Name           |
| -------------- | -------------- |
| using DriveOpMode | **[OpMode](/lxmaster/api/classes/CiA402DriveProfile#using-opmode)** <br>Cyclic operation mode this profile drives.  |

## Public Functions

|                | Name           |
| -------------- | -------------- |
| virtual void | **[writeOutputs](/lxmaster/api/classes/CiA402DriveProfile#function-writeoutputs)**(ProcessImage & image, std::uint64_t cycle_count) override<br>Write output PDO values for this cycle.  |
| virtual std::int32_t | **[targetPosition](/lxmaster/api/classes/CiA402DriveProfile#function-targetposition)**() const override<br>Last target position commanded to the drive (encoder counts).  |
| virtual std::uint16_t | **[statusword](/lxmaster/api/classes/CiA402DriveProfile#function-statusword)**() const override<br>Raw DS402 statusword (CiA402 0x6041).  |
| virtual void | **[setTargetVelocity](/lxmaster/api/classes/CiA402DriveProfile#function-settargetvelocity)**(std::int32_t counts_per_sec) override<br>CSV target velocity in counts/s.  |
| virtual void | **[setTargetTorque](/lxmaster/api/classes/CiA402DriveProfile#function-settargettorque)**(std::int32_t per_mille_rated) override<br>CST target torque in per-mille of rated torque.  |
| virtual void | **[setTargetPosition](/lxmaster/api/classes/CiA402DriveProfile#function-settargetposition)**(std::int32_t counts) override<br>Command a CSP target position.  |
| virtual void | **[setOperatingMode](/lxmaster/api/classes/CiA402DriveProfile#function-setoperatingmode)**(DriveOpMode mode) override<br>Choose the operating mode.  |
| virtual void | **[setAutoFaultRecover](/lxmaster/api/classes/CiA402DriveProfile#function-setautofaultrecover)**(bool enable) override<br>Set the CiA402 auto fault-reset/recover behaviour.  |
| bool | **[requiresMotionShutdown](/lxmaster/api/classes/CiA402DriveProfile#function-requiresmotionshutdown)**() const override |
| bool | **[requiresAlShutdown](/lxmaster/api/classes/CiA402DriveProfile#function-requiresalshutdown)**() const override |
| virtual void | **[requestFaultReset](/lxmaster/api/classes/CiA402DriveProfile#function-requestfaultreset)**() override<br>One-shot fault-reset edge (acted on only while the drive reports Fault).  |
| virtual void | **[requestEnable](/lxmaster/api/classes/CiA402DriveProfile#function-requestenable)**() override<br>Request the drive walk to Operation Enabled (cancels a prior disable request).  |
| virtual void | **[requestDisable](/lxmaster/api/classes/CiA402DriveProfile#function-requestdisable)**() override<br>Request the drive walk back to a de-energised resting state.  |
| bool | **[readyForShutdown](/lxmaster/api/classes/CiA402DriveProfile#function-readyforshutdown)**() const override |
| bool | **[readyForAlShutdown](/lxmaster/api/classes/CiA402DriveProfile#function-readyforalshutdown)**() const override |
| virtual void | **[readInputs](/lxmaster/api/classes/CiA402DriveProfile#function-readinputs)**(const ProcessImage & image, bool wkc_valid, bool operational) override<br>Read input PDO values captured this cycle.  |
| virtual const char * | **[profileName](/lxmaster/api/classes/CiA402DriveProfile#function-profilename)**() const override<br>Stable identifier for diagnostics (e.g.  |
| virtual void | **[primeOutputs](/lxmaster/api/classes/CiA402DriveProfile#function-primeoutputs)**(ProcessImage & image) override<br>Prime output PDO bytes to safe values immediately before the bus enters SAFE_OP (outputs start being transmitted).  |
| void | **[prepareShutdown](/lxmaster/api/classes/CiA402DriveProfile#function-prepareshutdown)**() override |
| virtual std::string | **[prepareSafeOp](/lxmaster/api/classes/CiA402DriveProfile#function-preparesafeop)**(ISlaveServices & svc, ProcessImage & image) override<br>Final configuration step before OPERATIONAL: the slave is in SAFE_OP and the PDO IOmap is live but outputs are not yet driven.  |
| virtual std::int32_t | **[modeDisplay](/lxmaster/api/classes/CiA402DriveProfile#function-modedisplay)**() const override<br>Drive's modes-of-operation display (CiA402 0x6061; 8=CSP, 9=CSV, 10=CST).  |
| std::uint16_t | **[lastStatusWordForDiagnostics](/lxmaster/api/classes/CiA402DriveProfile#function-laststatuswordfordiagnostics)**() const override |
| virtual bool | **[isOperationEnabled](/lxmaster/api/classes/CiA402DriveProfile#function-isoperationenabled)**() const override<br>True when the DS402 state machine is in the Operation Enabled state.  |
| virtual bool | **[isFault](/lxmaster/api/classes/CiA402DriveProfile#function-isfault)**() const override<br>True when the drive reports a latched fault (DS402 Fault state, statusword bit 3).  |
| bool | **[hasLeftOperationEnabled](/lxmaster/api/classes/CiA402DriveProfile#function-hasleftoperationenabled)**() const override |
| bool | **[cyclicStopRequested](/lxmaster/api/classes/CiA402DriveProfile#function-cyclicstoprequested)**() const override |
| std::string | **[cyclicStopReason](/lxmaster/api/classes/CiA402DriveProfile#function-cyclicstopreason)**() const override |
| virtual std::string | **[configurePreOp](/lxmaster/api/classes/CiA402DriveProfile#function-configurepreop)**(ISlaveServices & svc, ProcessImage & image) override<br>Perform CoE / SDO configuration while the slave is in PRE_OP (bus not cycling).  |
| virtual void | **[captureExitDiagnostics](/lxmaster/api/classes/CiA402DriveProfile#function-captureexitdiagnostics)**(ISlaveServices & svc) override<br>End-of-run hook called after the RT thread has joined; safe to perform SDO reads.  |
| virtual [IMotionProfile](/lxmaster/api/classes/IMotionProfile) * | **[asMotion](/lxmaster/api/classes/CiA402DriveProfile#function-asmotion)**() override<br>Query whether this profile drives a motion (servo) axis.  |
| virtual std::int32_t | **[actualVelocity](/lxmaster/api/classes/CiA402DriveProfile#function-actualvelocity)**() const override<br>Actual velocity reported by the drive (encoder counts/s, CiA402 0x606C).  |
| virtual std::int32_t | **[actualTorque](/lxmaster/api/classes/CiA402DriveProfile#function-actualtorque)**() const override<br>Drive's reported actual torque (CiA402 0x6077, per-mille of rated).  |
| virtual std::int32_t | **[actualPosition](/lxmaster/api/classes/CiA402DriveProfile#function-actualposition)**() const override<br>Actual position reported by the drive (encoder counts, CiA402 0x6064).  |
| | **[CiA402DriveProfile](/lxmaster/api/classes/CiA402DriveProfile#function-cia402driveprofile)**([Config](/lxmaster/api/classes/CiA402DriveProfile-Config) cfg) |

## Additional inherited members

**Public Functions inherited from [ecdev::IDeviceProfile](/lxmaster/api/classes/IDeviceProfile)**

|                | Name           |
| -------------- | -------------- |
| | **[~IDeviceProfile](/lxmaster/api/classes/IDeviceProfile#function-~ideviceprofile)**() override =default |
| virtual void | **[resolveTopology](/lxmaster/api/classes/IDeviceProfile#function-resolvetopology)**(const ProcessImage & image)<br>Resolve the static channel/PDO topology from the ENI-derived process image.  |
| virtual [IIoProfile](/lxmaster/api/classes/IIoProfile) * | **[asIo](/lxmaster/api/classes/IDeviceProfile#function-asio)**()<br>Query whether this profile exposes digital/analog I/O channels.  |
| virtual [IEncoderProfile](/lxmaster/api/classes/IEncoderProfile) * | **[asEncoder](/lxmaster/api/classes/IDeviceProfile#function-asencoder)**()<br>Query whether this profile exposes position/velocity encoder readings.  |

**Public Functions inherited from [ecdev::IMotionProfile](/lxmaster/api/classes/IMotionProfile)**

|                | Name           |
| -------------- | -------------- |
| virtual | **[~IMotionProfile](/lxmaster/api/classes/IMotionProfile#function-~imotionprofile)**() =default |


## Detailed Description

```cpp
class ecdev::CiA402DriveProfile;
```

CiA 402 (CANopen-over-EtherCAT) servo-drive profile. 

Plugs onto a `[GenericEniDevice]` and provides the drive-class behaviour that used to live in `CiA402Device`:

* PreOP validation + operating-mode setup: it confirms the cyclic objects it drives (controlword/statusword/target+actual position) are present in the ENI PDO mapping and fails otherwise. It makes NO configuration assumptions ("ENI is law") with ONE deliberate exception: the operating mode 0x6060, which is application/axis intent rather than bus wiring, so the profile writes it (from `[Config::op_mode](/lxmaster/api/classes/CiA402DriveProfile-Config#variable-op-mode)`) and reads it back to confirm at PreOP. SM sync-mode (0x1C32/0x1C33), the 0x60C2 interpolation time, and any vendor tuning still arrive as ENI CoE InitCmds replayed by `[GenericEniDevice]`; DC SYNC0 is activated by the master from the ENI <DC>; the generic 0x1C1x/0x16xx PDO assignment is done by `[GenericEniDevice]`.
* DS402 controlword state machine (`[CiA402Fsm]`) on the RT cyclic path.
* A lock-free snapshot so application threads (through the `Axis` facade / [IMotionProfile](/lxmaster/api/classes/IMotionProfile)) read position/statusword and command targets without touching PDO bytes.

It implements `[IMotionProfile](/lxmaster/api/classes/IMotionProfile)`, which is the only thing the `Axis` facade depends on, so the controlword/statusword stay hidden inside this profile.

Extending it: this class is intentionally NOT `final`. To add vendor/extra PDO variables (objects the ENI maps beyond the standard CiA402 set), subclass it, override the relevant lifecycle method (typically `readInputs`, and optionally `resolveTopology`/`configurePreOp`), and CHAIN to the base (`CiA402DriveProfile::readInputs(...)`) before doing your own work. Resolve your extra objects with `ProcessImage::resolve(index, sub)` and publish them to application threads through your own lock-free state (atomics). `Axis` keeps working unchanged because the subclass inherits this profile's `[asMotion()](/lxmaster/api/classes/CiA402DriveProfile#function-asmotion)`. This mirrors the `[GenericIoProfile](/lxmaster/api/classes/GenericIoProfile)` -> `[CiA401IoProfile](/lxmaster/api/classes/CiA401IoProfile)` precedent. The application reaches the subclass via `ecfacade::DeviceFacade::deviceProfile()`. 

## Public Types Documentation

### using OpMode

```cpp
using ecdev::CiA402DriveProfile::OpMode =  DriveOpMode;
```

Cyclic operation mode this profile drives. 

CSP commands target position (0x607A); CSV commands target velocity (0x60FF); CST commands target torque (0x6071, INT16). The ENI/ESI must map the matching object and set the drive's modes-of-operation (0x6060) accordingly &ndash; the profile only validates the mapping. The per-mode cyclic facts live in the OpModeTraits table in cia402_drive_profile.cpp. 


## Public Functions Documentation

### function writeOutputs

```cpp
virtual void writeOutputs(
    ProcessImage & image,
    std::uint64_t cycle_count
) override
```

Write output PDO values for this cycle. 

**Parameters**: 

  * **image** Live PDO byte map for this slave's output objects; write target values into it. 
  * **cycle_count** Total RT cycles executed since `start()` (monotonically increasing). 


**Reimplements**: [ecdev::IDeviceProfile::writeOutputs](/lxmaster/api/classes/IDeviceProfile#function-writeoutputs)


Called on the RT cyclic thread every cycle while OPERATIONAL. 


### function targetPosition

```cpp
inline virtual std::int32_t targetPosition() const override
```

Last target position commanded to the drive (encoder counts). 

**Reimplements**: [ecdev::IMotionProfile::targetPosition](/lxmaster/api/classes/IMotionProfile#function-targetposition)


RT-safe. 


### function statusword

```cpp
inline virtual std::uint16_t statusword() const override
```

Raw DS402 statusword (CiA402 0x6041). 

**Reimplements**: [ecdev::IMotionProfile::statusword](/lxmaster/api/classes/IMotionProfile#function-statusword)


RT-safe. 


### function setTargetVelocity

```cpp
inline virtual void setTargetVelocity(
    std::int32_t counts_per_sec
) override
```

CSV target velocity in counts/s. 

**Reimplements**: [ecdev::IMotionProfile::setTargetVelocity](/lxmaster/api/classes/IMotionProfile#function-settargetvelocity)


Has its own command slot (0x60FF) so a CSP position target and a CSV velocity target can coexist for bumpless live mode switching; only the object matching the active op-mode is honoured by the drive. 


### function setTargetTorque

```cpp
inline virtual void setTargetTorque(
    std::int32_t per_mille_rated
) override
```

CST target torque in per-mille of rated torque. 

**Reimplements**: [ecdev::IMotionProfile::setTargetTorque](/lxmaster/api/classes/IMotionProfile#function-settargettorque)


Has its own command slot (0x6071) so it can coexist with position/velocity targets for bumpless live mode switching; only the object matching the active op-mode is honoured by the drive. 


### function setTargetPosition

```cpp
inline virtual void setTargetPosition(
    std::int32_t counts
) override
```

Command a CSP target position. 

**Parameters**: 

  * **counts** Target position in encoder counts (CiA402 0x607A). 


**Reimplements**: [ecdev::IMotionProfile::setTargetPosition](/lxmaster/api/classes/IMotionProfile#function-settargetposition)


Implicitly leaves "hold actual" mode. 


### function setOperatingMode

```cpp
inline virtual void setOperatingMode(
    DriveOpMode mode
) override
```

Choose the operating mode. 

**Reimplements**: [ecdev::IMotionProfile::setOperatingMode](/lxmaster/api/classes/IMotionProfile#function-setoperatingmode)


Pre-start this seeds the initial mode; while running it also switches live &ndash; when the ENI maps 0x6060 into the RxPDO the profile writes out_.desired_mode every cycle, so CSP/CSV/CST switch while OPERATIONAL. The atomic store is RT-safe; cfg_.op_mode (used only by the legacy no-0x6060 path, which is fixed at PRE_OP) is not read cyclically in PDO mode. 


### function setAutoFaultRecover

```cpp
inline virtual void setAutoFaultRecover(
    bool enable
) override
```

Set the CiA402 auto fault-reset/recover behaviour. 

**Parameters**: 

  * **enable** `true` to automatically reset and re-enable after a mid-run fault; `false` (default) to treat faults as terminal stops. 


**Reimplements**: [ecdev::IMotionProfile::setAutoFaultRecover](/lxmaster/api/classes/IMotionProfile#function-setautofaultrecover)


Call between prepare() and start(); not RT-safe. 


### function requiresMotionShutdown

```cpp
inline bool requiresMotionShutdown() const override
```


### function requiresAlShutdown

```cpp
inline bool requiresAlShutdown() const override
```


### function requestFaultReset

```cpp
inline virtual void requestFaultReset() override
```

One-shot fault-reset edge (acted on only while the drive reports Fault). 

**Reimplements**: [ecdev::IMotionProfile::requestFaultReset](/lxmaster/api/classes/IMotionProfile#function-requestfaultreset)


### function requestEnable

```cpp
inline virtual void requestEnable() override
```

Request the drive walk to Operation Enabled (cancels a prior disable request). 

**Reimplements**: [ecdev::IMotionProfile::requestEnable](/lxmaster/api/classes/IMotionProfile#function-requestenable)


### function requestDisable

```cpp
inline virtual void requestDisable() override
```

Request the drive walk back to a de-energised resting state. 

**Reimplements**: [ecdev::IMotionProfile::requestDisable](/lxmaster/api/classes/IMotionProfile#function-requestdisable)


### function readyForShutdown

```cpp
inline bool readyForShutdown() const override
```


### function readyForAlShutdown

```cpp
bool readyForAlShutdown() const override
```


### function readInputs

```cpp
virtual void readInputs(
    const ProcessImage & image,
    bool wkc_valid,
    bool operational
) override
```

Read input PDO values captured this cycle. 

**Parameters**: 

  * **image** Live PDO byte map for this slave's input objects. 
  * **wkc_valid** False when the work counter dropped this cycle — the slave may not have responded and input data may be stale. 
  * **operational** False during the OP-entry cooldown cycles after the master enters OPERATIONAL. Motion commands should be suppressed until this is true. 


**Reimplements**: [ecdev::IDeviceProfile::readInputs](/lxmaster/api/classes/IDeviceProfile#function-readinputs)


Called on the RT cyclic thread every cycle while OPERATIONAL. Profiles should guard state updates on `wkc_valid` and `operational` to avoid acting on stale data. 


### function profileName

```cpp
inline virtual const char * profileName() const override
```

Stable identifier for diagnostics (e.g. 

**Return**: A null-terminated string literal naming this profile class. Must be stable for the lifetime of the profile object (a string literal in practice). 

**Reimplements**: [ecdev::IDeviceProfile::profileName](/lxmaster/api/classes/IDeviceProfile#function-profilename)


`"CiA402-drive"`). 


### function primeOutputs

```cpp
virtual void primeOutputs(
    ProcessImage & image
) override
```

Prime output PDO bytes to safe values immediately before the bus enters SAFE_OP (outputs start being transmitted). 

**Parameters**: 

  * **image** Live PDO byte map; write safe initial output values into it. 


**Reimplements**: [ecdev::IDeviceProfile::primeOutputs](/lxmaster/api/classes/IDeviceProfile#function-primeoutputs)


For example, a CiA402 profile writes a Shutdown controlword here so the drive sees a valid initial state before the RT cycle starts. Called on the bring-up thread. 


### function prepareShutdown

```cpp
inline void prepareShutdown() override
```


### function prepareSafeOp

```cpp
virtual std::string prepareSafeOp(
    ISlaveServices & svc,
    ProcessImage & image
) override
```

Final configuration step before OPERATIONAL: the slave is in SAFE_OP and the PDO IOmap is live but outputs are not yet driven. 

**Parameters**: 

  * **svc** Slave services handle for SDO reads/writes. 
  * **image** Live process image (IOmap is mapped but outputs are not yet driven). 


**Return**: Empty string on success; a non-empty human-readable reason string aborts bring-up. 

**Reimplements**: [ecdev::IDeviceProfile::prepareSafeOp](/lxmaster/api/classes/IDeviceProfile#function-preparesafeop)


Use this for last-moment readiness checks or any SDO writes that must happen after the IOmap is mapped. Called on the bring-up thread; never on the RT thread. 


### function modeDisplay

```cpp
inline virtual std::int32_t modeDisplay() const override
```

Drive's modes-of-operation display (CiA402 0x6061; 8=CSP, 9=CSV, 10=CST). 

**Reimplements**: [ecdev::IMotionProfile::modeDisplay](/lxmaster/api/classes/IMotionProfile#function-modedisplay)


0 if unmapped. 


### function lastStatusWordForDiagnostics

```cpp
inline std::uint16_t lastStatusWordForDiagnostics() const override
```


### function isOperationEnabled

```cpp
inline virtual bool isOperationEnabled() const override
```

True when the DS402 state machine is in the Operation Enabled state. 

**Reimplements**: [ecdev::IMotionProfile::isOperationEnabled](/lxmaster/api/classes/IMotionProfile#function-isoperationenabled)


RT-safe. 


### function isFault

```cpp
inline virtual bool isFault() const override
```

True when the drive reports a latched fault (DS402 Fault state, statusword bit 3). 

**Reimplements**: [ecdev::IMotionProfile::isFault](/lxmaster/api/classes/IMotionProfile#function-isfault)


RT-safe. 


### function hasLeftOperationEnabled

```cpp
bool hasLeftOperationEnabled() const override
```


### function cyclicStopRequested

```cpp
inline bool cyclicStopRequested() const override
```


### function cyclicStopReason

```cpp
std::string cyclicStopReason() const override
```


### function configurePreOp

```cpp
virtual std::string configurePreOp(
    ISlaveServices & svc,
    ProcessImage & image
) override
```

Perform CoE / SDO configuration while the slave is in PRE_OP (bus not cycling). 

**Parameters**: 

  * **svc** Slave services handle for SDO reads/writes and register access. 
  * **image** Process image for this slave; resolve PDO entry handles here for later cyclic use. 


**Return**: Empty string on success; a non-empty human-readable reason string aborts bring-up. 

**Reimplements**: [ecdev::IDeviceProfile::configurePreOp](/lxmaster/api/classes/IDeviceProfile#function-configurepreop)


Resolve process-image handles (PDO objects) for use in the cyclic path. Called on the bring-up thread; never on the RT thread. 


### function captureExitDiagnostics

```cpp
virtual void captureExitDiagnostics(
    ISlaveServices & svc
) override
```

End-of-run hook called after the RT thread has joined; safe to perform SDO reads. 

**Parameters**: 

  * **svc** Slave services handle available for post-run SDO reads (e.g. fault codes). 


**Reimplements**: [ecdev::IDeviceProfile::captureExitDiagnostics](/lxmaster/api/classes/IDeviceProfile#function-captureexitdiagnostics)


### function asMotion

```cpp
inline virtual IMotionProfile * asMotion() override
```

Query whether this profile drives a motion (servo) axis. 

**Return**: A non-null `IMotionProfile*` if so (used to back an `Axis` facade handle), or null if this profile does not implement the motion contract. 

**Reimplements**: [ecdev::IDeviceProfile::asMotion](/lxmaster/api/classes/IDeviceProfile#function-asmotion)


### function actualVelocity

```cpp
inline virtual std::int32_t actualVelocity() const override
```

Actual velocity reported by the drive (encoder counts/s, CiA402 0x606C). 

**Reimplements**: [ecdev::IMotionProfile::actualVelocity](/lxmaster/api/classes/IMotionProfile#function-actualvelocity)


Returns 0 if the drive does not map this object. RT-safe. 


### function actualTorque

```cpp
inline virtual std::int32_t actualTorque() const override
```

Drive's reported actual torque (CiA402 0x6077, per-mille of rated). 

**Reimplements**: [ecdev::IMotionProfile::actualTorque](/lxmaster/api/classes/IMotionProfile#function-actualtorque)


0 if the profile does not map it. Diagnostic only. 


### function actualPosition

```cpp
inline virtual std::int32_t actualPosition() const override
```

Actual position reported by the drive (encoder counts, CiA402 0x6064). 

**Reimplements**: [ecdev::IMotionProfile::actualPosition](/lxmaster/api/classes/IMotionProfile#function-actualposition)


RT-safe. 


### function CiA402DriveProfile

```cpp
explicit CiA402DriveProfile(
    Config cfg
)
```


-------------------------------

Updated on 2026-07-13 at 20:44:41 +0000