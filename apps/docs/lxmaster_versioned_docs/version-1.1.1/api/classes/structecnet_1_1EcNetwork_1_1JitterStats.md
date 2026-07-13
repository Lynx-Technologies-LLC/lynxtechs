---
title: "ecnet::EcNetwork::JitterStats"
summary: "Per-run cycle-timing jitter summary, populated by the cyclic thread and finalised at stop()."

slug: /api/classes/EcNetwork-JitterStats
sidebar_label: "JitterStats"
---

<!-- GENERATED - do not edit. Produced from the LXMASTER public headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->
# ecnet::EcNetwork::JitterStats



Per-run cycle-timing jitter summary, populated by the cyclic thread and finalised at `[stop()](/lxmaster/api/classes/EcNetwork#function-stop)`.  [More...](#detailed-description)


`#include <ec_network.hpp>`

## Public Attributes

|                | Name           |
| -------------- | -------------- |
| std::uint64_t | **[samples](/lxmaster/api/classes/EcNetwork-JitterStats#variable-samples)** <br>Number of cycles included in the statistics.  |
| std::int64_t | **[min_ns](/lxmaster/api/classes/EcNetwork-JitterStats#variable-min-ns)** <br>Minimum signed jitter sample observed (most-early wake, ns).  |
| std::int64_t | **[mean_ns](/lxmaster/api/classes/EcNetwork-JitterStats#variable-mean-ns)** <br>Mean signed jitter (systematic clock offset, ns).  |
| std::int64_t | **[mean_abs_ns](/lxmaster/api/classes/EcNetwork-JitterStats#variable-mean-abs-ns)** <br>Mean absolute jitter (average timing error magnitude regardless of sign, ns).  |
| std::int64_t | **[max_ns](/lxmaster/api/classes/EcNetwork-JitterStats#variable-max-ns)** <br>Maximum signed jitter sample observed (most-late wake, ns).  |

## Detailed Description

```cpp
struct ecnet::EcNetwork::JitterStats;
```

Per-run cycle-timing jitter summary, populated by the cyclic thread and finalised at `[stop()](/lxmaster/api/classes/EcNetwork#function-stop)`. 

All values are in nanoseconds and represent the distribution of the signed difference between the actual wake-up time of the RT thread and its ideal (nominal) deadline each cycle. Retrieve via `[jitterStats()](/lxmaster/api/classes/EcNetwork#function-jitterstats)`. 

## Public Attributes Documentation

### variable samples

```cpp
std::uint64_t samples {0};
```

Number of cycles included in the statistics. 

### variable min_ns

```cpp
std::int64_t min_ns {0};
```

Minimum signed jitter sample observed (most-early wake, ns). 

### variable mean_ns

```cpp
std::int64_t mean_ns {0};
```

Mean signed jitter (systematic clock offset, ns). 

Values close to zero are ideal. 


### variable mean_abs_ns

```cpp
std::int64_t mean_abs_ns {0};
```

Mean absolute jitter (average timing error magnitude regardless of sign, ns). 

### variable max_ns

```cpp
std::int64_t max_ns {0};
```

Maximum signed jitter sample observed (most-late wake, ns). 

-------------------------------

Updated on 2026-07-13 at 20:44:41 +0000