---
title: ecdev::CiA402DriveProfile::Config

slug: /lxmaster/api/classes/CiA402DriveProfile-Config
sidebar_label: "Config"
---
<!-- GENERATED - do not edit. Produced from the LXMASTER public
     headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->

# ecdev::CiA402DriveProfile::Config





## Public Attributes

|                | Name           |
| -------------- | -------------- |
| bool | **[startup_fault_autoreset](/lxmaster/api/classes/CiA402DriveProfile-Config#variable-startup-fault-autoreset)** <br>When a drive boots into OPERATIONAL already faulted (a residual fault from a prior run, before it has ever reached Operation Enabled this run), automatically pulse a bounded fault-reset and continue enabling instead of latching a terminal stop.  |
| bool | **[shutdown_require_switch_on_disabled](/lxmaster/api/classes/CiA402DriveProfile-Config#variable-shutdown-require-switch-on-disabled)**  |
| [OpMode](/lxmaster/api/classes/CiA402DriveProfile#using-opmode) | **[op_mode](/lxmaster/api/classes/CiA402DriveProfile-Config#variable-op-mode)**  |
| bool | **[hold_actual_position](/lxmaster/api/classes/CiA402DriveProfile-Config#variable-hold-actual-position)**  |
| int | **[fault_reset_arm_cycles](/lxmaster/api/classes/CiA402DriveProfile-Config#variable-fault-reset-arm-cycles)**  |
| bool | **[enable_fsm](/lxmaster/api/classes/CiA402DriveProfile-Config#variable-enable-fsm)**  |
| bool | **[auto_fault_reset_and_recover](/lxmaster/api/classes/CiA402DriveProfile-Config#variable-auto-fault-reset-and-recover)**  |

## Public Attributes Documentation

### variable startup_fault_autoreset

```cpp
bool startup_fault_autoreset {true};
```

When a drive boots into OPERATIONAL already faulted (a residual fault from a prior run, before it has ever reached Operation Enabled this run), automatically pulse a bounded fault-reset and continue enabling instead of latching a terminal stop. 

A fault that appears after the drive was successfully enabled (genuine mid-run trip) is always terminal. 


### variable shutdown_require_switch_on_disabled

```cpp
bool shutdown_require_switch_on_disabled {true};
```


### variable op_mode

```cpp
OpMode op_mode {OpMode::Csp};
```


### variable hold_actual_position

```cpp
bool hold_actual_position {true};
```


### variable fault_reset_arm_cycles

```cpp
int fault_reset_arm_cycles {50};
```


### variable enable_fsm

```cpp
bool enable_fsm {true};
```


### variable auto_fault_reset_and_recover

```cpp
bool auto_fault_reset_and_recover {false};
```


-------------------------------

Updated on 2026-07-04 at 20:22:54 +0000