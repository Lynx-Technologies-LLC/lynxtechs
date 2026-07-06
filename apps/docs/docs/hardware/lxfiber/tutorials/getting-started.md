---
sidebar_position: 1
title: Getting Started
---

# Getting Started with the LXFIBER

> Sample content. Replace with the finalized integration procedure.

This tutorial covers adding an LXFIBER fiber-optic link into an EtherCAT segment.

## 1. Insert the fiber link

1. Power the module per its datasheet specifications.
2. Connect the copper side to the upstream EtherCAT device.
3. Run the fiber to the downstream LXFIBER module and continue the segment.

## 2. Verify the segment

Bring up the network and confirm all devices are discovered:

```bash
sudo lxmaster run network_probe --eni network.eni.xml
```

## Next steps

- Explore the [example projects](../examples) for this module.
- See the [LXMASTER software](/lxmaster/overview) docs to drive the bus.
