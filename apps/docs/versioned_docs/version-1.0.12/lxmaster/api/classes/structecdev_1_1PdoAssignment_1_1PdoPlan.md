---
title: "ecdev::PdoAssignment::PdoPlan"

slug: /lxmaster/api/classes/PdoAssignment-PdoPlan
sidebar_label: "PdoPlan"
---
<!-- GENERATED - do not edit. Produced from the LXMASTER public
     headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->

# ecdev::PdoAssignment::PdoPlan





## Public Attributes

|                | Name           |
| -------------- | -------------- |
| std::uint16_t | **[index](/lxmaster/api/classes/PdoAssignment-PdoPlan#variable-index)** <br>Mapping object index (0x16xx / 0x1Axx).  |
| std::vector< std::uint32_t > | **[entries](/lxmaster/api/classes/PdoAssignment-PdoPlan#variable-entries)** <br>Packed mapping words (index<<16|sub<<8|bitlen).  |

## Public Attributes Documentation

### variable index

```cpp
std::uint16_t index {0};
```

Mapping object index (0x16xx / 0x1Axx). 

### variable entries

```cpp
std::vector< std::uint32_t > entries;
```

Packed mapping words (index<<16|sub<<8|bitlen). 

-------------------------------

Updated on 2026-07-04 at 20:22:54 +0000