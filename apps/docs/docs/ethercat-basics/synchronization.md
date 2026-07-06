---
sidebar_position: 5
title: Clocks and Synchronization
---

# Clocks and Synchronization

For many applications — a single conveyor, a simple pick-and-place — knowing that
commands arrive *fast* is enough. But for coordinated multi-axis motion, fast is not
sufficient. Every drive must act at **exactly the same instant**. If one axis receives
its position command 50 microseconds after another, the result is a mechanical
misalignment that compounds every cycle.

EtherCAT solves this with **Distributed Clocks (DC)**: a hardware synchronization
mechanism built into EtherCAT-capable devices that gives every device on the network a
shared, sub-microsecond time reference.

## The problem with frame arrival

The naive approach to synchronization is to have each device execute its control loop
the moment the master's frame arrives. This works in loose applications, but it has a
fundamental flaw: the frame does not arrive at every device at the same time.

In a daisy-chained ring, each device adds a small forwarding delay (typically a few
nanoseconds). Device 1 sees the frame slightly before Device 2, which sees it before
Device 3, and so on. In a long segment with many devices, the spread between the first
and last device receiving the frame can reach tens of microseconds — far too large for
tight coordinated motion.

Even on a single device, the exact instant the frame arrives can vary slightly cycle
to cycle due to the master's scheduling jitter. A servo drive executing its control loop
on frame arrival would see different timing on every cycle.

## Distributed Clocks

Distributed Clocks solve this by decoupling the device's action from frame arrival and
instead tying it to a **shared hardware clock**.

Each DC-capable device contains a **64-bit hardware clock** that counts in nanoseconds.
During startup, the master performs a clock synchronization procedure:

1. It reads the current time from the first DC-capable device on the segment — this device
   becomes the **reference clock**.
2. It writes that time into every other device's clock, accounting for the forwarding
   delay each device adds.
3. Each device's hardware continuously disciplines its local clock to match the reference,
   using the EtherCAT frame itself as a timing signal.

The result is that every device on the segment shares a common time base, synchronized to
within a few tens of nanoseconds of each other — even across a long chain of devices.

```
Reference device     Device 2       Device 3       Device 4
     │                  │               │               │
     ▼ clock tick        ▼ clock tick    ▼ clock tick    ▼ clock tick
  ───────────────────────────────────────────────────────────────────
         All ticks aligned to within ~20–30 ns
```

## SYNC0: the shared heartbeat

From the shared clock, each device generates a hardware pulse called **SYNC0** at the
configured cycle period. For example, on a 1 ms cycle, each device generates a SYNC0
pulse every 1 ms, and because all clocks are aligned, all devices generate their SYNC0
pulses at the same instant.

Many servo drives and I/O devices run their internal control loop **on the SYNC0 edge**,
not on frame arrival. The drive samples its sensors, runs its feedback algorithm, and
updates its actuator outputs at the moment SYNC0 fires — the same moment on every device
across the entire network.

## The master's job in a synchronized network

With devices executing their loops on SYNC0, the master must ensure that fresh output
commands are present in each device's memory *before* that device's SYNC0 fires. If a
frame arrives late — after the SYNC0 edge — the device executes its loop on stale data
from the previous cycle.

The master therefore does not just send its frame as fast as possible; it sends the frame
**in phase** with the network's SYNC0 pulses, timed to arrive early enough for every
device to have fresh data before SYNC0 fires.

Maintaining this phase relationship cycle after cycle, despite small drifts between the
master's clock and the reference device's clock, is the master's synchronization task.

```
SYNC0 pulses (all devices, aligned):
─────┬─────────┬─────────┬─────────┬──────
     │         │         │         │
     ↑         ↑         ↑         ↑     ← devices execute control loop here

Master frame arrival (must be before each SYNC0):
────┬──────────┬─────────┬─────────┬─────
    │          │         │         │
    ↑          ↑         ↑         ↑     ← frame delivers fresh commands here
```

## Two synchronization approaches

EtherCAT supports two broad approaches to synchronization, depending on the requirements
of the application:

### DC-Sync0

The master aligns its cycle to the network's SYNC0 pulses. Devices execute their control
loops on the SYNC0 edge, and the master ensures frames arrive before each pulse. This
gives the tightest timing and is required for coordinated multi-axis motion.

DC-Sync0 requires the master to run with real-time scheduling on the host operating
system — the timing demands are tight enough that non-real-time scheduling can cause
occasional late frames, which DC-capable drives may detect and flag as faults.

### SM-Event (Sync Manager event)

Devices execute their control loop on frame arrival rather than on a hardware pulse. The
master sends its frame on a fixed schedule but does not need to phase-lock to any external
reference.

SM-event is simpler and tolerates more scheduling variation in the master, but it gives
up the sub-microsecond alignment that DC-Sync0 provides. It is appropriate for
applications where each device can act independently and tight cross-axis synchronization
is not required.

Not all devices support SM-event mode; each device advertises which synchronization modes
it is capable of during configuration.

## Summary

| | DC-Sync0 | SM-Event |
| --- | --- | --- |
| Device trigger | Hardware SYNC0 pulse | Frame arrival |
| Cross-device alignment | Sub-microsecond | Frame-spread (tens of µs) |
| Master requirements | Real-time scheduling | Standard scheduling |
| Best for | Coordinated multi-axis motion | Independent axes, simpler systems |

---

You have now covered all the foundational EtherCAT concepts. To see how these ideas
apply in practice, explore the hardware module pages and the software documentation
for your specific master.
