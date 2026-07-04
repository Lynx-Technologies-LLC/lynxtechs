---
title: "libs/ecnet/include/ecnet/ec_network.hpp"

slug: /lxmaster/api/files/ec_network_8hpp
sidebar_label: "libs/ecnet/include/ecnet/ec_network.hpp"
---
<!-- GENERATED - do not edit. Produced from the LXMASTER public
     headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->

# libs/ecnet/include/ecnet/ec_network.hpp



## Namespaces

| Name           |
| -------------- |
| **[ecnet](/lxmaster/api/namespaces/ecnet)**  |

## Classes

|                | Name           |
| -------------- | -------------- |
| struct | **[ecnet::EcNetwork::SyncTraceReport](/lxmaster/api/classes/EcNetwork-SyncTraceReport)** <br>Cached at `[stop()](/lxmaster/api/classes/EcNetwork#function-stop)` from the cyclic executor's sync trace ring (see `NetworkConfig::sync_trace_capacity`).  |
| struct | **[ecnet::EcNetwork::JitterStats](/lxmaster/api/classes/EcNetwork-JitterStats)** <br>End-of-run jitter summary (populated by the cyclic thread).  |
| struct | **[ecnet::EcNetwork::DcSyncStats](/lxmaster/api/classes/EcNetwork-DcSyncStats)** <br>End-of-run DC-sync alignment summary (host wake vs reference-slave DC clock).  |
| class | **[ecnet::EcNetwork](/lxmaster/api/classes/EcNetwork)** <br>User-facing runtime facade for an EtherCAT network.  |






-------------------------------

Updated on 2026-07-04 at 20:22:54 +0000
