---
sidebar_position: 1
title: Overview
---

# LXMASTER

**LXMASTER** is a Linux EtherCAT master stack: a shared library (`liblxmaster.so`),
a command-line tool, and real-time host tooling that turn a standard Linux machine
into a fully featured EtherCAT master. It manages the network, exchanges cyclic
process data in hard real time, and presents your control application with a
small, safe C++ API instead of raw fieldbus plumbing.

## Highlights

- **Single public entry point** - consume the whole library through one umbrella
  header and namespace: `#include <lxmaster/lxmaster.hpp>` and `lxmaster::`.
- **Modern C++ API** - configure the network with `NetworkConfig` and drive it
  with `EcNetwork`; work with `Axis`, `IoModule`, and `Encoder` handles.
- **Deterministic cyclic exchange** - run your control loop at a fixed cycle time;
  pairs well with a `PREEMPT_RT` kernel and CPU isolation.
- **Device profiles** - built-in CiA 402 (drives) and CiA 401 (I/O) support, plus
  an extension API for custom device profiles.
- **Packaged for Debian/Ubuntu** - installed from the Lynx apt repository as a
  versioned `.deb`.

## Architecture

```text
+---------------------------+
|   Your control app (C++)  |
+-------------+-------------+
              |  #include <lxmaster/lxmaster.hpp>
+-------------v-------------+
|   liblxmaster.so          |
+-------------+-------------+
              |  raw Ethernet
+-------------v-------------+
|   NIC  -->  EtherCAT bus  |
+---------------------------+
```

Application code uses `lxmaster::EcNetwork` and the device classes; the EtherCAT
backend sits behind an internal, backend-neutral facade and is never part of the
public API.

## Where to next

- Follow **[Getting Started](./getting-started.md)** to install LXMASTER and build
  a minimal C++ application.
- Browse the **[Example Projects](./examples)** and the **[API Reference](./api)**.
- Track changes in the **[Release Notes](./release-notes)**.
