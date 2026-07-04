---
title: ecnet::DebugConfig
summary: Runtime logging configuration. 

slug: /lxmaster/api/classes/DebugConfig
sidebar_label: "DebugConfig"
---
<!-- GENERATED - do not edit. Produced from the LXMASTER public
     headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->

# ecnet::DebugConfig



Runtime logging configuration.  [More...](#detailed-description)


`#include <network_config.hpp>`

## Public Attributes

|                | Name           |
| -------------- | -------------- |
| std::uint32_t | **[sync_trace_window_ns](/lxmaster/api/classes/DebugConfig#variable-sync-trace-window-ns)**  |
| std::size_t | **[sync_trace_capacity](/lxmaster/api/classes/DebugConfig#variable-sync-trace-capacity)**  |
| ecdev::LogLevel | **[min_level](/lxmaster/api/classes/DebugConfig#variable-min-level)**  |
| std::string | **[log_file](/lxmaster/api/classes/DebugConfig#variable-log-file)** <br>Empty => ConsoleSink (cerr for Error/Warn, cout otherwise); non-empty => rotating FileSink.  |
| bool | **[enabled](/lxmaster/api/classes/DebugConfig#variable-enabled)**  |
| std::size_t | **[debug_ring_capacity](/lxmaster/api/classes/DebugConfig#variable-debug-ring-capacity)** <br>Debug ring capacity (process-data snapshots) for the RT->worker hand-off.  |
| std::uint32_t | **[category_mask](/lxmaster/api/classes/DebugConfig#variable-category-mask)**  |

## Detailed Description

```cpp
struct ecnet::DebugConfig;
```

Runtime logging configuration. 

A single gate (`enabled`) replaces the old `debug`/`diagnostics` pair; severity and subsystem are selected by `min_level` / `category_mask`. The compile-time `LXMASTER_ENABLE_DEBUG` (`ecdev::kDebugEnabled`) still strips the verbose `Info`/`Debug`/`Trace` call sites from a release binary; `Error`/`Warn` remain. With `enabled == false` nothing is logged (default), preserving the historically quiet runtime. 

## Public Attributes Documentation

### variable sync_trace_window_ns

```cpp
std::uint32_t sync_trace_window_ns {0};
```


### variable sync_trace_capacity

```cpp
std::size_t sync_trace_capacity {0};
```


### variable min_level

```cpp
ecdev::LogLevel min_level {ecdev::LogLevel::Info};
```


### variable log_file

```cpp
std::string log_file;
```

Empty => ConsoleSink (cerr for Error/Warn, cout otherwise); non-empty => rotating FileSink. 

### variable enabled

```cpp
bool enabled {false};
```


### variable debug_ring_capacity

```cpp
std::size_t debug_ring_capacity {0};
```

Debug ring capacity (process-data snapshots) for the RT->worker hand-off. 

Power of two; 0 => built-in default. Larger gives high-rate Trace logging more headroom before drops. 


### variable category_mask

```cpp
std::uint32_t category_mask {ecdev::kLogCatAll};
```


-------------------------------

Updated on 2026-07-04 at 20:22:54 +0000