---
title: "ecdev::ProfileSelectionInput"
summary: "Inputs a factory uses to decide on and build a profile for one ENI slave."

slug: /api/classes/ProfileSelectionInput
sidebar_label: "ProfileSelectionInput"
---

<!-- GENERATED - do not edit. Produced from the LXMASTER public headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->
# ecdev::ProfileSelectionInput



Inputs a factory uses to decide on and build a profile for one ENI slave. 


`#include <profile_registry.hpp>`

## Public Attributes

|                | Name           |
| -------------- | -------------- |
| bool | **[startup_fault_autoreset](/lxmaster/api/classes/ProfileSelectionInput#variable-startup-fault-autoreset)** <br>Clear a residual fault present at OP entry (before the drive has ever enabled this run) with a bounded reset window instead of latching a stop.  |
| const eni::SlaveConfig * | **[slave](/lxmaster/api/classes/ProfileSelectionInput#variable-slave)** <br>Pointer to the ENI slave descriptor for the slave being classified.  |
| DriveOpMode | **[op_mode](/lxmaster/api/classes/ProfileSelectionInput#variable-op-mode)** <br>Initial operating mode baked into the profile at construction (CSP default).  |
| bool | **[auto_fault_reset_and_recover](/lxmaster/api/classes/ProfileSelectionInput#variable-auto-fault-reset-and-recover)** <br>Initial auto fault-reset/recover flag (off by default).  |

## Public Attributes Documentation

### variable startup_fault_autoreset

```cpp
bool startup_fault_autoreset {true};
```

Clear a residual fault present at OP entry (before the drive has ever enabled this run) with a bounded reset window instead of latching a stop. 

On by default; mid-run faults stay terminal. 


### variable slave

```cpp
const eni::SlaveConfig * slave {nullptr};
```

Pointer to the ENI slave descriptor for the slave being classified. 

Never null during a normal bring-up; the factory uses this to inspect identity (vendor/product), PDO objects, and the CANopen profile number. 


### variable op_mode

```cpp
DriveOpMode op_mode {DriveOpMode::Csp};
```

Initial operating mode baked into the profile at construction (CSP default). 

Overridable at runtime via Axis::configure() between prepare() and start(). 


### variable auto_fault_reset_and_recover

```cpp
bool auto_fault_reset_and_recover {false};
```

Initial auto fault-reset/recover flag (off by default). 

Overridable via Axis::configure(). 


-------------------------------

Updated on 2026-07-13 at 20:44:41 +0000