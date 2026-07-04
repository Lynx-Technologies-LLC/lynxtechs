<!-- GENERATED - do not edit. Produced from the LXMASTER public
     headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->
---
title: ecnet::diag
summary: SAFE_OP bring-up diagnostics, split from the logging layer: each probe* reads the bus into a plain report struct, and format() renders it. 

---

# ecnet::diag

SAFE_OP bring-up diagnostics, split from the logging layer: each `probe*` reads the bus into a plain report struct, and `format()` renders it.  [More...](#detailed-description)

## Classes

|                | Name           |
| -------------- | -------------- |
| struct | **[ecnet::diag::StrictSyncSlave](/lxmaster/api/classes/structecnet_1_1diag_1_1strictsyncslave)**  |
| struct | **[ecnet::diag::StrictSyncReport](/lxmaster/api/classes/structecnet_1_1diag_1_1strictsyncreport)**  |
| struct | **[ecnet::diag::SdoU8](/lxmaster/api/classes/structecnet_1_1diag_1_1sdou8)** <br>Optional SDO scalar: `present` is false when the read failed / object is absent.  |
| struct | **[ecnet::diag::SdoU32](/lxmaster/api/classes/structecnet_1_1diag_1_1sdou32)**  |
| struct | **[ecnet::diag::SdoU16](/lxmaster/api/classes/structecnet_1_1diag_1_1sdou16)**  |
| struct | **[ecnet::diag::SdoI8](/lxmaster/api/classes/structecnet_1_1diag_1_1sdoi8)**  |
| struct | **[ecnet::diag::SafeOpDcSlave](/lxmaster/api/classes/structecnet_1_1diag_1_1safeopdcslave)**  |
| struct | **[ecnet::diag::SafeOpDcReport](/lxmaster/api/classes/structecnet_1_1diag_1_1safeopdcreport)**  |
| struct | **[ecnet::diag::PdoAssignObject](/lxmaster/api/classes/structecnet_1_1diag_1_1pdoassignobject)**  |
| struct | **[ecnet::diag::PdoAssignEntry](/lxmaster/api/classes/structecnet_1_1diag_1_1pdoassignentry)**  |
| struct | **[ecnet::diag::CoEErrorSlave](/lxmaster/api/classes/structecnet_1_1diag_1_1coeerrorslave)**  |
| struct | **[ecnet::diag::CoEErrorReport](/lxmaster/api/classes/structecnet_1_1diag_1_1coeerrorreport)**  |

## Functions

|                | Name           |
| -------------- | -------------- |
| StrictSyncReport | **[probeStrictSync](/lxmaster/api/namespaces/namespaceecnet_1_1diag#function-probestrictsync)**(ecmaster::EcMaster & master) |
| SafeOpDcReport | **[probeSafeOpDc](/lxmaster/api/namespaces/namespaceecnet_1_1diag#function-probesafeopdc)**(ecmaster::EcMaster & master, bool dc_enabled, bool sync0_enabled) |
| CoEErrorReport | **[probeDriveCoEErrors](/lxmaster/api/namespaces/namespaceecnet_1_1diag#function-probedrivecoeerrors)**(ecmaster::EcMaster & master, const char * when_label) |
| std::string | **[format](/lxmaster/api/namespaces/namespaceecnet_1_1diag#function-format)**(const SafeOpDcReport & r) |
| std::string | **[format](/lxmaster/api/namespaces/namespaceecnet_1_1diag#function-format)**(const StrictSyncReport & r) |
| std::string | **[format](/lxmaster/api/namespaces/namespaceecnet_1_1diag#function-format)**(const CoEErrorReport & r) |

## Detailed Description

SAFE_OP bring-up diagnostics, split from the logging layer: each `probe*` reads the bus into a plain report struct, and `format()` renders it. 

This decouples "should I probe" (a bring-up decision in `[EcNetwork](/lxmaster/api/classes/classecnet_1_1ecnetwork)`) from "how/whether to print" (a logging decision). The probe bodies are compiled only under `LXMASTER_DEBUG`; all call sites are inside `if constexpr (ecdev::kDebugEnabled)` so release builds neither call nor link them. 


## Functions Documentation

### function probeStrictSync

```cpp
StrictSyncReport probeStrictSync(
    ecmaster::EcMaster & master
)
```


### function probeSafeOpDc

```cpp
SafeOpDcReport probeSafeOpDc(
    ecmaster::EcMaster & master,
    bool dc_enabled,
    bool sync0_enabled
)
```


### function probeDriveCoEErrors

```cpp
CoEErrorReport probeDriveCoEErrors(
    ecmaster::EcMaster & master,
    const char * when_label
)
```


### function format

```cpp
std::string format(
    const SafeOpDcReport & r
)
```


### function format

```cpp
std::string format(
    const StrictSyncReport & r
)
```


### function format

```cpp
std::string format(
    const CoEErrorReport & r
)
```






-------------------------------

Updated on 2026-07-04 at 20:22:54 +0000