---
title: ecnet::diag::SafeOpDcSlave

slug: /lxmaster/api/classes/diag-SafeOpDcSlave
sidebar_label: "SafeOpDcSlave"
---
<!-- GENERATED - do not edit. Produced from the LXMASTER public
     headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->

# ecnet::diag::SafeOpDcSlave





## Public Attributes

|                | Name           |
| -------------- | -------------- |
| std::uint16_t | **[state](/lxmaster/api/classes/diag-SafeOpDcSlave#variable-state)**  |
| SdoU16 | **[sm3_sync_mode](/lxmaster/api/classes/diag-SafeOpDcSlave#variable-sm3-sync-mode)**  |
| SdoU16 | **[sm3_subcount](/lxmaster/api/classes/diag-SafeOpDcSlave#variable-sm3-subcount)**  |
| SdoU32 | **[sm3_shift_time](/lxmaster/api/classes/diag-SafeOpDcSlave#variable-sm3-shift-time)**  |
| SdoU32 | **[sm3_cycle_time](/lxmaster/api/classes/diag-SafeOpDcSlave#variable-sm3-cycle-time)**  |
| SdoU16 | **[sm2_sync_mode](/lxmaster/api/classes/diag-SafeOpDcSlave#variable-sm2-sync-mode)**  |
| SdoU16 | **[sm2_subcount](/lxmaster/api/classes/diag-SafeOpDcSlave#variable-sm2-subcount)**  |
| SdoU32 | **[sm2_shift_time](/lxmaster/api/classes/diag-SafeOpDcSlave#variable-sm2-shift-time)**  |
| SdoU32 | **[sm2_cycle_time](/lxmaster/api/classes/diag-SafeOpDcSlave#variable-sm2-cycle-time)**  |
| SdoU16 | **[interp_time_period](/lxmaster/api/classes/diag-SafeOpDcSlave#variable-interp-time-period)**  |
| SdoU16 | **[interp_time_index](/lxmaster/api/classes/diag-SafeOpDcSlave#variable-interp-time-index)**  |
| bool | **[in_safe_op](/lxmaster/api/classes/diag-SafeOpDcSlave#variable-in-safe-op)**  |
| int | **[idx](/lxmaster/api/classes/diag-SafeOpDcSlave#variable-idx)**  |
| bool | **[has_dc](/lxmaster/api/classes/diag-SafeOpDcSlave#variable-has-dc)**  |
| bool | **[dc_requested_but_absent](/lxmaster/api/classes/diag-SafeOpDcSlave#variable-dc-requested-but-absent)**  |
| std::uint16_t | **[al_status_code](/lxmaster/api/classes/diag-SafeOpDcSlave#variable-al-status-code)**  |
| bool | **[al_error](/lxmaster/api/classes/diag-SafeOpDcSlave#variable-al-error)**  |

## Public Attributes Documentation

### variable state

```cpp
std::uint16_t state {0};
```


### variable sm3_sync_mode

```cpp
SdoU16 sm3_sync_mode;
```


### variable sm3_subcount

```cpp
SdoU16 sm3_subcount;
```


### variable sm3_shift_time

```cpp
SdoU32 sm3_shift_time;
```


### variable sm3_cycle_time

```cpp
SdoU32 sm3_cycle_time;
```


### variable sm2_sync_mode

```cpp
SdoU16 sm2_sync_mode;
```


### variable sm2_subcount

```cpp
SdoU16 sm2_subcount;
```


### variable sm2_shift_time

```cpp
SdoU32 sm2_shift_time;
```


### variable sm2_cycle_time

```cpp
SdoU32 sm2_cycle_time;
```


### variable interp_time_period

```cpp
SdoU16 interp_time_period;
```


### variable interp_time_index

```cpp
SdoU16 interp_time_index;
```


### variable in_safe_op

```cpp
bool in_safe_op {false};
```


### variable idx

```cpp
int idx {0};
```


### variable has_dc

```cpp
bool has_dc {false};
```


### variable dc_requested_but_absent

```cpp
bool dc_requested_but_absent {false};
```


### variable al_status_code

```cpp
std::uint16_t al_status_code {0};
```


### variable al_error

```cpp
bool al_error {false};
```


-------------------------------

Updated on 2026-07-04 at 20:22:54 +0000