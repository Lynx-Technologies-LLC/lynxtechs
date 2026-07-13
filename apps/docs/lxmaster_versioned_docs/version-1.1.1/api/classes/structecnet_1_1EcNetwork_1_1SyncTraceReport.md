---
title: "ecnet::EcNetwork::SyncTraceReport"
summary: "Per-cycle DC-sync and jitter capture snapshot, cached at stop() from the executor's ring buffer (see NetworkConfig::DebugConfig::sync_trace_capacity)."

slug: /api/classes/EcNetwork-SyncTraceReport
sidebar_label: "SyncTraceReport"
---

<!-- GENERATED - do not edit. Produced from the LXMASTER public headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->
# ecnet::EcNetwork::SyncTraceReport



Per-cycle DC-sync and jitter capture snapshot, cached at `[stop()](/lxmaster/api/classes/EcNetwork#function-stop)` from the executor's ring buffer (see `NetworkConfig::DebugConfig::sync_trace_capacity`).  [More...](#detailed-description)


`#include <ec_network.hpp>`

## Public Attributes

|                | Name           |
| -------------- | -------------- |
| std::uint64_t | **[violation_count](/lxmaster/api/classes/EcNetwork-SyncTraceReport#variable-violation-count)** <br>Number of cycles where `|dc_delta_ns|` exceeded `NetworkConfig::sync_trace_window_ns`.  |
| std::uint64_t | **[total_writes](/lxmaster/api/classes/EcNetwork-SyncTraceReport#variable-total-writes)** <br>Total number of cycles written to the ring since `[start()](/lxmaster/api/classes/EcNetwork#function-start)` (may exceed `ring_capacity` when the ring wrapped).  |
| std::vector< SyncTraceSample > | **[samples](/lxmaster/api/classes/EcNetwork-SyncTraceReport#variable-samples)** <br>Ordered vector of per-cycle samples (oldest first) from the ring buffer.  |
| std::size_t | **[ring_capacity](/lxmaster/api/classes/EcNetwork-SyncTraceReport#variable-ring-capacity)** <br>Capacity the ring was configured with (number of slots).  |

## Detailed Description

```cpp
struct ecnet::EcNetwork::SyncTraceReport;
```

Per-cycle DC-sync and jitter capture snapshot, cached at `[stop()](/lxmaster/api/classes/EcNetwork#function-stop)` from the executor's ring buffer (see `NetworkConfig::DebugConfig::sync_trace_capacity`). 

Empty when tracing is disabled or the bus was never run. Retrieve via `[syncTraceReport()](/lxmaster/api/classes/EcNetwork#function-synctracereport)`. 

## Public Attributes Documentation

### variable violation_count

```cpp
std::uint64_t violation_count {0};
```

Number of cycles where `|dc_delta_ns|` exceeded `NetworkConfig::sync_trace_window_ns`. 

Always 0 when `sync_trace_window_ns == 0`. 


### variable total_writes

```cpp
std::uint64_t total_writes {0};
```

Total number of cycles written to the ring since `[start()](/lxmaster/api/classes/EcNetwork#function-start)` (may exceed `ring_capacity` when the ring wrapped). 

### variable samples

```cpp
std::vector< SyncTraceSample > samples;
```

Ordered vector of per-cycle samples (oldest first) from the ring buffer. 

### variable ring_capacity

```cpp
std::size_t ring_capacity {0};
```

Capacity the ring was configured with (number of slots). 

-------------------------------

Updated on 2026-07-13 at 20:44:41 +0000