---
sidebar_position: 1
title: Overview
---

# EtherCAT Overview

> Sample content. Replace with finalized product and protocol descriptions.

**EtherCAT** (Ethernet for Control Automation Technology) is a real-time
industrial fieldbus protocol built on standard Ethernet. It is designed for
fast, deterministic communication between a controller and distributed I/O,
drives, and sensors.

## Why EtherCAT

- **Low latency** - suitable for high-speed motion control and closed-loop
  systems.
- **Determinism** - predictable cycle times with low jitter.
- **Flexible topology** - line, tree, star, and ring layouts using standard
  cabling.
- **Cost effective** - uses standard Ethernet physical layers and cabling.

## The "processing on the fly" principle

In an EtherCAT network, a single Ethernet frame travels through every device on
the segment. Each device reads the data addressed to it and inserts its own data
*as the frame passes through*, rather than receiving and re-sending a separate
packet. This dramatically reduces overhead and is the key to EtherCAT's
performance.

```text
[ Master ] --> [ Device 1 ] --> [ Device 2 ] --> [ Device 3 ] --+
     ^                                                           |
     +-----------------------------------------------------------+
                         frame returns to master
```

## Next steps

- Learn about the different [devices](./devices.md) on an EtherCAT network.
- See how our [LXMASTER software](/lxmaster/overview) drives the network.
