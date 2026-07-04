<!-- GENERATED - do not edit. Produced from the LXMASTER public
     headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->
---
title: ecdev::PdoAssignment
summary: Generic, ENI-driven CoE PDO assignment. 

slug: /lxmaster/api/classes/PdoAssignment
sidebar_label: "PdoAssignment"
---

# ecdev::PdoAssignment



Generic, ENI-driven CoE PDO assignment.  [More...](#detailed-description)


`#include <pdo_assignment.hpp>`

## Public Classes

|                | Name           |
| -------------- | -------------- |
| struct | **[SmGroup](/lxmaster/api/classes/PdoAssignment-SmGroup)**  |
| struct | **[PdoPlan](/lxmaster/api/classes/PdoAssignment-PdoPlan)**  |

## Public Functions

|                | Name           |
| -------------- | -------------- |
| bool | **[verify](/lxmaster/api/classes/PdoAssignment#function-verify)**(ISlaveServices & svc) const<br>Read back assignment + mapping counts to confirm the plan is active.  |
| [PdoAssignment](/lxmaster/api/classes/PdoAssignment) | **[fromSlaveConfig](/lxmaster/api/classes/PdoAssignment#function-fromslaveconfig)**(const eni::SlaveConfig & slave)<br>Build the assignment plan from an ENI slave (its sync managers + rx/tx PDOs).  |
| int | **[expectedWkc](/lxmaster/api/classes/PdoAssignment#function-expectedwkc)**() const<br>Aggregate WKC expected from `[apply()]()` when every SDO succeeds once.  |
| bool | **[empty](/lxmaster/api/classes/PdoAssignment#function-empty)**() const<br>True when there is at least one mapped data SM to program.  |
| int | **[apply](/lxmaster/api/classes/PdoAssignment#function-apply)**(ISlaveServices & svc) const<br>Program the assignment over CoE.  |

## Detailed Description

```cpp
class ecdev::PdoAssignment;
```

Generic, ENI-driven CoE PDO assignment. 

Programs each data SyncManager's assignment object (0x1C1x) and the contained mapping objects (0x16xx RxPDO / 0x1Axx TxPDO) to EXACTLY what the ENI `<Slave>` describes &ndash; for any CoE device, not just CiA402 drives. This replaces the hardcoded 0x1600/0x1A00 remap that used to live in `CiA402Device`/`CiA402PdoCodec`.

It is applied generically by `[GenericEniDevice]` in the PreOP PO2SO hook, before the device profile's own configuration. The backend's config-map step then computes the SM lengths, FMMUs, and the logical process image from the assignment we just programmed &ndash; so the byte offsets in the `[ProcessImage](/lxmaster/api/classes/ProcessImage)` (also derived from the same ENI PDOs) line up with the live IOmap.

Reaches the master only through `[ISlaveServices]` (no backend types here). 

## Public Functions Documentation

### function verify

```cpp
bool verify(
    ISlaveServices & svc
) const
```

Read back assignment + mapping counts to confirm the plan is active. 

### function fromSlaveConfig

```cpp
static PdoAssignment fromSlaveConfig(
    const eni::SlaveConfig & slave
)
```

Build the assignment plan from an ENI slave (its sync managers + rx/tx PDOs). 

### function expectedWkc

```cpp
inline int expectedWkc() const
```

Aggregate WKC expected from `[apply()]()` when every SDO succeeds once. 

### function empty

```cpp
inline bool empty() const
```

True when there is at least one mapped data SM to program. 

### function apply

```cpp
int apply(
    ISlaveServices & svc
) const
```

Program the assignment over CoE. 

Returns the aggregate working counter. 


-------------------------------

Updated on 2026-07-04 at 20:22:54 +0000