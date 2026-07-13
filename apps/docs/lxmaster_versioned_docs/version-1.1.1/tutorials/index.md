---
sidebar_position: 1
title: C++ Application Tutorials
---

# C++ Application Tutorials

This series teaches you how to write real-time EtherCAT applications with the
LXMASTER C++ library. It is built around two ideas that, once they click, make
the rest of the API obvious:

- **Facades** — the typed handles (`Axis`, `IoModule`, `Encoder`,
  `GenericDevice`) your application uses to command and read devices, without
  ever touching PDOs, CoE objects, or the EtherCAT state machine.
- **Device profiles** — the components *behind* each facade that know how a
  particular device works: its process-data layout and its state machine. The
  library picks a profile for every slave on the bus and hands you the matching
  facade.

Instead of walking through every demo, each tutorial introduces **one concept**,
illustrates it with a small piece of code (often drawn from a matching
[example project](../examples/)), and builds on the tutorials before it. The
series ends by teaching you how to write your own device profile so LXMASTER can
drive hardware it has never seen before.

## Who this is for

You are comfortable with modern C++ and want to control EtherCAT drives, I/O, or
custom devices from a Linux host. No prior EtherCAT experience is required —
every page that needs it includes a short **EtherCAT background** section and
links to the [EtherCAT Basics](../ethercat-basics/what-is-ethercat.md) reference for
more depth.

## Before you start

You will need:

1. **LXMASTER installed** on your machine (`find_package(lxmaster CONFIG REQUIRED)`
   must resolve). See [Getting Started](../getting-started).
2. **A configured host** — run `lxmaster host setup` once so the EtherCAT
   interface name is published to the environment. See the
   [host tutorial](../cli/host).
3. **An ENI file** describing your bus. Generate one with
   [`lxmaster scan`](../cli/scan) + [`lxmaster eni gen`](../cli/eni).

Every example in this series uses the same skeleton to build against the
installed package:

```cmake
cmake_minimum_required(VERSION 3.16)
project(my_app CXX)

find_package(lxmaster CONFIG REQUIRED)

add_executable(my_app main.cpp)
target_link_libraries(my_app PRIVATE lxmaster::lxmaster)
```

```cpp
#include <lxmaster/lxmaster.hpp>
```

That single header exposes the whole application API through the flat
`lxmaster::` namespace — you never include internal headers for a normal control
application.

## Learning path

### Basics

1. [Your first application](./basics/first-application) — the network lifecycle,
   building, and running your first bring-up.
2. [Errors, logging, and debugging](./basics/errors-and-logging) — how to see what
   the library is doing and diagnose failures.
3. [Facades: talking to devices](./basics/facades) — the core concept: typed
   handles for the devices on your bus.
4. [Device profiles: how a device becomes a facade](./basics/device-profiles) —
   the core concept behind the handles, and how the library chooses one per
   slave.

### Intermediate

5. [Motion operating modes](./intermediate/operating-modes) — CSP / CSV / CST and
   switching between them at runtime.
6. [Working with I/O](./intermediate/digital-io) — reading and writing digital and
   analog channels through `IoModule`.
7. [Faults and safe shutdown](./intermediate/faults-and-shutdown) — detecting drive
   faults and shutting the bus down cleanly.
8. [Multiple devices on one bus](./intermediate/multiple-devices) — coordinating
   several facades in a single control loop.

### Advanced

9. [Real-time behavior and timing](./advanced/realtime-tuning) — RT scheduling,
   synchronization, and the built-in timing diagnostics.
10. [Detecting and handling bus faults](./advanced/bus-faults) — reacting to a cable
    pull or a slave dropping off the bus.
11. [Extending a built-in profile](./advanced/extending-profiles) — customize an
    existing drive profile while keeping the `Axis` API.
12. [Writing your own device profile](./advanced/custom-device-profile) — support
    any EtherCAT device, even one LXMASTER has never seen.
