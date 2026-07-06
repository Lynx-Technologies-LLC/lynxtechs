---
sidebar_position: 3
title: How Data Flows
---

# How Data Flows

EtherCAT has two completely separate kinds of communication, and understanding the
difference between them is the most important conceptual step in learning the protocol.

## The two kinds of communication

| | Cyclic — Process Data | Acyclic — Configuration |
| --- | --- | --- |
| **What** | A fixed layout of bytes exchanged on every cycle | One-off reads and writes of named device parameters |
| **When** | During normal operation, every tick of the clock | During startup and configuration; occasionally at runtime |
| **Example** | Target position, actual position, digital output states | Set a device's sync mode, read a fault code, change a parameter |
| **Protocol** | PDO (Process Data Objects) | SDO over CoE (CANopen over EtherCAT) |
| **Speed** | Microsecond-budgeted — must complete every cycle | Slower; may take milliseconds per transfer |

The intuition: **process data** is the steady heartbeat — the same handful of bytes sent
and received on every tick. **Configuration** is the occasional conversation that happens
around the edges, mostly before the device starts running.

---

## Cyclic communication: Process Data Objects (PDO)

A PDO is simply a defined block of bytes that the master and a device agree to exchange
on every cycle. For a motor drive, the outputs (master → device) typically carry the
commanded position or velocity; the inputs (device → master) carry the actual measured
position and status.

The layout of a PDO — which bytes mean what — is agreed upon during the configuration
phase before the network starts running. Once operation begins, the same layout repeats
every single cycle without renegotiation.

### Sync Managers

Inside each device, a piece of hardware called a **Sync Manager** acts as a gate
controlling when bytes cross the internal bus between the EtherCAT interface and the
device's processor. By convention:

- **SM2** carries **outputs** — bytes written by the master and read by the device.
- **SM3** carries **inputs** — bytes written by the device and read by the master.

The master programs the Sync Manager sizes during startup to match the agreed PDO layout.
If the sizes do not match what the device expects, the device will refuse to start.

### The IOmap

The master maintains a single contiguous memory buffer — called the **IOmap** — that holds
the PDO bytes of every device on the network. When the master builds its process-data
frame, it reads from and writes to this one buffer. Each device on the wire touches only
its own slice; on return, every slice has been updated in a single round trip.

### The fixed cycle

Every cycle, the master follows the same four steps:

```
1. Write outputs  →  place the desired output values into the IOmap
2. Send frame     →  transmit the process-data frame onto the wire
3. Receive frame  →  wait for the frame to return after circling all devices
4. Read inputs    →  extract the fresh input values from the IOmap
```

The time between step 2 and step 3 is the network round-trip time. On a well-configured
segment this is typically in the range of a few to a few tens of microseconds,
regardless of how many devices are on the ring.

### The Working Counter (WKC)

Every device that successfully participates in a logical read/write operation increments
a counter embedded in the frame called the **Working Counter (WKC)**. The master knows
in advance how many increments to expect for a fully healthy network.

When the frame returns, the master compares the actual WKC to the expected value:

- **WKC matches** — all devices exchanged data correctly; inputs are fresh and valid.
- **WKC is low** — one or more devices did not participate. The input data for those
  devices may be stale or zeroed. The master should not act on data it cannot trust.

A persistently low WKC typically signals a cable problem, a device that has gone offline,
or a synchronization fault that caused a device to drop out of the cycle.

---

## Acyclic communication: CoE and SDO

Before a device can exchange process data, it must be told *what* to exchange and *how*
to behave. This configuration happens through a separate channel called the **mailbox**.

### CoE (CANopen over EtherCAT)

CoE is the most common mailbox protocol in EtherCAT. It gives the master access to a
device's **object dictionary** — a table of named parameters, each addressed by a 16-bit
**index** and an 8-bit **subindex** (written as `index:subindex`).

The object dictionary might contain entries such as:

- The device's rated current or maximum velocity
- The PDO mapping — which objects should appear in the process data
- The synchronization mode — how the device should time its control loop
- Fault codes — what went wrong the last time an error occurred

### SDO (Service Data Object)

An **SDO** transfer is a single read or write of one entry in the object dictionary. The
master sends a request identifying the index and subindex it wants to read or write, and
the device responds with the value or an acknowledgement.

SDOs are slow by EtherCAT standards — a single transfer may take hundreds of microseconds
to a few milliseconds. They are intentionally kept out of the time-critical cycle loop
and used only during configuration or for occasional diagnostic reads.

### When each is used

```
Before running:
  Master ──SDO──► Device   (configure PDO layout, sync mode, parameters)

While running:
  Master ──PDO──► Device   (send outputs every cycle)
  Device ──PDO──► Master   (send inputs every cycle)

Occasionally:
  Master ──SDO──► Device   (read a fault register, update a parameter)
```

The strict separation between configuration (SDO) and operation (PDO) is fundamental to
EtherCAT's determinism. Configuration traffic must not intrude on the cyclic data stream.

---

## Next steps

With the data flow model clear, the next topic is [Device States](./state-machine.md) —
the startup sequence that a device must complete before process data can flow.
