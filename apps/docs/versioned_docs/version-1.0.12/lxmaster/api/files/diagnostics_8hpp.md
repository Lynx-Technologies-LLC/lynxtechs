---
title: libs/ecnet/include/ecnet/diagnostics.hpp

slug: /lxmaster/api/files/diagnostics_8hpp
sidebar_label: "libs/ecnet/include/ecnet/diagnostics.hpp"
---
<!-- GENERATED - do not edit. Produced from the LXMASTER public
     headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->

# libs/ecnet/include/ecnet/diagnostics.hpp



## Namespaces

| Name           |
| -------------- |
| **[ecnet::diag](/lxmaster/api/namespaces/ecnet-diag)** <br>SAFE_OP bring-up diagnostics, split from the logging layer: each `probe*` reads the bus into a plain report struct, and `format()` renders it.  |
| **[ecnet](/lxmaster/api/namespaces/ecnet)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| struct | **[ecnet::diag::StrictSyncSlave](/lxmaster/api/classes/diag-StrictSyncSlave)**  |
| struct | **[ecnet::diag::StrictSyncReport](/lxmaster/api/classes/diag-StrictSyncReport)**  |
| struct | **[ecnet::diag::SdoU8](/lxmaster/api/classes/diag-SdoU8)** <br>Optional SDO scalar: `present` is false when the read failed / object is absent.  |
| struct | **[ecnet::diag::SdoU32](/lxmaster/api/classes/diag-SdoU32)**  |
| struct | **[ecnet::diag::SdoU16](/lxmaster/api/classes/diag-SdoU16)**  |
| struct | **[ecnet::diag::SdoI8](/lxmaster/api/classes/diag-SdoI8)**  |
| struct | **[ecnet::diag::SafeOpDcSlave](/lxmaster/api/classes/diag-SafeOpDcSlave)**  |
| struct | **[ecnet::diag::SafeOpDcReport](/lxmaster/api/classes/diag-SafeOpDcReport)**  |
| struct | **[ecnet::diag::PdoAssignObject](/lxmaster/api/classes/diag-PdoAssignObject)**  |
| struct | **[ecnet::diag::PdoAssignEntry](/lxmaster/api/classes/diag-PdoAssignEntry)**  |
| struct | **[ecnet::diag::CoEErrorSlave](/lxmaster/api/classes/diag-CoEErrorSlave)**  |
| struct | **[ecnet::diag::CoEErrorReport](/lxmaster/api/classes/diag-CoEErrorReport)**  |






-------------------------------

Updated on 2026-07-04 at 20:22:54 +0000
