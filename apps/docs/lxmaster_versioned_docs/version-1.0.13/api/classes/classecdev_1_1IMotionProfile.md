---
title: "ecdev::IMotionProfile"
summary: "Facade-facing contract for a motion (drive) device."

slug: /api/classes/IMotionProfile
sidebar_label: "IMotionProfile"
---

<!-- GENERATED - do not edit. Produced from the LXMASTER public headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->
# ecdev::IMotionProfile



Facade-facing contract for a motion (drive) device.  [More...](#detailed-description)


`#include <motion_profile.hpp>`

Inherited by [ecdev::CiA402DriveProfile](/lxmaster/api/classes/CiA402DriveProfile)

## Public Functions

|                | Name           |
| -------------- | -------------- |
| virtual | **[~IMotionProfile](/lxmaster/api/classes/IMotionProfile#function-~imotionprofile)**() =default |
| virtual std::int32_t | **[targetPosition](/lxmaster/api/classes/IMotionProfile#function-targetposition)**() const =0 |
| virtual std::uint16_t | **[statusword](/lxmaster/api/classes/IMotionProfile#function-statusword)**() const =0 |
| virtual void | **[setTargetVelocity](/lxmaster/api/classes/IMotionProfile#function-settargetvelocity)**(std::int32_t counts_per_sec) =0<br>Command CSV target velocity in counts/s; only honoured by a profile running in CSV.  |
| virtual void | **[setTargetTorque](/lxmaster/api/classes/IMotionProfile#function-settargettorque)**(std::int32_t per_mille_rated) =0<br>Command CST target torque in per-mille of rated torque; only honoured by a profile in CST.  |
| virtual void | **[setTargetPosition](/lxmaster/api/classes/IMotionProfile#function-settargetposition)**(std::int32_t counts) =0<br>Command CSP target position in encoder counts; implicitly leaves "hold actual" mode.  |
| virtual void | **[setOperatingMode](/lxmaster/api/classes/IMotionProfile#function-setoperatingmode)**(DriveOpMode mode)<br>Select the cyclic operating mode (CSP / CSV / CST).  |
| virtual void | **[setAutoFaultRecover](/lxmaster/api/classes/IMotionProfile#function-setautofaultrecover)**(bool enable)<br>Set the CiA402 auto fault-reset/recover behaviour.  |
| virtual void | **[requestFaultReset](/lxmaster/api/classes/IMotionProfile#function-requestfaultreset)**() =0<br>One-shot fault-reset edge (acted on only while the drive reports Fault).  |
| virtual void | **[requestEnable](/lxmaster/api/classes/IMotionProfile#function-requestenable)**() =0<br>Request the drive walk to Operation Enabled (cancels a prior disable request).  |
| virtual void | **[requestDisable](/lxmaster/api/classes/IMotionProfile#function-requestdisable)**() =0<br>Request the drive walk back to a de-energised resting state.  |
| virtual std::int32_t | **[modeDisplay](/lxmaster/api/classes/IMotionProfile#function-modedisplay)**() const<br>Drive's modes-of-operation display (CiA402 0x6061; 8=CSP, 9=CSV, 10=CST).  |
| virtual bool | **[isOperationEnabled](/lxmaster/api/classes/IMotionProfile#function-isoperationenabled)**() const =0 |
| virtual bool | **[isFault](/lxmaster/api/classes/IMotionProfile#function-isfault)**() const =0 |
| virtual std::int32_t | **[actualVelocity](/lxmaster/api/classes/IMotionProfile#function-actualvelocity)**() const =0 |
| virtual std::int32_t | **[actualTorque](/lxmaster/api/classes/IMotionProfile#function-actualtorque)**() const<br>Drive's reported actual torque (CiA402 0x6077, per-mille of rated).  |
| virtual std::int32_t | **[actualPosition](/lxmaster/api/classes/IMotionProfile#function-actualposition)**() const =0 |

## Detailed Description

```cpp
class ecdev::IMotionProfile;
```

Facade-facing contract for a motion (drive) device. 

This is the ONLY surface the `Axis` facade depends on &ndash; it knows nothing about CiA402 controlwords, the backend, or the ENI. Any drive profile (CiA402 today, others later) implements it so the same `Axis` works across drive families.

All methods are safe to call from an application thread concurrently with the RT cycle: the implementation backs them with lock-free state.

Pre-start configuration (call between prepare() and start()): [setOperatingMode()](/lxmaster/api/classes/IMotionProfile#function-setoperatingmode) / [setAutoFaultRecover()](/lxmaster/api/classes/IMotionProfile#function-setautofaultrecover) are not thread-safe with the RT cycle; call them only after prepare() and before start(). Default no-ops make non-CiA402 profiles unaffected. 

## Public Functions Documentation

### function ~IMotionProfile

```cpp
virtual ~IMotionProfile() =default
```


### function targetPosition

```cpp
virtual std::int32_t targetPosition() const =0
```


**Reimplemented by**: [ecdev::CiA402DriveProfile::targetPosition](/lxmaster/api/classes/CiA402DriveProfile#function-targetposition)


### function statusword

```cpp
virtual std::uint16_t statusword() const =0
```


**Reimplemented by**: [ecdev::CiA402DriveProfile::statusword](/lxmaster/api/classes/CiA402DriveProfile#function-statusword)


### function setTargetVelocity

```cpp
virtual void setTargetVelocity(
    std::int32_t counts_per_sec
) =0
```

Command CSV target velocity in counts/s; only honoured by a profile running in CSV. 

**Reimplemented by**: [ecdev::CiA402DriveProfile::setTargetVelocity](/lxmaster/api/classes/CiA402DriveProfile#function-settargetvelocity)


### function setTargetTorque

```cpp
virtual void setTargetTorque(
    std::int32_t per_mille_rated
) =0
```

Command CST target torque in per-mille of rated torque; only honoured by a profile in CST. 

**Reimplemented by**: [ecdev::CiA402DriveProfile::setTargetTorque](/lxmaster/api/classes/CiA402DriveProfile#function-settargettorque)


### function setTargetPosition

```cpp
virtual void setTargetPosition(
    std::int32_t counts
) =0
```

Command CSP target position in encoder counts; implicitly leaves "hold actual" mode. 

**Reimplemented by**: [ecdev::CiA402DriveProfile::setTargetPosition](/lxmaster/api/classes/CiA402DriveProfile#function-settargetposition)


### function setOperatingMode

```cpp
inline virtual void setOperatingMode(
    DriveOpMode mode
)
```

Select the cyclic operating mode (CSP / CSV / CST). 

**Reimplemented by**: [ecdev::CiA402DriveProfile::setOperatingMode](/lxmaster/api/classes/CiA402DriveProfile#function-setoperatingmode)


Call before start() to choose the initial mode, or while running to switch live. A live switch takes effect only when the ENI maps modes-of-operation (0x6060) into the RxPDO (eni_gen does this for CiA402 drives); otherwise the drive runs the mode set via SDO at PRE_OP and a later call has no cyclic effect. RT-safe. Default no-op so non-CiA402 profiles are unaffected. 


### function setAutoFaultRecover

```cpp
inline virtual void setAutoFaultRecover(
    bool enable
)
```

Set the CiA402 auto fault-reset/recover behaviour. 

**Reimplemented by**: [ecdev::CiA402DriveProfile::setAutoFaultRecover](/lxmaster/api/classes/CiA402DriveProfile#function-setautofaultrecover)


Call between prepare() and start(); not RT-safe. 


### function requestFaultReset

```cpp
virtual void requestFaultReset() =0
```

One-shot fault-reset edge (acted on only while the drive reports Fault). 

**Reimplemented by**: [ecdev::CiA402DriveProfile::requestFaultReset](/lxmaster/api/classes/CiA402DriveProfile#function-requestfaultreset)


### function requestEnable

```cpp
virtual void requestEnable() =0
```

Request the drive walk to Operation Enabled (cancels a prior disable request). 

**Reimplemented by**: [ecdev::CiA402DriveProfile::requestEnable](/lxmaster/api/classes/CiA402DriveProfile#function-requestenable)


### function requestDisable

```cpp
virtual void requestDisable() =0
```

Request the drive walk back to a de-energised resting state. 

**Reimplemented by**: [ecdev::CiA402DriveProfile::requestDisable](/lxmaster/api/classes/CiA402DriveProfile#function-requestdisable)


### function modeDisplay

```cpp
inline virtual std::int32_t modeDisplay() const
```

Drive's modes-of-operation display (CiA402 0x6061; 8=CSP, 9=CSV, 10=CST). 

**Reimplemented by**: [ecdev::CiA402DriveProfile::modeDisplay](/lxmaster/api/classes/CiA402DriveProfile#function-modedisplay)


0 if unmapped. 


### function isOperationEnabled

```cpp
virtual bool isOperationEnabled() const =0
```


**Reimplemented by**: [ecdev::CiA402DriveProfile::isOperationEnabled](/lxmaster/api/classes/CiA402DriveProfile#function-isoperationenabled)


### function isFault

```cpp
virtual bool isFault() const =0
```


**Reimplemented by**: [ecdev::CiA402DriveProfile::isFault](/lxmaster/api/classes/CiA402DriveProfile#function-isfault)


### function actualVelocity

```cpp
virtual std::int32_t actualVelocity() const =0
```


**Reimplemented by**: [ecdev::CiA402DriveProfile::actualVelocity](/lxmaster/api/classes/CiA402DriveProfile#function-actualvelocity)


### function actualTorque

```cpp
inline virtual std::int32_t actualTorque() const
```

Drive's reported actual torque (CiA402 0x6077, per-mille of rated). 

**Reimplemented by**: [ecdev::CiA402DriveProfile::actualTorque](/lxmaster/api/classes/CiA402DriveProfile#function-actualtorque)


0 if the profile does not map it. Diagnostic only. 


### function actualPosition

```cpp
virtual std::int32_t actualPosition() const =0
```


**Reimplemented by**: [ecdev::CiA402DriveProfile::actualPosition](/lxmaster/api/classes/CiA402DriveProfile#function-actualposition)


-------------------------------

Updated on 2026-07-04 at 22:59:44 +0000