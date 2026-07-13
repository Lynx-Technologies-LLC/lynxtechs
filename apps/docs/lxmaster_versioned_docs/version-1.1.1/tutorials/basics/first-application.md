---
sidebar_position: 1
title: Your first application
---

# Your first application

**Goal:** understand the LXMASTER mental model, then build and run a program that
brings an EtherCAT bus up to full operation and shuts it back down — without
commanding any motion yet.

## The mental model

An LXMASTER application only ever deals with three things:

1. **An ENI file** — an XML document that describes your bus: which devices are
   present, how their process data is laid out, and how fast the cycle runs. You
   generate it once with the CLI ([`scan`](../../cli/scan) +
   [`eni gen`](../../cli/eni)); your program just points at it.
2. **`EcNetwork`** — the object that owns the EtherCAT master, the real-time
   thread, and every device. You configure it, `start()` it, and `stop()` it.
3. **Facades** — typed handles (`Axis`, `IoModule`, …) that `EcNetwork` hands you
   for each device once the bus is up. You will meet these in the
   [next tutorial](./facades).

That is the whole picture: *the ENI describes the bus, `EcNetwork` brings it up,
and you talk to the result through facades.* Everything else — PDOs, sync
managers, the CoE state machine — is handled for you.

## Where your application runs

`start()` spawns a dedicated **real-time cyclic thread** that drives the bus one
frame per cycle. Your `main()` and its control loop run on a *separate*
application thread. When you deploy on a real-time host (via
[`lxmaster run`](../../cli/run)), the whole process runs under real-time
scheduling inside the `lxmaster-rt.slice`: the cyclic thread runs at the highest
real-time priority (`SCHED_FIFO`) so it never misses a cycle, and **your
application loop runs beneath it at a lower priority**.

That split comes with one rule you must respect from day one:

:::warning Never starve the real-time thread
Even though your loop is lower priority, it shares the machine with the cyclic
thread. A loop that busy-waits or hogs the CPU steals the headroom the RT thread
and the rest of the system need, which shows up as jitter — or missed cycles — on
the bus. Keep your loop lean:

- **Pace it.** Sleep for the cycle period between updates
  (`std::this_thread::sleep_for(std::chrono::nanoseconds(net.cycleTimeNs()))`)
  instead of spinning.
- **Keep the hot path light.** Avoid blocking I/O, heavy allocation, or long
  computations inside the loop.
- **Push expensive work off the loop.** Do logging, file writes, and networking
  on another thread or between control phases.
:::

You will see this pacing pattern in every example from here on.

## EtherCAT background: what "bringing up the bus" means

EtherCAT devices do not jump straight to exchanging live data. Each slave walks
through a small **state machine** on the way up:

| State | Meaning |
| --- | --- |
| **INIT** | Just powered / reset. No communication except basic mailbox setup. |
| **PRE-OP** | Mailbox (CoE) communication works; used to configure the device. No cyclic process data yet. |
| **SAFE-OP** | Cyclic data is being read (inputs), but outputs are not yet applied. |
| **OP** | Full cyclic operation — inputs and outputs exchanged every cycle. |

LXMASTER drives this walk for you. The important thing to know now is that
bring-up is **two-phase**:

- `prepare()` takes the bus to **PRE-OP** and creates the device handles. At this
  point you can inspect the discovered devices and set per-device intent (like a
  drive's operating mode) *before* it is committed to the hardware.
- `start()` finishes the job: it configures each device, walks the bus to **OP**,
  and spawns the real-time cyclic thread.

If you do not need the PRE-OP window, calling `start()` directly runs `prepare()`
for you. For more depth see [Device States](../../ethercat-basics/state-machine).

## The minimal program

```cpp
#include <iostream>

#include <lxmaster/lxmaster.hpp>

int main() {
  // 1. Configure: defaults() reads the interface name from the environment
  //    (published by `lxmaster host setup`). The ENI is the only thing you must
  //    supply.
  lxmaster::NetworkConfig cfg = lxmaster::NetworkConfig::defaults();
  cfg.eni.eni_path = "/home/user/myenifolder/myenifile.xml";

  // 2. Construct the network facade around that config.
  lxmaster::EcNetwork net(cfg);

  // 3. Bring the bus all the way up. start() runs prepare() first if needed,
  //    so this single call takes you from INIT to OPERATIONAL.
  if (!net.start()) {
    std::cerr << "start failed: " << net.lastError() << "\n";
    return 1;
  }

  std::cout << "Bus is OPERATIONAL. Cycle time: "
            << net.cycleTimeNs() << " ns\n";
  std::cout << "Discovered " << net.axes().size() << " axis/axes and "
            << net.ioModules().size() << " I/O module(s).\n";

  // 4. Shut the bus down cleanly: walks OP -> SAFE-OP -> PRE-OP -> INIT and
  //    closes the NIC.
  net.stop();
  return 0;
}
```

### What each step does

| Step | Call | Effect |
| --- | --- | --- |
| Configure | `NetworkConfig::defaults()` | Reads the RT interface, RT scheduling, and DC-sync tuning from the host environment. |
| Point at the bus | `cfg.eni.eni_path = ...` | The only required field. The cycle time and sync mode come from this file. |
| Bring up | `net.start()` | Loads + validates the ENI, verifies it against the live hardware, walks every slave to OP, and starts the RT thread. |
| Report | `net.lastError()` | Human-readable reason whenever a call returns `false`. Always check it. |
| Shut down | `net.stop()` | Ordered walk-down and NIC close. Safe to call more than once. |

:::note ENI is the single source of truth
You never set the cycle time in code — `cycleTimeNs()` is *read back* from the
ENI after `start()`. If you need a different cycle time, regenerate the ENI with
`lxmaster eni gen --cycle-ns ...`.
:::

## Build it

Create a `CMakeLists.txt` next to `main.cpp`:

```cmake
cmake_minimum_required(VERSION 3.16)
project(first_app CXX)

find_package(lxmaster CONFIG REQUIRED)

add_executable(first_app main.cpp)
target_link_libraries(first_app PRIVATE lxmaster::lxmaster)
```

Then configure and build:

```bash
cmake -S . -B build
cmake --build build
```

## Run it

Bringing up a real-time bus needs the network capabilities configured by the
host setup. The simplest way to run with the right scheduling and isolation is
through the CLI wrapper:

```bash
lxmaster run ./build/first_app
```

See the [run tutorial](../../cli/run) for what that wrapper does. On success you
will see the cycle time and device counts printed, followed by a clean shutdown.

### If `start()` fails

`lastError()` tells you why. The most common first-run causes:

| Message mentions | Likely cause |
| --- | --- |
| ENI file / cannot read | `eni_path` is wrong or the file is missing. |
| identity mismatch / verify | The ENI does not match the hardware actually on the bus — re-scan and regenerate. |
| interface / NIC | `lxmaster host setup` has not been run, or the wrong interface is selected. |
| permission / capability | The program was launched without the RT privileges — use `lxmaster run`. |

For a systematic way to diagnose these, see the next tutorial,
[Errors, logging, and debugging](./errors-and-logging).

## Recap

- An LXMASTER program is: configure → `start()` → use → `stop()`.
- The **ENI** describes the bus and owns the cycle time; your code just points at
  it.
- Bring-up is two-phase (`prepare()` → `start()`); `start()` alone is enough when
  you do not need the PRE-OP window.
- Always check the `bool` return and print `lastError()` on failure.

## Next

Before you command anything, learn how the library reports trouble — so a failed
bring-up is a message you can read, not a mystery:
[Errors, logging, and debugging](./errors-and-logging).
