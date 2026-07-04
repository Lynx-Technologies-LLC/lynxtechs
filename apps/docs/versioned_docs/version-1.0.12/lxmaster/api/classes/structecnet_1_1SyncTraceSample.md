<!-- GENERATED - do not edit. Produced from the LXMASTER public
     headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->
---
title: ecnet::SyncTraceSample

slug: /lxmaster/api/classes/SyncTraceSample
sidebar_label: "SyncTraceSample"
---

# ecnet::SyncTraceSample





## Public Attributes

|                | Name           |
| -------------- | -------------- |
| std::int64_t | **[toff_ns](/lxmaster/api/classes/SyncTraceSample#variable-toff-ns)**  |
| std::uint64_t | **[rt_cycle](/lxmaster/api/classes/SyncTraceSample#variable-rt-cycle)**  |
| SyncTracePhase | **[phase](/lxmaster/api/classes/SyncTraceSample#variable-phase)**  |
| std::uint64_t | **[operational_cycle_seq](/lxmaster/api/classes/SyncTraceSample#variable-operational-cycle-seq)**  |
| std::int64_t | **[jitter_err_ns](/lxmaster/api/classes/SyncTraceSample#variable-jitter-err-ns)**  |
| std::int64_t | **[integral_ns](/lxmaster/api/classes/SyncTraceSample#variable-integral-ns)**  |
| std::int64_t | **[expected_dc_reftime_ns](/lxmaster/api/classes/SyncTraceSample#variable-expected-dc-reftime-ns)**  |
| std::int64_t | **[dc_reftime_ns](/lxmaster/api/classes/SyncTraceSample#variable-dc-reftime-ns)**  |
| std::int64_t | **[dc_delta_ns](/lxmaster/api/classes/SyncTraceSample#variable-dc-delta-ns)**  |

## Public Attributes Documentation

### variable toff_ns

```cpp
std::int64_t toff_ns {0};
```


### variable rt_cycle

```cpp
std::uint64_t rt_cycle {0};
```


### variable phase

```cpp
SyncTracePhase phase {SyncTracePhase::Operational};
```


### variable operational_cycle_seq

```cpp
std::uint64_t operational_cycle_seq {0};
```


### variable jitter_err_ns

```cpp
std::int64_t jitter_err_ns {0};
```


### variable integral_ns

```cpp
std::int64_t integral_ns {0};
```


### variable expected_dc_reftime_ns

```cpp
std::int64_t expected_dc_reftime_ns {0};
```


### variable dc_reftime_ns

```cpp
std::int64_t dc_reftime_ns {0};
```


### variable dc_delta_ns

```cpp
std::int64_t dc_delta_ns {0};
```


-------------------------------

Updated on 2026-07-04 at 20:22:54 +0000