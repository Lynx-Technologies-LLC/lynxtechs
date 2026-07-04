---
title: ecnet::diag::CoEErrorSlave

slug: /lxmaster/api/classes/diag-CoEErrorSlave
sidebar_label: "CoEErrorSlave"
---
<!-- GENERATED - do not edit. Produced from the LXMASTER public
     headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->

# ecnet::diag::CoEErrorSlave





## Public Attributes

|                | Name           |
| -------------- | -------------- |
| std::uint16_t | **[state](/lxmaster/api/classes/diag-CoEErrorSlave#variable-state)**  |
| std::vector< SdoU32 > | **[predef_error_history](/lxmaster/api/classes/diag-CoEErrorSlave#variable-predef-error-history)** <br>0x1003:k  |
| [SdoU8](/lxmaster/api/classes/diag-SdoU8) | **[predef_error_count](/lxmaster/api/classes/diag-CoEErrorSlave#variable-predef-error-count)** <br>0x1003:0  |
| SdoI8 | **[mode_of_op_display](/lxmaster/api/classes/diag-CoEErrorSlave#variable-mode-of-op-display)** <br>0x6061:0  |
| int | **[idx](/lxmaster/api/classes/diag-CoEErrorSlave#variable-idx)**  |
| unsigned | **[history_not_shown](/lxmaster/api/classes/diag-CoEErrorSlave#variable-history-not-shown)**  |
| [SdoU8](/lxmaster/api/classes/diag-SdoU8) | **[error_register](/lxmaster/api/classes/diag-CoEErrorSlave#variable-error-register)** <br>0x1001:0  |
| SdoU16 | **[cia402_error_code](/lxmaster/api/classes/diag-CoEErrorSlave#variable-cia402-error-code)** <br>0x603F:0  |
| std::uint16_t | **[al_status_code](/lxmaster/api/classes/diag-CoEErrorSlave#variable-al-status-code)**  |

## Public Attributes Documentation

### variable state

```cpp
std::uint16_t state {0};
```


### variable predef_error_history

```cpp
std::vector< SdoU32 > predef_error_history;
```

0x1003:k 

### variable predef_error_count

```cpp
SdoU8 predef_error_count;
```

0x1003:0 

### variable mode_of_op_display

```cpp
SdoI8 mode_of_op_display;
```

0x6061:0 

### variable idx

```cpp
int idx {0};
```


### variable history_not_shown

```cpp
unsigned history_not_shown {0};
```


### variable error_register

```cpp
SdoU8 error_register;
```

0x1001:0 

### variable cia402_error_code

```cpp
SdoU16 cia402_error_code;
```

0x603F:0 

### variable al_status_code

```cpp
std::uint16_t al_status_code {0};
```


-------------------------------

Updated on 2026-07-04 at 20:22:54 +0000