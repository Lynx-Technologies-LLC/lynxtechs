<!-- GENERATED - do not edit. Produced from the LXMASTER public
     headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->
---
title: ecnet::EcNetwork::DcSyncStats
summary: End-of-run DC-sync alignment summary (host wake vs reference-slave DC clock). 

slug: /lxmaster/api/classes/EcNetwork-DcSyncStats
sidebar_label: "DcSyncStats"
---

# ecnet::EcNetwork::DcSyncStats



End-of-run DC-sync alignment summary (host wake vs reference-slave DC clock). 


`#include <ec_network.hpp>`

## Public Attributes

|                | Name           |
| -------------- | -------------- |
| std::uint64_t | **[samples](/lxmaster/api/classes/EcNetwork-DcSyncStats#variable-samples)**  |
| std::int64_t | **[min_ns](/lxmaster/api/classes/EcNetwork-DcSyncStats#variable-min-ns)**  |
| std::int64_t | **[mean_ns](/lxmaster/api/classes/EcNetwork-DcSyncStats#variable-mean-ns)**  |
| std::int64_t | **[mean_abs_ns](/lxmaster/api/classes/EcNetwork-DcSyncStats#variable-mean-abs-ns)**  |
| std::int64_t | **[max_ns](/lxmaster/api/classes/EcNetwork-DcSyncStats#variable-max-ns)**  |
| std::int64_t | **[final_integral](/lxmaster/api/classes/EcNetwork-DcSyncStats#variable-final-integral)**  |

## Public Attributes Documentation

### variable samples

```cpp
std::uint64_t samples {0};
```


### variable min_ns

```cpp
std::int64_t min_ns {0};
```


### variable mean_ns

```cpp
std::int64_t mean_ns {0};
```


### variable mean_abs_ns

```cpp
std::int64_t mean_abs_ns {0};
```


### variable max_ns

```cpp
std::int64_t max_ns {0};
```


### variable final_integral

```cpp
std::int64_t final_integral {0};
```


-------------------------------

Updated on 2026-07-04 at 20:22:54 +0000