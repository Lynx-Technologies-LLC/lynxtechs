---
title: "ecdev::CiA402DriveProfile::Config"
summary: "Per-instance configuration for a CiA402DriveProfile."

slug: /api/classes/CiA402DriveProfile-Config
sidebar_label: "Config"
---

<!-- GENERATED - do not edit. Produced from the LXMASTER public headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->
# ecdev::CiA402DriveProfile::Config



Per-instance configuration for a `[CiA402DriveProfile](/lxmaster/api/classes/CiA402DriveProfile)`.  [More...](#detailed-description)


`#include <cia402_drive_profile.hpp>`

## Public Attributes

|                | Name           |
| -------------- | -------------- |
| bool | **[startup_fault_autoreset](/lxmaster/api/classes/CiA402DriveProfile-Config#variable-startup-fault-autoreset)** <br>When a drive enters OPERATIONAL already in the Fault state (a residual fault carried over from a prior run, before this run has ever reached Operation Enabled), automatically pulse a bounded fault-reset and continue the enable sequence instead of treating it as a terminal stop.  |
| bool | **[shutdown_require_switch_on_disabled](/lxmaster/api/classes/CiA402DriveProfile-Config#variable-shutdown-require-switch-on-disabled)** <br>When true (default), the shutdown sequence waits for the drive to reach Switch-On Disabled (or Fault) before proceeding to the AL state walk-down.  |
| [OpMode](/lxmaster/api/classes/CiA402DriveProfile#using-opmode) | **[op_mode](/lxmaster/api/classes/CiA402DriveProfile-Config#variable-op-mode)** <br>Initial cyclic operating mode (CSP/CSV/CST).  |
| bool | **[hold_actual_position](/lxmaster/api/classes/CiA402DriveProfile-Config#variable-hold-actual-position)** <br>When the axis is enabled and no `moveTo()` has been issued yet, command the drive to hold its actual position at enable time (CSP: target = actualPosition).  |
| int | **[fault_reset_arm_cycles](/lxmaster/api/classes/CiA402DriveProfile-Config#variable-fault-reset-arm-cycles)** <br>Number of RT cycles the startup fault-reset window remains active (see `startup_fault_autoreset`).  |
| bool | **[enable_fsm](/lxmaster/api/classes/CiA402DriveProfile-Config#variable-enable-fsm)** <br>When true (default) the DS402 state-machine (`CiA402Fsm`) runs each cyclic iteration and drives the controlword through the standard enable/disable/fault-reset sequence.  |
| bool | **[auto_fault_reset_and_recover](/lxmaster/api/classes/CiA402DriveProfile-Config#variable-auto-fault-reset-and-recover)** <br>When true the FSM automatically pulses a fault-reset and returns to enabling after a mid-run trip (any fault after Operation Enabled has been reached).  |

## Detailed Description

```cpp
struct ecdev::CiA402DriveProfile::Config;
```

Per-instance configuration for a `[CiA402DriveProfile](/lxmaster/api/classes/CiA402DriveProfile)`. 

Passed at construction and consumed by the profile lifecycle; some fields may be overridden at runtime via `[setOperatingMode()](/lxmaster/api/classes/CiA402DriveProfile#function-setoperatingmode)` / `[setAutoFaultRecover()](/lxmaster/api/classes/CiA402DriveProfile#function-setautofaultrecover)` between `prepare()` and `start()`. 

## Public Attributes Documentation

### variable startup_fault_autoreset

```cpp
bool startup_fault_autoreset {true};
```

When a drive enters OPERATIONAL already in the Fault state (a residual fault carried over from a prior run, before this run has ever reached Operation Enabled), automatically pulse a bounded fault-reset and continue the enable sequence instead of treating it as a terminal stop. 

A fault that appears _after_ the drive reaches Operation Enabled is always terminal regardless of this flag. On by default. 


### variable shutdown_require_switch_on_disabled

```cpp
bool shutdown_require_switch_on_disabled {true};
```

When true (default), the shutdown sequence waits for the drive to reach Switch-On Disabled (or Fault) before proceeding to the AL state walk-down. 

Set false to skip the wait, which can speed up shutdown on drives that do not de-energise quickly. 


### variable op_mode

```cpp
OpMode op_mode {OpMode::Csp};
```

Initial cyclic operating mode (CSP/CSV/CST). 

Seeded into the drive at PRE_OP via SDO and used as the default when 0x6060 is not mapped in the RxPDO. Override with `[setOperatingMode()](/lxmaster/api/classes/CiA402DriveProfile#function-setoperatingmode)` between `prepare()` and `start()`. 


### variable hold_actual_position

```cpp
bool hold_actual_position {true};
```

When the axis is enabled and no `moveTo()` has been issued yet, command the drive to hold its actual position at enable time (CSP: target = actualPosition). 

Prevents unintended motion when the application enables the drive before setting a target. 


### variable fault_reset_arm_cycles

```cpp
int fault_reset_arm_cycles {50};
```

Number of RT cycles the startup fault-reset window remains active (see `startup_fault_autoreset`). 

After this many cycles without reaching Operation Enabled the reset attempt is abandoned and the fault is treated as terminal. 


### variable enable_fsm

```cpp
bool enable_fsm {true};
```

When true (default) the DS402 state-machine (`CiA402Fsm`) runs each cyclic iteration and drives the controlword through the standard enable/disable/fault-reset sequence. 

Set false only for diagnostic profiling where you want to write the controlword manually. 


### variable auto_fault_reset_and_recover

```cpp
bool auto_fault_reset_and_recover {false};
```

When true the FSM automatically pulses a fault-reset and returns to enabling after a mid-run trip (any fault after Operation Enabled has been reached). 

When false (default) faults are terminal — the profile requests a cyclic stop and the application must handle recovery. 


-------------------------------

Updated on 2026-07-13 at 20:44:41 +0000