---
title: ecdev::CiA402DriveProfile
summary: CiA 402 (CANopen-over-EtherCAT) servo-drive profile. 

slug: /lxmaster/api/classes/CiA402DriveProfile
sidebar_label: "CiA402DriveProfile"
---
<!-- GENERATED - do not edit. Produced from the LXMASTER public
     headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->

# ecdev::CiA402DriveProfile



CiA 402 (CANopen-over-EtherCAT) servo-drive profile.  [More...](#detailed-description)


`#include <cia402_drive_profile.hpp>`

Inherits from [ecdev::IDeviceProfile](/lxmaster/api/classes/IDeviceProfile), [ecdev::IMotionProfile](/lxmaster/api/classes/IMotionProfile), IDeviceLifecycle

## Public Classes

|                | Name           |
| -------------- | -------------- |
| struct | **[Config](/lxmaster/api/classes/CiA402DriveProfile-Config)**  |

## Public Types

|                | Name           |
| -------------- | -------------- |
| using DriveOpMode | **[OpMode](/lxmaster/api/classes/CiA402DriveProfile#using-opmode)** <br>Cyclic operation mode this profile drives.  |

## Public Functions

|                | Name           |
| -------------- | -------------- |
| virtual void | **[writeOutputs](/lxmaster/api/classes/CiA402DriveProfile#function-writeoutputs)**([ProcessImage](/lxmaster/api/classes/ProcessImage) & image, std::uint64_t cycle_count) override |
| virtual std::int32_t | **[targetPosition](/lxmaster/api/classes/CiA402DriveProfile#function-targetposition)**() const override |
| virtual std::uint16_t | **[statusword](/lxmaster/api/classes/CiA402DriveProfile#function-statusword)**() const override |
| virtual void | **[setTargetVelocity](/lxmaster/api/classes/CiA402DriveProfile#function-settargetvelocity)**(std::int32_t counts_per_sec) override<br>CSV target velocity in counts/s.  |
| virtual void | **[setTargetTorque](/lxmaster/api/classes/CiA402DriveProfile#function-settargettorque)**(std::int32_t per_mille_rated) override<br>CST target torque in per-mille of rated torque.  |
| virtual void | **[setTargetPosition](/lxmaster/api/classes/CiA402DriveProfile#function-settargetposition)**(std::int32_t counts) override<br>Command CSP target position in encoder counts; implicitly leaves "hold actual" mode.  |
| virtual void | **[setOperatingMode](/lxmaster/api/classes/CiA402DriveProfile#function-setoperatingmode)**(DriveOpMode mode) override<br>Choose the operating mode.  |
| virtual void | **[setAutoFaultRecover](/lxmaster/api/classes/CiA402DriveProfile#function-setautofaultrecover)**(bool enable) override<br>Set the CiA402 auto fault-reset/recover behaviour.  |
| bool | **[requiresMotionShutdown](/lxmaster/api/classes/CiA402DriveProfile#function-requiresmotionshutdown)**() const override |
| bool | **[requiresAlShutdown](/lxmaster/api/classes/CiA402DriveProfile#function-requiresalshutdown)**() const override |
| virtual void | **[requestFaultReset](/lxmaster/api/classes/CiA402DriveProfile#function-requestfaultreset)**() override<br>One-shot fault-reset edge (acted on only while the drive reports Fault).  |
| virtual void | **[requestEnable](/lxmaster/api/classes/CiA402DriveProfile#function-requestenable)**() override<br>Request the drive walk to Operation Enabled (cancels a prior disable request).  |
| virtual void | **[requestDisable](/lxmaster/api/classes/CiA402DriveProfile#function-requestdisable)**() override<br>Request the drive walk back to a de-energised resting state.  |
| bool | **[readyForShutdown](/lxmaster/api/classes/CiA402DriveProfile#function-readyforshutdown)**() const override |
| bool | **[readyForAlShutdown](/lxmaster/api/classes/CiA402DriveProfile#function-readyforalshutdown)**() const override |
| virtual void | **[readInputs](/lxmaster/api/classes/CiA402DriveProfile#function-readinputs)**(const [ProcessImage](/lxmaster/api/classes/ProcessImage) & image, bool wkc_valid, bool operational) override |
| virtual const char * | **[profileName](/lxmaster/api/classes/CiA402DriveProfile#function-profilename)**() const override<br>Stable identifier for diagnostics (e.g.  |
| virtual void | **[primeOutputs](/lxmaster/api/classes/CiA402DriveProfile#function-primeoutputs)**([ProcessImage](/lxmaster/api/classes/ProcessImage) & image) override |
| void | **[prepareShutdown](/lxmaster/api/classes/CiA402DriveProfile#function-prepareshutdown)**() override |
| virtual std::string | **[prepareSafeOp](/lxmaster/api/classes/CiA402DriveProfile#function-preparesafeop)**(ISlaveServices & svc, [ProcessImage](/lxmaster/api/classes/ProcessImage) & image) override |
| virtual std::int32_t | **[modeDisplay](/lxmaster/api/classes/CiA402DriveProfile#function-modedisplay)**() const override<br>Drive's modes-of-operation display (CiA402 0x6061; 8=CSP, 9=CSV, 10=CST).  |
| std::uint16_t | **[lastStatusWordForDiagnostics](/lxmaster/api/classes/CiA402DriveProfile#function-laststatuswordfordiagnostics)**() const override |
| virtual bool | **[isOperationEnabled](/lxmaster/api/classes/CiA402DriveProfile#function-isoperationenabled)**() const override |
| virtual bool | **[isFault](/lxmaster/api/classes/CiA402DriveProfile#function-isfault)**() const override |
| bool | **[hasLeftOperationEnabled](/lxmaster/api/classes/CiA402DriveProfile#function-hasleftoperationenabled)**() const override |
| bool | **[cyclicStopRequested](/lxmaster/api/classes/CiA402DriveProfile#function-cyclicstoprequested)**() const override |
| std::string | **[cyclicStopReason](/lxmaster/api/classes/CiA402DriveProfile#function-cyclicstopreason)**() const override |
| virtual std::string | **[configurePreOp](/lxmaster/api/classes/CiA402DriveProfile#function-configurepreop)**(ISlaveServices & svc, [ProcessImage](/lxmaster/api/classes/ProcessImage) & image) override |
| virtual void | **[captureExitDiagnostics](/lxmaster/api/classes/CiA402DriveProfile#function-captureexitdiagnostics)**(ISlaveServices & svc) override<br>End-of-run, after the RT thread has joined; safe to do SDO reads via `svc`.  |
| virtual [IMotionProfile](/lxmaster/api/classes/IMotionProfile) * | **[asMotion](/lxmaster/api/classes/CiA402DriveProfile#function-asmotion)**() override |
| virtual std::int32_t | **[actualVelocity](/lxmaster/api/classes/CiA402DriveProfile#function-actualvelocity)**() const override |
| virtual std::int32_t | **[actualTorque](/lxmaster/api/classes/CiA402DriveProfile#function-actualtorque)**() const override<br>Drive's reported actual torque (CiA402 0x6077, per-mille of rated).  |
| virtual std::int32_t | **[actualPosition](/lxmaster/api/classes/CiA402DriveProfile#function-actualposition)**() const override |
| | **[CiA402DriveProfile](/lxmaster/api/classes/CiA402DriveProfile#function-cia402driveprofile)**(Config cfg) |

## Additional inherited members

**Public Functions inherited from [ecdev::IDeviceProfile](/lxmaster/api/classes/IDeviceProfile)**

|                | Name           |
| -------------- | -------------- |
| | **[~IDeviceProfile](/lxmaster/api/classes/IDeviceProfile#function-~ideviceprofile)**() override =default |
| virtual void | **[resolveTopology](/lxmaster/api/classes/IDeviceProfile#function-resolvetopology)**(const [ProcessImage](/lxmaster/api/classes/ProcessImage) & image)<br>Resolve the static channel/PDO topology from the ENI-derived process image.  |
| virtual [IIoProfile](/lxmaster/api/classes/IIoProfile) * | **[asIo](/lxmaster/api/classes/IDeviceProfile#function-asio)**() |
| virtual [IEncoderProfile](/lxmaster/api/classes/IEncoderProfile) * | **[asEncoder](/lxmaster/api/classes/IDeviceProfile#function-asencoder)**() |

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

* PreOP validation + operating-mode setup: it confirms the cyclic objects it drives (controlword/statusword/target+actual position) are present in the ENI PDO mapping and fails otherwise. It makes NO configuration assumptions ("ENI is law") with ONE deliberate exception: the operating mode 0x6060, which is application/axis intent rather than bus wiring, so the profile writes it (from `Config::op_mode`) and reads it back to confirm at PreOP. SM sync-mode (0x1C32/0x1C33), the 0x60C2 interpolation time, and any vendor tuning still arrive as ENI CoE InitCmds replayed by `[GenericEniDevice]`; DC SYNC0 is activated by the master from the ENI <DC>; the generic 0x1C1x/0x16xx PDO assignment is done by `[GenericEniDevice]`.
* DS402 controlword state machine (`[CiA402Fsm]`) on the RT cyclic path.
* A lock-free snapshot so application threads (through the `Axis` facade / [IMotionProfile](/lxmaster/api/classes/IMotionProfile)) read position/statusword and command targets without touching PDO bytes.

It implements `[IMotionProfile](/lxmaster/api/classes/IMotionProfile)`, which is the only thing the `Axis` facade depends on, so the controlword/statusword stay hidden inside this profile.

Extending it: this class is intentionally NOT `final`. To add vendor/extra PDO variables (objects the ENI maps beyond the standard CiA402 set), subclass it, override the relevant lifecycle method (typically `readInputs`, and optionally `resolveTopology`/`configurePreOp`), and CHAIN to the base (`CiA402DriveProfile::readInputs(...)`) before doing your own work. Resolve your extra objects with `ProcessImage::resolve(index, sub)` and publish them to application threads through your own lock-free state (atomics). `Axis` keeps working unchanged because the subclass inherits this profile's `asMotion()`. This mirrors the `[GenericIoProfile](/lxmaster/api/classes/GenericIoProfile)` -> `[CiA401IoProfile](/lxmaster/api/classes/CiA401IoProfile)` precedent. The application reaches the subclass via `[ecfacade::DeviceFacade::deviceProfile()](/lxmaster/api/classes/DeviceFacade#function-deviceprofile)`. 

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


**Reimplements**: [ecdev::IDeviceProfile::writeOutputs](/lxmaster/api/classes/IDeviceProfile#function-writeoutputs)


### function targetPosition

```cpp
inline virtual std::int32_t targetPosition() const override
```


**Reimplements**: [ecdev::IMotionProfile::targetPosition](/lxmaster/api/classes/IMotionProfile#function-targetposition)


### function statusword

```cpp
inline virtual std::uint16_t statusword() const override
```


**Reimplements**: [ecdev::IMotionProfile::statusword](/lxmaster/api/classes/IMotionProfile#function-statusword)


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

Command CSP target position in encoder counts; implicitly leaves "hold actual" mode. 

**Reimplements**: [ecdev::IMotionProfile::setTargetPosition](/lxmaster/api/classes/IMotionProfile#function-settargetposition)


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


**Reimplements**: [ecdev::IDeviceProfile::readInputs](/lxmaster/api/classes/IDeviceProfile#function-readinputs)


### function profileName

```cpp
inline virtual const char * profileName() const override
```

Stable identifier for diagnostics (e.g. 

**Reimplements**: [ecdev::IDeviceProfile::profileName](/lxmaster/api/classes/IDeviceProfile#function-profilename)


"CiA402-drive"). 


### function primeOutputs

```cpp
virtual void primeOutputs(
    ProcessImage & image
) override
```


**Reimplements**: [ecdev::IDeviceProfile::primeOutputs](/lxmaster/api/classes/IDeviceProfile#function-primeoutputs)


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


**Reimplements**: [ecdev::IDeviceProfile::prepareSafeOp](/lxmaster/api/classes/IDeviceProfile#function-preparesafeop)


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


**Reimplements**: [ecdev::IMotionProfile::isOperationEnabled](/lxmaster/api/classes/IMotionProfile#function-isoperationenabled)


### function isFault

```cpp
inline virtual bool isFault() const override
```


**Reimplements**: [ecdev::IMotionProfile::isFault](/lxmaster/api/classes/IMotionProfile#function-isfault)


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


**Reimplements**: [ecdev::IDeviceProfile::configurePreOp](/lxmaster/api/classes/IDeviceProfile#function-configurepreop)


### function captureExitDiagnostics

```cpp
virtual void captureExitDiagnostics(
    ISlaveServices & svc
) override
```

End-of-run, after the RT thread has joined; safe to do SDO reads via `svc`. 

**Reimplements**: [ecdev::IDeviceProfile::captureExitDiagnostics](/lxmaster/api/classes/IDeviceProfile#function-captureexitdiagnostics)


### function asMotion

```cpp
inline virtual IMotionProfile * asMotion() override
```


**Reimplements**: [ecdev::IDeviceProfile::asMotion](/lxmaster/api/classes/IDeviceProfile#function-asmotion)


### function actualVelocity

```cpp
inline virtual std::int32_t actualVelocity() const override
```


**Reimplements**: [ecdev::IMotionProfile::actualVelocity](/lxmaster/api/classes/IMotionProfile#function-actualvelocity)


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


**Reimplements**: [ecdev::IMotionProfile::actualPosition](/lxmaster/api/classes/IMotionProfile#function-actualposition)


### function CiA402DriveProfile

```cpp
explicit CiA402DriveProfile(
    Config cfg
)
```


-------------------------------

Updated on 2026-07-04 at 20:22:54 +0000