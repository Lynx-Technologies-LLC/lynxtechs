---
title: "ecnet"

slug: /lxmaster/api/namespaces/ecnet
sidebar_label: "ecnet"
---
<!-- GENERATED - do not edit. Produced from the LXMASTER public
     headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->

# ecnet



## Namespaces

| Name           |
| -------------- |
| **[ecnet::diag](/lxmaster/api/namespaces/ecnet-diag)** <br>SAFE_OP bring-up diagnostics, split from the logging layer: each `probe*` reads the bus into a plain report struct, and `format()` renders it.  |

## Classes

|                | Name           |
| -------------- | -------------- |
| struct | **[ecnet::SyncTraceSample](/lxmaster/api/classes/SyncTraceSample)**  |
| struct | **[ecnet::ShutdownConfig](/lxmaster/api/classes/ShutdownConfig)**  |
| struct | **[ecnet::RtConfig](/lxmaster/api/classes/RtConfig)**  |
| struct | **[ecnet::NetworkConfig](/lxmaster/api/classes/NetworkConfig)** <br>User-facing configuration for an [EcNetwork]().  |
| struct | **[ecnet::LostSlave](/lxmaster/api/classes/LostSlave)** <br>One slave that stopped responding when the bus fault was diagnosed.  |
| struct | **[ecnet::EniConfig](/lxmaster/api/classes/EniConfig)** <br>ENI-driven configuration.  |
| class | **[ecnet::EcNetwork](/lxmaster/api/classes/EcNetwork)** <br>User-facing runtime facade for an EtherCAT network.  |
| struct | **[ecnet::DebugConfig](/lxmaster/api/classes/DebugConfig)** <br>Runtime logging configuration.  |
| struct | **[ecnet::DcConfig](/lxmaster/api/classes/DcConfig)**  |
| struct | **[ecnet::BusFault](/lxmaster/api/classes/BusFault)** <br>Structured description of a cyclic-bus fault, built when the cycle-health watchdog trips (see `NetworkConfig::watchdog_low_wkc_cycles`).  |
| struct | **[ecnet::BusConfig](/lxmaster/api/classes/BusConfig)**  |

## Types

|                | Name           |
| -------------- | -------------- |
| enum class std::uint8_t | **[SyncTracePhase](/lxmaster/api/namespaces/ecnet#enum-synctracephase)** { Warmup = 0, Shutdown = 4, Operational = 3, DcGate = 1, Cooldown = 2} |
| using ecdev::SyncMode | **[SyncMode](/lxmaster/api/namespaces/ecnet#using-syncmode)** <br>Re-exported here so callers only need `[ecnet/network_config.hpp]`.  |

## Attributes

|                | Name           |
| -------------- | -------------- |
| constexpr std::int32_t | **[kDcSyncBusyWaitAuto](/lxmaster/api/namespaces/ecnet#variable-kdcsyncbusywaitauto)** <br>Pass to `DcConfig::dc_sync_busy_wait_ns` to use `bus.cycle_ns / 4`.  |

## Types Documentation

### enum SyncTracePhase

| Enumerator | Value | Description |
| ---------- | ----- | ----------- |
| Warmup | 0|   |
| Shutdown | 4|   |
| Operational | 3|   |
| DcGate | 1|   |
| Cooldown | 2|   |




### using SyncMode

```cpp
using ecnet::SyncMode = typedef ecdev::SyncMode;
```

Re-exported here so callers only need `[ecnet/network_config.hpp]`. 



## Attributes Documentation

### variable kDcSyncBusyWaitAuto

```cpp
static constexpr std::int32_t kDcSyncBusyWaitAuto = -1;
```

Pass to `DcConfig::dc_sync_busy_wait_ns` to use `bus.cycle_ns / 4`. 




-------------------------------

Updated on 2026-07-04 at 20:22:54 +0000