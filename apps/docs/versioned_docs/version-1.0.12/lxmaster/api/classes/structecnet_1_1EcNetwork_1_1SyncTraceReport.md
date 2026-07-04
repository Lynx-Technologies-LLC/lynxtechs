---
title: ecnet::EcNetwork::SyncTraceReport
summary: Cached at stop() from the cyclic executor's sync trace ring (see NetworkConfig::sync_trace_capacity). 

slug: /lxmaster/api/classes/EcNetwork-SyncTraceReport
sidebar_label: "SyncTraceReport"
---
<!-- GENERATED - do not edit. Produced from the LXMASTER public
     headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->

# ecnet::EcNetwork::SyncTraceReport



Cached at `[stop()](/lxmaster/api/classes/EcNetwork#function-stop)` from the cyclic executor's sync trace ring (see `NetworkConfig::sync_trace_capacity`). 


`#include <ec_network.hpp>`

## Public Attributes

|                | Name           |
| -------------- | -------------- |
| std::uint64_t | **[violation_count](/lxmaster/api/classes/EcNetwork-SyncTraceReport#variable-violation-count)** <br>Cycles where `|dc_delta|` exceeded `NetworkConfig::sync_trace_window_ns` (window == 0 ⇒ always 0).  |
| std::uint64_t | **[total_writes](/lxmaster/api/classes/EcNetwork-SyncTraceReport#variable-total-writes)**  |
| std::vector< SyncTraceSample > | **[samples](/lxmaster/api/classes/EcNetwork-SyncTraceReport#variable-samples)**  |
| std::size_t | **[ring_capacity](/lxmaster/api/classes/EcNetwork-SyncTraceReport#variable-ring-capacity)**  |

## Public Attributes Documentation

### variable violation_count

```cpp
std::uint64_t violation_count {0};
```

Cycles where `|dc_delta|` exceeded `NetworkConfig::sync_trace_window_ns` (window == 0 ⇒ always 0). 

### variable total_writes

```cpp
std::uint64_t total_writes {0};
```


### variable samples

```cpp
std::vector< SyncTraceSample > samples;
```


### variable ring_capacity

```cpp
std::size_t ring_capacity {0};
```


-------------------------------

Updated on 2026-07-04 at 20:22:54 +0000