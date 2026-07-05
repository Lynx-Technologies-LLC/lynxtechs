---
sidebar_position: 1
title: Getting Started
---

# Getting Started with the LXDIO33-16

> Sample content. Replace with the finalized bring-up procedure.

This tutorial walks through wiring the LXDIO33-16 into an EtherCAT segment and
reading/writing its digital channels from the
[LXMASTER software](/lxmaster/getting-started).

## 1. Wire the module

1. Power the module per the [PCB Integration](../../pcb-integration.md) guide.
2. Connect the EtherCAT **IN** port to the upstream device (or the master NIC).
3. Optionally daisy-chain the **OUT** port to the next device.

## 2. Discover the module

Bring up the network and confirm the module is discovered:

```bash
sudo lxmaster run network_probe --eni network.eni.xml
```

## 3. Drive the I/O from C++

Use an `IoModule` handle from the LXMASTER API to read inputs and write outputs.
See the [LXMASTER Getting Started](/lxmaster/getting-started) guide and
the [API Reference](../../../lxmaster/api) for details.

## Next steps

- Explore the [example projects](../examples) for this module.
