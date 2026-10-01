---
title: "ecdev::EnableAttemptSnapshot"
summary: "What a CiA402 drive looked like while it was asked to enable but never got there."

slug: /api/classes/EnableAttemptSnapshot
sidebar_label: "EnableAttemptSnapshot"
---

<!-- GENERATED - do not edit. Produced from the LXMASTER public headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->
# ecdev::EnableAttemptSnapshot



What a CiA402 drive looked like while it was asked to enable but never got there. 


`#include <cia402_drive_profile.hpp>`

## Public Attributes

|                | Name           |
| -------------- | -------------- |
| std::uint16_t | **[slave](/lxmaster/api/classes/EnableAttemptSnapshot#variable-slave)**  |
| std::uint32_t | **[sdo_statusword](/lxmaster/api/classes/EnableAttemptSnapshot#variable-sdo-statusword)** <br>0x6041 read over SDO after the run.  |
| std::uint16_t | **[pdo_statusword](/lxmaster/api/classes/EnableAttemptSnapshot#variable-pdo-statusword)** <br>Statusword from the TxPDO on the last such cycle.  |
| std::vector< std::uint8_t > | **[out_bytes](/lxmaster/api/classes/EnableAttemptSnapshot#variable-out-bytes)** <br>Raw output image on the last such cycle.  |
| std::uint32_t | **[mode_display](/lxmaster/api/classes/EnableAttemptSnapshot#variable-mode-display)** <br>0x6061.  |
| std::vector< std::uint8_t > | **[in_bytes](/lxmaster/api/classes/EnableAttemptSnapshot#variable-in-bytes)** <br>Raw input image on the last such cycle.  |
| bool | **[have_sdo_statusword](/lxmaster/api/classes/EnableAttemptSnapshot#variable-have-sdo-statusword)**  |
| bool | **[have_mode_display](/lxmaster/api/classes/EnableAttemptSnapshot#variable-have-mode-display)**  |
| bool | **[have_error_register](/lxmaster/api/classes/EnableAttemptSnapshot#variable-have-error-register)**  |
| bool | **[have_error_code](/lxmaster/api/classes/EnableAttemptSnapshot#variable-have-error-code)**  |
| std::uint32_t | **[error_register](/lxmaster/api/classes/EnableAttemptSnapshot#variable-error-register)** <br>0x1001.  |
| std::uint32_t | **[error_code](/lxmaster/api/classes/EnableAttemptSnapshot#variable-error-code)** <br>0x603F.  |
| std::uint64_t | **[cw_hold_cycles](/lxmaster/api/classes/EnableAttemptSnapshot#variable-cw-hold-cycles)** <br>Consecutive cycles that controlword was held.  |
| std::uint16_t | **[controlword](/lxmaster/api/classes/EnableAttemptSnapshot#variable-controlword)** <br>Last controlword written on such a cycle.  |
| std::uint64_t | **[attempt_cycles](/lxmaster/api/classes/EnableAttemptSnapshot#variable-attempt-cycles)** <br>Cycles with enable requested and not yet enabled.  |

## Public Attributes Documentation

### variable slave

```cpp
std::uint16_t slave {0};
```


### variable sdo_statusword

```cpp
std::uint32_t sdo_statusword {0};
```

0x6041 read over SDO after the run. 

### variable pdo_statusword

```cpp
std::uint16_t pdo_statusword {0};
```

Statusword from the TxPDO on the last such cycle. 

### variable out_bytes

```cpp
std::vector< std::uint8_t > out_bytes;
```

Raw output image on the last such cycle. 

### variable mode_display

```cpp
std::uint32_t mode_display {0};
```

0x6061. 

### variable in_bytes

```cpp
std::vector< std::uint8_t > in_bytes;
```

Raw input image on the last such cycle. 

### variable have_sdo_statusword

```cpp
bool have_sdo_statusword {false};
```


### variable have_mode_display

```cpp
bool have_mode_display {false};
```


### variable have_error_register

```cpp
bool have_error_register {false};
```


### variable have_error_code

```cpp
bool have_error_code {false};
```


### variable error_register

```cpp
std::uint32_t error_register {0};
```

0x1001. 

### variable error_code

```cpp
std::uint32_t error_code {0};
```

0x603F. 

### variable cw_hold_cycles

```cpp
std::uint64_t cw_hold_cycles {0};
```

Consecutive cycles that controlword was held. 

### variable controlword

```cpp
std::uint16_t controlword {0};
```

Last controlword written on such a cycle. 

### variable attempt_cycles

```cpp
std::uint64_t attempt_cycles {0};
```

Cycles with enable requested and not yet enabled. 

-------------------------------

Updated on 2026-10-01 at 18:28:52 +0000