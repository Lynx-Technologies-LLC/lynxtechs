---
title: "ecnet::BusConfig"

slug: /lxmaster/api/classes/BusConfig
sidebar_label: "BusConfig"
---
<!-- GENERATED - do not edit. Produced from the LXMASTER public
     headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->

# ecnet::BusConfig





## Public Attributes

|                | Name           |
| -------------- | -------------- |
| SyncMode | **[sync_mode](/lxmaster/api/classes/BusConfig#variable-sync-mode)** <br>Resolved output, not an input: `EcNetwork::loadAndValidateEni` sets this from the ENI (DcSync0 when the bus carries a SYNC0 device, else SmEvent).  |
| std::string | **[ifname](/lxmaster/api/classes/BusConfig#variable-ifname)**  |
| std::uint32_t | **[cycle_ns](/lxmaster/api/classes/BusConfig#variable-cycle-ns)** <br>Cyclic period in ns.  |

## Public Attributes Documentation

### variable sync_mode

```cpp
SyncMode sync_mode {SyncMode::DcSync0};
```

Resolved output, not an input: `EcNetwork::loadAndValidateEni` sets this from the ENI (DcSync0 when the bus carries a SYNC0 device, else SmEvent). 

The app does not choose it. 


### variable ifname

```cpp
std::string ifname;
```


### variable cycle_ns

```cpp
std::uint32_t cycle_ns {0};
```

Cyclic period in ns. 

0 = unset until the ENI is loaded; `[EcNetwork](/lxmaster/api/classes/EcNetwork)` adopts the ENI's `<Config><Cyclic><CycleTime>` as the single source of truth. There is no CLI/code override. 


-------------------------------

Updated on 2026-07-04 at 20:22:54 +0000