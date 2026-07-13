---
sidebar_position: 3
title: Getting Started
---

# Getting Started

This guide shows how to install LXMASTER and build a minimal C++ application
against the public API.

:::note
Package names and commands reflect the standard Debian/Ubuntu install from the
Lynx apt repository. Adjust the interface name and ENI file to match your setup.
:::

## Prerequisites

- A Linux machine (a `PREEMPT_RT` kernel is recommended for real-time use).
- A dedicated network interface (NIC) wired to your EtherCAT network.
- A C++17 toolchain and CMake >= 3.18.

## Installation

Add the Lynx apt repository, then install:

```bash
curl -fsSL https://apt.lynxtechs.com/lxmaster.gpg | sudo tee /usr/share/keyrings/lxmaster.gpg >/dev/null
echo "deb [signed-by=/usr/share/keyrings/lxmaster.gpg] https://apt.lynxtechs.com stable main" \
  | sudo tee /etc/apt/sources.list.d/lxmaster.list
sudo apt update
sudo apt install lxmaster
```

This installs the shared library (`liblxmaster.so`), the public headers, the
`lxmaster` CLI, and the CMake package config.

## Host setup

Before running any application, configure the Linux host for real-time
EtherCAT operation. This is a one-time step per machine:

```bash
sudo lxmaster host setup
```

The interactive wizard picks a real-time profile, configures CPU isolation,
applies IRQ affinity, and runs a timing benchmark to qualify the machine for
DC-sync. Re-run after any reboot it requests until setup completes. Settings
are written to `/etc/profile.d/lxmaster-config.sh` and picked up automatically
by the library at runtime.

See the [CLI Reference — `host setup`](./cli.md#host-setup) for all flags,
profiles, and non-interactive options.

## Hello, EtherCAT (C++)

The entire library is consumed through a single umbrella header and the
`lxmaster` namespace:

```cpp
#include <lxmaster/lxmaster.hpp>

#include <iostream>

int main() {
  // Build a configuration and bring the network up on your NIC.
  lxmaster::NetworkConfig cfg = lxmaster::NetworkConfig::defaults();

  lxmaster::EcNetwork net(cfg);
  net.start();

  std::cout << "EtherCAT network is running\n";

  // ... drive Axis / IoModule / Encoder handles in your cyclic loop ...

  net.stop();
  return 0;
}
```

## Building with CMake

LXMASTER ships a CMake package, so consumers link against a single imported
target:

```cmake
cmake_minimum_required(VERSION 3.18)
project(lxmaster_hello CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(lxmaster CONFIG REQUIRED)

add_executable(hello main.cpp)
target_link_libraries(hello PRIVATE lxmaster::lxmaster)
```

Build and run:

```bash
cmake -S . -B build
cmake --build build
sudo ./build/hello   # raw Ethernet access typically needs root
```

## Running a bundled example

LXMASTER installs runnable examples that the CLI can launch directly:

```bash
sudo lxmaster run test_servo --eni network.eni.xml
```

## Next steps

- Read the [Overview](./overview.md) for the architecture.
- See the [C++ API Reference](./api) for every public type and method.
- See the [CLI Reference](./cli.md) for host setup, diagnostics, and workload launching.
- Explore the [Example Projects](./examples) and the [API Reference](./api).
