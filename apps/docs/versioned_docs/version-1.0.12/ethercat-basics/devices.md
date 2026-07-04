---
sidebar_position: 2
title: Devices and Topology
---

# Devices and Topology

> Sample content. Replace with finalized descriptions and diagrams.

An EtherCAT network is made up of one **master** and one or more **devices**
(historically called "slaves").

## Master

The master is the controller of the network. It:

- Initializes and configures the devices.
- Manages the network state machine.
- Sends and receives the cyclic process data frames.

In our product, the master role is fulfilled by the
[LXMASTER software](../lxmaster/overview.md).

## Devices

Devices are the nodes attached to the network, such as I/O modules, drives, and
sensors. Each device:

- Processes the part of the frame addressed to it on the fly.
- Exposes **process data objects (PDOs)** for cyclic real-time exchange.
- Exposes **service data objects (SDOs)** for acyclic configuration.

## Process data

| Term | Description |
| --- | --- |
| PDO  | Process Data Object - cyclic, real-time data (inputs/outputs). |
| SDO  | Service Data Object - acyclic configuration and parameters. |
| ESI  | EtherCAT Slave Information - XML describing a device's capabilities. |

## Topology

EtherCAT supports flexible wiring topologies:

- **Line** - the simplest layout; devices daisy-chained one after another.
- **Tree / Star** - branches created using junction devices.
- **Ring** - adds cable redundancy for fault tolerance.

```text
Line:   M -- D1 -- D2 -- D3
Tree:   M -- D1 -- D2 -- D3
                    \-- D4 -- D5
```

Where `M` is the master and `Dn` are devices.
