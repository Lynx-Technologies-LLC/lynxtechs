---
title: "ecnet::EcNetwork::DcSyncStats"
summary: "Per-run DC-sync alignment summary: the signed error between the host's cyclic wake time and the reference-slave's distributed-clock (DC) reference time, measured before the PI controller applies its correction offset."

slug: /api/classes/EcNetwork-DcSyncStats
sidebar_label: "DcSyncStats"
---

<!-- GENERATED - do not edit. Produced from the LXMASTER public headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->
# ecnet::EcNetwork::DcSyncStats



Per-run DC-sync alignment summary: the signed error between the host's cyclic wake time and the reference-slave's distributed-clock (DC) reference time, measured before the PI controller applies its correction offset.  [More...](#detailed-description)


`#include <ec_network.hpp>`

## Public Attributes

|                | Name           |
| -------------- | -------------- |
| std::uint64_t | **[samples](/lxmaster/api/classes/EcNetwork-DcSyncStats#variable-samples)** <br>Number of cycles included in the statistics.  |
| std::int64_t | **[min_ns](/lxmaster/api/classes/EcNetwork-DcSyncStats#variable-min-ns)** <br>Minimum signed DC alignment error observed (ns).  |
| std::int64_t | **[mean_ns](/lxmaster/api/classes/EcNetwork-DcSyncStats#variable-mean-ns)** <br>Mean signed DC alignment error (ns).  |
| std::int64_t | **[mean_abs_ns](/lxmaster/api/classes/EcNetwork-DcSyncStats#variable-mean-abs-ns)** <br>Mean absolute DC alignment error (average lock quality regardless of sign, ns).  |
| std::int64_t | **[max_ns](/lxmaster/api/classes/EcNetwork-DcSyncStats#variable-max-ns)** <br>Maximum signed DC alignment error observed (ns).  |
| std::int64_t | **[final_integral](/lxmaster/api/classes/EcNetwork-DcSyncStats#variable-final-integral)** <br>PI integrator value (ns) at the end of the last cycle — the steady-state DC offset the controller converged to.  |

## Detailed Description

```cpp
struct ecnet::EcNetwork::DcSyncStats;
```

Per-run DC-sync alignment summary: the signed error between the host's cyclic wake time and the reference-slave's distributed-clock (DC) reference time, measured before the PI controller applies its correction offset. 

Populated only when running in `DcSync0` mode; `samples == 0` in `SmEvent` mode. Finalised at `[stop()](/lxmaster/api/classes/EcNetwork#function-stop)`. Retrieve via `[dcSyncStats()](/lxmaster/api/classes/EcNetwork#function-dcsyncstats)`. 

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

Minimum signed DC alignment error observed (ns). 

### variable mean_ns

```cpp
std::int64_t mean_ns {0};
```

Mean signed DC alignment error (ns). 

Values close to zero indicate a well-locked loop. 


### variable mean_abs_ns

```cpp
std::int64_t mean_abs_ns {0};
```

Mean absolute DC alignment error (average lock quality regardless of sign, ns). 

### variable max_ns

```cpp
std::int64_t max_ns {0};
```

Maximum signed DC alignment error observed (ns). 

### variable final_integral

```cpp
std::int64_t final_integral {0};
```

PI integrator value (ns) at the end of the last cycle — the steady-state DC offset the controller converged to. 

Useful for diagnosing systematic clock offset between host and bus. 


-------------------------------

Updated on 2026-07-13 at 20:44:41 +0000