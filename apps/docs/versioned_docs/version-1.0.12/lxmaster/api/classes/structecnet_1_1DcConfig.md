<!-- GENERATED - do not edit. Produced from the LXMASTER public
     headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->
---
title: ecnet::DcConfig

---

# ecnet::DcConfig





## Public Attributes

|                | Name           |
| -------------- | -------------- |
| bool | **[use_sync0](/lxmaster/api/classes/structecnet_1_1dcconfig#variable-use-sync0)**  |
| bool | **[use_dc](/lxmaster/api/classes/structecnet_1_1dcconfig#variable-use-dc)** <br>DC + SYNC0 enablement.  |
| bool | **[sync_trace_include_warmup](/lxmaster/api/classes/structecnet_1_1dcconfig#variable-sync-trace-include-warmup)**  |
| bool | **[ec_sync_to_dc](/lxmaster/api/classes/structecnet_1_1dcconfig#variable-ec-sync-to-dc)**  |
| std::int32_t | **[dc_sync_kp_div](/lxmaster/api/classes/structecnet_1_1dcconfig#variable-dc-sync-kp-div)**  |
| std::int32_t | **[dc_sync_ki_div](/lxmaster/api/classes/structecnet_1_1dcconfig#variable-dc-sync-ki-div)**  |
| std::int32_t | **[dc_sync_busy_wait_ns](/lxmaster/api/classes/structecnet_1_1dcconfig#variable-dc-sync-busy-wait-ns)**  |
| int | **[dc_lock_warmup_cycles](/lxmaster/api/classes/structecnet_1_1dcconfig#variable-dc-lock-warmup-cycles)**  |
| int | **[dc_diff_op_gate_timeout_cycles](/lxmaster/api/classes/structecnet_1_1dcconfig#variable-dc-diff-op-gate-timeout-cycles)**  |
| int | **[dc_diff_op_gate_stable_cycles](/lxmaster/api/classes/structecnet_1_1dcconfig#variable-dc-diff-op-gate-stable-cycles)**  |
| std::uint32_t | **[dc_diff_op_gate_max_ns](/lxmaster/api/classes/structecnet_1_1dcconfig#variable-dc-diff-op-gate-max-ns)**  |

## Public Attributes Documentation

### variable use_sync0

```cpp
bool use_sync0 {true};
```


### variable use_dc

```cpp
bool use_dc {true};
```

DC + SYNC0 enablement. 

Not user policy: `EcNetwork::loadAndValidateEni` derives both from whether the ENI carries a per-slave <DC> block, so the ENI is the source of truth. The SYNC0 period and shift likewise come from each slave's <DC> (CycleTime0 / ShiftTime), not from any code-side knob. 


### variable sync_trace_include_warmup

```cpp
bool sync_trace_include_warmup {false};
```


### variable ec_sync_to_dc

```cpp
bool ec_sync_to_dc {true};
```


### variable dc_sync_kp_div

```cpp
std::int32_t dc_sync_kp_div {3};
```


### variable dc_sync_ki_div

```cpp
std::int32_t dc_sync_ki_div {20};
```


### variable dc_sync_busy_wait_ns

```cpp
std::int32_t dc_sync_busy_wait_ns {kDcSyncBusyWaitAuto};
```


### variable dc_lock_warmup_cycles

```cpp
int dc_lock_warmup_cycles {200};
```


### variable dc_diff_op_gate_timeout_cycles

```cpp
int dc_diff_op_gate_timeout_cycles {2'000};
```


### variable dc_diff_op_gate_stable_cycles

```cpp
int dc_diff_op_gate_stable_cycles {40};
```


### variable dc_diff_op_gate_max_ns

```cpp
std::uint32_t dc_diff_op_gate_max_ns {10'000};
```


-------------------------------

Updated on 2026-07-04 at 20:22:54 +0000