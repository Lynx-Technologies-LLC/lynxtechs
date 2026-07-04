---
title: "ecdev::PdoEntryRef"
summary: "Resolved location of one mapped CoE object inside a slave's process image."

slug: /lxmaster/api/classes/PdoEntryRef
sidebar_label: "PdoEntryRef"
---
<!-- GENERATED - do not edit. Produced from the LXMASTER public
     headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->

# ecdev::PdoEntryRef



Resolved location of one mapped CoE object inside a slave's process image.  [More...](#detailed-description)


`#include <process_image.hpp>`

## Public Attributes

|                | Name           |
| -------------- | -------------- |
| bool | **[valid](/lxmaster/api/classes/PdoEntryRef#variable-valid)**  |
| bool | **[is_output](/lxmaster/api/classes/PdoEntryRef#variable-is-output)** <br>true: lives in the output (RxPdo) image; false: input (TxPdo).  |
| std::uint32_t | **[byte_offset](/lxmaster/api/classes/PdoEntryRef#variable-byte-offset)** <br>Byte offset within the slave's output/input region.  |
| std::uint8_t | **[bit_offset](/lxmaster/api/classes/PdoEntryRef#variable-bit-offset)** <br>Sub-byte bit offset (0..7) for packed booleans.  |
| std::uint8_t | **[bit_len](/lxmaster/api/classes/PdoEntryRef#variable-bit-len)** <br>Object width in bits.  |

## Detailed Description

```cpp
struct ecdev::PdoEntryRef;
```

Resolved location of one mapped CoE object inside a slave's process image. 

Produced once at setup time by `[ProcessImage::resolve](/lxmaster/api/classes/ProcessImage#function-resolve)`; the profile then reads/writes via this handle on the RT cyclic path with no map lookup. `valid == false` means the object is not mapped into the slave's PDOs (the profile must handle that gracefully). 

## Public Attributes Documentation

### variable valid

```cpp
bool valid {false};
```


### variable is_output

```cpp
bool is_output {false};
```

true: lives in the output (RxPdo) image; false: input (TxPdo). 

### variable byte_offset

```cpp
std::uint32_t byte_offset {0};
```

Byte offset within the slave's output/input region. 

### variable bit_offset

```cpp
std::uint8_t bit_offset {0};
```

Sub-byte bit offset (0..7) for packed booleans. 

### variable bit_len

```cpp
std::uint8_t bit_len {0};
```

Object width in bits. 

-------------------------------

Updated on 2026-07-04 at 20:22:54 +0000