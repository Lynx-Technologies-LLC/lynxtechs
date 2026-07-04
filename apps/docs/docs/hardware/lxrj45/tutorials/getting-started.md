---
sidebar_position: 1
title: Getting Started
---

# Getting Started with the LXRJ45

> Sample content. Replace with the finalized integration procedure.

This tutorial covers adding LXRJ45 RJ45 ports into an EtherCAT segment.

## 1. Wire the ports

1. Power the module per the [PCB Integration](../../pcb-integration.md) guide.
2. Connect the **IN** port to the upstream EtherCAT device.
3. Daisy-chain the **OUT** port to the next device.

## 2. Verify the segment

```bash
sudo lxmaster run network_probe --eni network.eni.xml
```

## Next steps

- Explore the [example projects](../examples) for this module.
- See the [LXMASTER software](/lxmaster/overview) docs to drive the bus.
