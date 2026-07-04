<!-- GENERATED - do not edit. Produced from the LXMASTER public
     headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->
---
title: libs/ecnet/include/ecnet/diagnostics.hpp

---

# libs/ecnet/include/ecnet/diagnostics.hpp



## Namespaces

| Name           |
| -------------- |
| **[ecnet::diag](/lxmaster/api/namespaces/namespaceecnet_1_1diag)** <br>SAFE_OP bring-up diagnostics, split from the logging layer: each `probe*` reads the bus into a plain report struct, and `format()` renders it.  |
| **[ecnet](/lxmaster/api/namespaces/namespaceecnet)**  |

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






-------------------------------

Updated on 2026-07-04 at 20:22:54 +0000
