---
title: ecnet::EniConfig
summary: ENI-driven configuration. 

slug: /lxmaster/api/classes/EniConfig
sidebar_label: "EniConfig"
---
<!-- GENERATED - do not edit. Produced from the LXMASTER public
     headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->

# ecnet::EniConfig



ENI-driven configuration.  [More...](#detailed-description)


`#include <network_config.hpp>`

## Public Attributes

|                | Name           |
| -------------- | -------------- |
| std::string | **[eni_path](/lxmaster/api/classes/EniConfig#variable-eni-path)**  |

## Detailed Description

```cpp
struct ecnet::EniConfig;
```

ENI-driven configuration. 

[EcNetwork](/lxmaster/api/classes/EcNetwork) loads `eni_path` (required), validates it against the project-bundled ETG.2100 schema (embedded — there is no user-supplied XSD), verifies it matches the scanned hardware, and auto-creates one generic CiA402 device per ENI <Slave>. ENI is the only setup mode: there is no code-first / hard-coded device path.

Per-axis settings are applied after prepare() returns by iterating net.axes(): call Axis::setDriveMode(op_mode) to pick CSP/CSV/CST and Axis::configure() to walk the axis to OP. 

## Public Attributes Documentation

### variable eni_path

```cpp
std::string eni_path;
```


-------------------------------

Updated on 2026-07-04 at 20:22:54 +0000