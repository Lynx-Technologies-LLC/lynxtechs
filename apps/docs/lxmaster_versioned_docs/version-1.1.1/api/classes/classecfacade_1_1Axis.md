---
title: "ecfacade::Axis"
summary: "High-level motion handle a PLC/application programmer uses, analogous to a TwinCAT \"NC axis\"."

slug: /api/classes/Axis
sidebar_label: "Axis"
---

<!-- GENERATED - do not edit. Produced from the LXMASTER public headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->
# ecfacade::Axis



High-level motion handle a PLC/application programmer uses, analogous to a TwinCAT "NC axis".  [More...](#detailed-description)


`#include <axis.hpp>`

Inherits from DeviceFacade

## Public Functions

|                | Name           |
| -------------- | -------------- |
| std::uint16_t | **[statusword](/lxmaster/api/classes/Axis#function-statusword)**() const<br>Raw DS402 statusword (CiA402 0x6041).  |
| void | **[setDriveMode](/lxmaster/api/classes/Axis#function-setdrivemode)**(ecdev::DriveOpMode mode)<br>Select the cyclic operating mode (CSP / CSV / CST) this axis runs; the CiA402 profile writes 0x6060 to match.  |
| void | **[resetFault](/lxmaster/api/classes/Axis#function-resetfault)**()<br>Clear a latched drive fault (one-shot).  |
| void | **[moveTo](/lxmaster/api/classes/Axis#function-moveto)**(std::int32_t counts)<br>Command an absolute target position (CSP).  |
| void | **[moveAtVelocity](/lxmaster/api/classes/Axis#function-moveatvelocity)**(std::int32_t counts_per_sec)<br>Command a target velocity (CSV).  |
| [ecdev::IMotionProfile](/lxmaster/api/classes/IMotionProfile) * | **[motionProfile](/lxmaster/api/classes/Axis#function-motionprofile)**() const<br>Escape hatch for advanced callers that need the underlying motion contract.  |
| std::int32_t | **[modeDisplay](/lxmaster/api/classes/Axis#function-modedisplay)**() const<br>Drive-reported modes-of-operation display (0x6061; 8=CSP, 9=CSV, 10=CST); 0 if unmapped.  |
| bool | **[isFaulted](/lxmaster/api/classes/Axis#function-isfaulted)**() const<br>True when the drive reports a latched fault (DS402 Fault state, statusword bit 3).  |
| bool | **[isEnabled](/lxmaster/api/classes/Axis#function-isenabled)**() const<br>True when the DS402 state machine has reached Operation Enabled.  |
| void | **[enable](/lxmaster/api/classes/Axis#function-enable)**()<br>Request the drive to power up and hold position.  |
| void | **[disable](/lxmaster/api/classes/Axis#function-disable)**()<br>Request the drive to power down to a de-energised resting state.  |
| std::int32_t | **[commandedPosition](/lxmaster/api/classes/Axis#function-commandedposition)**() const<br>Last target position sent to the drive (encoder counts).  |
| void | **[applyTorque](/lxmaster/api/classes/Axis#function-applytorque)**(std::int32_t per_mille_rated)<br>Command a target torque (CST).  |
| std::int32_t | **[actualVelocity](/lxmaster/api/classes/Axis#function-actualvelocity)**() const<br>Actual velocity reported by the drive (encoder counts/s, CiA402 0x606C).  |
| std::int32_t | **[actualTorque](/lxmaster/api/classes/Axis#function-actualtorque)**() const<br>Drive-reported actual torque (0x6077, per-mille of rated); 0 if the profile doesn't map it.  |
| std::int32_t | **[actualPosition](/lxmaster/api/classes/Axis#function-actualposition)**() const<br>Actual position reported by the drive (encoder counts, CiA402 0x6064).  |
| | **[Axis](/lxmaster/api/classes/Axis#function-axis)**([ecdev::IMotionProfile](/lxmaster/api/classes/IMotionProfile) * motion, std::string name, ecdev::IEthercatDevice * device) |

## Detailed Description

```cpp
class ecfacade::Axis;
```

High-level motion handle a PLC/application programmer uses, analogous to a TwinCAT "NC axis". 

An `[Axis](/lxmaster/api/classes/Axis)` is a thin, safe wrapper over an `[ecdev::IMotionProfile](/lxmaster/api/classes/IMotionProfile)`. The application never sees CiA402 controlwords, PDO offsets, the ENI, or the backend: it commands positions and reads back status in engineering-relevant terms. The same `[Axis](/lxmaster/api/classes/Axis)` works for any drive family whose profile implements `IMotionProfile`, so swapping a CiA402 servo for a different drive class does not change application code.

All methods are safe to call from the application thread while the RT cycle runs (the backing profile uses lock-free state). Exception: `[setDriveMode()](/lxmaster/api/classes/Axis#function-setdrivemode)` and the inherited `configure()` must only be called between `EcNetwork::prepare()` and `EcNetwork::start()`. 

## Public Functions Documentation

### function statusword

```cpp
std::uint16_t statusword() const
```

Raw DS402 statusword (CiA402 0x6041). 

Useful for advanced diagnostics or for drives that expose manufacturer-specific bits beyond what `[isEnabled()](/lxmaster/api/classes/Axis#function-isenabled)` / `[isFaulted()](/lxmaster/api/classes/Axis#function-isfaulted)` cover. RT-safe. 


### function setDriveMode

```cpp
void setDriveMode(
    ecdev::DriveOpMode mode
)
```

Select the cyclic operating mode (CSP / CSV / CST) this axis runs; the CiA402 profile writes 0x6060 to match. 

**Parameters**: 

  * **mode** The desired operating mode (`DriveOpMode::Csp`, `Csv`, or `Cst`). 


Call before start() to choose the initial mode, or while running to switch live &ndash; a live switch takes effect only when the ENI maps 0x6060 into the RxPDO (eni_gen does this for CiA402 drives). RT-safe. 


### function resetFault

```cpp
void resetFault()
```

Clear a latched drive fault (one-shot). 

### function moveTo

```cpp
void moveTo(
    std::int32_t counts
)
```

Command an absolute target position (CSP). 

**Parameters**: 

  * **counts** Target position in encoder counts (CiA402 0x607A). 


Implicitly exits "hold actual" mode. 


### function moveAtVelocity

```cpp
void moveAtVelocity(
    std::int32_t counts_per_sec
)
```

Command a target velocity (CSV). 

**Parameters**: 

  * **counts_per_sec** Target velocity in encoder counts per second (CiA402 0x60FF). 


Only has effect while the drive runs in CSV mode. 


### function motionProfile

```cpp
ecdev::IMotionProfile * motionProfile() const
```

Escape hatch for advanced callers that need the underlying motion contract. 

**Return**: The `IMotionProfile` backing this axis. Never null while the axis is valid. 

### function modeDisplay

```cpp
std::int32_t modeDisplay() const
```

Drive-reported modes-of-operation display (0x6061; 8=CSP, 9=CSV, 10=CST); 0 if unmapped. 

### function isFaulted

```cpp
bool isFaulted() const
```

True when the drive reports a latched fault (DS402 Fault state, statusword bit 3). 

Call `[resetFault()](/lxmaster/api/classes/Axis#function-resetfault)` to clear. RT-safe. 


### function isEnabled

```cpp
bool isEnabled() const
```

True when the DS402 state machine has reached Operation Enabled. 

RT-safe. 


### function enable

```cpp
void enable()
```

Request the drive to power up and hold position. 

### function disable

```cpp
void disable()
```

Request the drive to power down to a de-energised resting state. 

### function commandedPosition

```cpp
std::int32_t commandedPosition() const
```

Last target position sent to the drive (encoder counts). 

Matches the most recent `[moveTo()](/lxmaster/api/classes/Axis#function-moveto)` argument, or the actual position at enable time when in "hold actual" mode. RT-safe. 


### function applyTorque

```cpp
void applyTorque(
    std::int32_t per_mille_rated
)
```

Command a target torque (CST). 

**Parameters**: 

  * **per_mille_rated** Target torque in per-mille of rated torque (CiA402 0x6071). 


Only has effect while the drive runs in CST mode. 


### function actualVelocity

```cpp
std::int32_t actualVelocity() const
```

Actual velocity reported by the drive (encoder counts/s, CiA402 0x606C). 

0 if the drive does not map this object. RT-safe. 


### function actualTorque

```cpp
std::int32_t actualTorque() const
```

Drive-reported actual torque (0x6077, per-mille of rated); 0 if the profile doesn't map it. 

### function actualPosition

```cpp
std::int32_t actualPosition() const
```

Actual position reported by the drive (encoder counts, CiA402 0x6064). 

RT-safe. 


### function Axis

```cpp
Axis(
    ecdev::IMotionProfile * motion,
    std::string name,
    ecdev::IEthercatDevice * device
)
```


-------------------------------

Updated on 2026-07-13 at 20:44:41 +0000