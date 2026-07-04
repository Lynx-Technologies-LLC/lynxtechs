<!-- GENERATED - do not edit. Produced from the LXMASTER public
     headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->
---
title: ecnet

---

# ecnet



## Namespaces

| Name           |
| -------------- |
| **[ecnet::diag](/lxmaster/api/namespaces/namespaceecnet_1_1diag)** <br>SAFE_OP bring-up diagnostics, split from the logging layer: each `probe*` reads the bus into a plain report struct, and `format()` renders it.  |

## Classes

|                | Name           |
| -------------- | -------------- |
| struct | **[ecnet::SyncTraceSample](/lxmaster/api/classes/structecnet_1_1synctracesample)**  |
| struct | **[ecnet::ShutdownConfig](/lxmaster/api/classes/structecnet_1_1shutdownconfig)**  |
| struct | **[ecnet::RtConfig](/lxmaster/api/classes/structecnet_1_1rtconfig)**  |
| struct | **[ecnet::NetworkConfig](/lxmaster/api/classes/structecnet_1_1networkconfig)** <br>User-facing configuration for an [EcNetwork]().  |
| struct | **[ecnet::LostSlave](/lxmaster/api/classes/structecnet_1_1lostslave)** <br>One slave that stopped responding when the bus fault was diagnosed.  |
| struct | **[ecnet::EniConfig](/lxmaster/api/classes/structecnet_1_1eniconfig)** <br>ENI-driven configuration.  |
| class | **[ecnet::EcNetwork](/lxmaster/api/classes/classecnet_1_1ecnetwork)** <br>User-facing runtime facade for an EtherCAT network.  |
| struct | **[ecnet::DebugConfig](/lxmaster/api/classes/structecnet_1_1debugconfig)** <br>Runtime logging configuration.  |
| struct | **[ecnet::DcConfig](/lxmaster/api/classes/structecnet_1_1dcconfig)**  |
| struct | **[ecnet::BusFault](/lxmaster/api/classes/structecnet_1_1busfault)** <br>Structured description of a cyclic-bus fault, built when the cycle-health watchdog trips (see `NetworkConfig::watchdog_low_wkc_cycles`).  |
| struct | **[ecnet::BusConfig](/lxmaster/api/classes/structecnet_1_1busconfig)**  |

## Types

|                | Name           |
| -------------- | -------------- |
| enum class std::uint8_t | **[SyncTracePhase](/lxmaster/api/namespaces/namespaceecnet#enum-synctracephase)** { Warmup = 0, Shutdown = 4, Operational = 3, DcGate = 1, Cooldown = 2} |
| using ecdev::SyncMode | **[SyncMode](/lxmaster/api/namespaces/namespaceecnet#using-syncmode)** <br>Re-exported here so callers only need `[ecnet/network_config.hpp]`.  |

## Attributes

|                | Name           |
| -------------- | -------------- |
| constexpr std::int32_t | **[kDcSyncBusyWaitAuto](/lxmaster/api/namespaces/namespaceecnet#variable-kdcsyncbusywaitauto)** <br>Pass to `DcConfig::dc_sync_busy_wait_ns` to use `bus.cycle_ns / 4`.  |

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