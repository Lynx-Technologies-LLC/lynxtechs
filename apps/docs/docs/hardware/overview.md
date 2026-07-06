---
sidebar_position: 1
title: Overview
---

# EtherCAT PCB Modules

The Lynx EtherCAT hardware modules are compact, solderable system-on-modules (SoMs)
that add a ready-to-use EtherCAT device interface to your product. You bring the
application electronics; the module handles the EtherCAT communication.

## Module family

| Model | I/O | Description |
| --- | --- | --- |
| [LXDIO33-16](./lxdio33-16/overview.md) | 16-channel digital I/O | 3.3 V EtherCAT digital I/O PCB module |
| [LXFIBER](./lxfiber/overview.md) | Fiber media | EtherCAT fiber-optic media module |
| [LXRJ45](./lxrj45/overview.md) | RJ45 ports | EtherCAT RJ45 interface module |

Select a module in the sidebar for its full documentation.

## What's on the module

- EtherCAT Slave Controller (ESC) and dual PHYs.
- Two RJ45/M8-ready ports (IN and OUT) for daisy-chaining.
- Configuration EEPROM holding the ESI (device description).
- A host interface (SPI or parallel) for your application MCU.

## Integration at a glance

1. Place the module on your carrier PCB.
2. Provide power and route the two Ethernet ports to your connectors.
3. Connect the host interface to your application processor.
4. Load and verify the device description (ESI) for your configuration.

Refer to each module's datasheet for the full electrical and mechanical specifications.
