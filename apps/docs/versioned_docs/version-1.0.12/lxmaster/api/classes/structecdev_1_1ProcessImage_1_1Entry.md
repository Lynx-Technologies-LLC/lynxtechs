---
title: "ecdev::ProcessImage::Entry"
summary: "All resolved entries, in image order (diagnostics / enumeration by facades)."

slug: /lxmaster/api/classes/ProcessImage-Entry
sidebar_label: "Entry"
---
<!-- GENERATED - do not edit. Produced from the LXMASTER public
     headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->

# ecdev::ProcessImage::Entry



All resolved entries, in image order (diagnostics / enumeration by facades). 


`#include <process_image.hpp>`

## Public Attributes

|                | Name           |
| -------------- | -------------- |
| std::uint8_t | **[sub_index](/lxmaster/api/classes/ProcessImage-Entry#variable-sub-index)**  |
| bool | **[is_output](/lxmaster/api/classes/ProcessImage-Entry#variable-is-output)**  |
| std::uint16_t | **[index](/lxmaster/api/classes/ProcessImage-Entry#variable-index)**  |
| std::uint32_t | **[byte_offset](/lxmaster/api/classes/ProcessImage-Entry#variable-byte-offset)**  |
| std::uint8_t | **[bit_offset](/lxmaster/api/classes/ProcessImage-Entry#variable-bit-offset)**  |
| std::uint8_t | **[bit_len](/lxmaster/api/classes/ProcessImage-Entry#variable-bit-len)**  |

## Public Attributes Documentation

### variable sub_index

```cpp
std::uint8_t sub_index {0};
```


### variable is_output

```cpp
bool is_output {false};
```


### variable index

```cpp
std::uint16_t index {0};
```


### variable byte_offset

```cpp
std::uint32_t byte_offset {0};
```


### variable bit_offset

```cpp
std::uint8_t bit_offset {0};
```


### variable bit_len

```cpp
std::uint8_t bit_len {0};
```


-------------------------------

Updated on 2026-07-04 at 20:22:54 +0000