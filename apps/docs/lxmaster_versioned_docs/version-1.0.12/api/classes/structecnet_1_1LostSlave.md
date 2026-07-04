---
title: "ecnet::LostSlave"
summary: "One slave that stopped responding when the bus fault was diagnosed."

slug: /api/classes/LostSlave
sidebar_label: "LostSlave"
---
<!-- GENERATED - do not edit. Produced from the LXMASTER public
     headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->

# ecnet::LostSlave

One slave that stopped responding when the bus fault was diagnosed.  [More...](#detailed-description)

`#include <bus_fault.hpp>`

## Public Attributes

|                | Name           |
| -------------- | -------------- |
| std::string | **[name](/lxmaster/api/classes/LostSlave#variable-name)**  |
| int | **[index](/lxmaster/api/classes/LostSlave#variable-index)**  |

## Detailed Description

```cpp
struct ecnet::LostSlave;
```

One slave that stopped responding when the bus fault was diagnosed. 

`index` is the 1-based bus position; `name` is the SII/ENI device name. 

## Public Attributes Documentation

### variable name

```cpp
std::string name;
```

### variable index

```cpp
int index {0};
```

-------------------------------

Updated on 2026-07-04 at 20:22:54 +0000