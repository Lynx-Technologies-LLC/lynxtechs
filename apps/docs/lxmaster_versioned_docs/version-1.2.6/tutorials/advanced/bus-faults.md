---
sidebar_position: 2
title: Detecting and handling bus faults
---

# Detecting and handling bus faults

**Goal:** react to a *bus-level* failure — a pulled cable, a slave that loses
power, corrupted frames — using the watchdog and the `on_bus_fault` callback, and
read the structured `BusFault` that pinpoints the break.

This is the counterpart to [Faults and safe shutdown](../intermediate/faults-and-shutdown):
that page handled a single drive tripping; this one handles the *communication
path itself* breaking.

## EtherCAT background: the working counter (WKC)

Every EtherCAT frame carries a **Working Counter**. As the frame passes through
each slave that the datagram addresses, that slave increments the counter. The
master knows how many increments to expect for a healthy cycle (`expected_wkc`).

If a slave stops responding — cable unplugged, device powered off — it can no
longer increment the counter, so the observed WKC drops below expected. A single
low reading can be a transient; a *sustained* low WKC means something is really
broken. That is exactly what LXMASTER's watchdog looks for.

## The cycle-health watchdog

LXMASTER counts consecutive cycles with a low work-counter. After
`watchdog_low_wkc_cycles` (default 100) in a row, it declares a **bus fault**,
stops driving the bus, and reconstructs where the break is from the slaves'
DL-status registers.

Tune the threshold for your tolerance:

```cpp
cfg.watchdog_low_wkc_cycles = 50;   // trip faster (less tolerant of dropouts)
```

Lower it for faster fault detection; raise it for buses that tolerate the odd WKC
blip without a real cable fault.

## Getting notified: `on_bus_fault`

Register a callback and LXMASTER hands you a structured `BusFault` the moment the
watchdog trips:

```cpp
lxmaster::NetworkConfig cfg = lxmaster::NetworkConfig::defaults();
cfg.eni.eni_path = "/path/to/bus.eni.xml";

cfg.on_bus_fault = [](const lxmaster::BusFault& f) {
  std::cerr << "BUS FAULT: " << f.description << "\n";
  std::cerr << "  break at slave " << f.break_slave
            << " (" << f.break_slave_name << ") port " << f.break_port << "\n";
  std::cerr << "  wkc " << f.wkc << " / expected " << f.expected_wkc << "\n";
  for (const auto& s : f.lost_slaves)
    std::cerr << "  lost slave " << s.index << " (" << s.name << ")\n";
};
```

### Delivery rules (important)

The callback runs on a **detached helper thread — not the RT cyclic thread**. That
has two consequences:

- You may do non-RT work in it (log, notify, and even call `net.stop()` directly).
- Because it runs detached, anything it captures **by reference must outlive the
  network**. Capturing a local that goes out of scope is a use-after-free.

It is invoked **exactly once** per fault. If you leave it empty, the fault is still
recorded — you can see it in `lastError()` and `reportDeviceStatus()`.

## Reading the `BusFault`

The struct pinpoints the break rather than just saying "something dropped":

| Field | Meaning |
| --- | --- |
| `occurred` | True when the struct is meaningful. |
| `break_slave` / `break_slave_name` | 1-based index and name of the still-responding slave whose downstream port lost its link — the upstream side of the break. `0` = break at the master / first link. |
| `break_port` | ESC port (0–3) on `break_slave` that dropped, or `-1` if unknown. |
| `lost_slaves` | The devices that went silent behind the break. |
| `wkc` / `expected_wkc` | The work counter on the tripping cycle vs. expected. |
| `description` | Pre-rendered human-readable summary — simple apps can just print this. |

So if you unplug the cable between slave 3 and slave 4, you would typically see
`break_slave = 3`, the port facing slave 4 in `break_port`, and slaves 4+ in
`lost_slaves`.

## Two ways to structure your response

**A. Poll from the main loop (simplest).** Because the library stops the bus on a
fault, your `net.isRunning()` guard exits on its own — then inspect after the loop:

```cpp
while (net.isRunning() && !g_interrupted) {
  drive->moveTo(target);
  std::this_thread::sleep_for(period);
}
// The loop exited: either Ctrl-C or the bus faulted underneath us.
net.stop();
net.reportDeviceStatus(std::cout);   // prints the bus fault, if any
```

**B. React immediately in the callback.** Use `on_bus_fault` when you must act the
instant the fault occurs (trip an external safety relay, flip a UI to a fault
state). Keep the handler quick and let the main loop handle the actual teardown, or
call `net.stop()` from the handler if that is your recovery model.

:::caution A bus fault means motion has already stopped commanding
When the watchdog trips, lost slaves are no longer receiving commands. Treat a bus
fault as an emergency condition: get the machine to a safe state (external
brakes/relays if the drives are unreachable) rather than assuming you can command
your way out of it.
:::

## Recovering

There is no "un-break a cable" in software. Recovery means: report the fault, bring
the system to a safe state, `net.stop()`, fix the physical problem, then construct
a fresh `EcNetwork` and bring the bus up again from scratch. Do not attempt to keep
commanding a network that has faulted.

## Recap

- A **bus fault** is a communication-path failure, detected via a sustained low
  **working counter**.
- The watchdog trips after `watchdog_low_wkc_cycles` low cycles; tune it for your
  tolerance.
- `on_bus_fault` delivers a structured `BusFault` (break location + lost slaves) on
  a non-RT thread — mind the lifetime of captures.
- Even without a callback, the fault shows up in `lastError()` /
  `reportDeviceStatus()`; recovery is a full teardown + fresh bring-up.

## Next

The final two tutorials return to the device-profile concept — this time you build
your own. First, [Extending a built-in profile](./extending-profiles).
