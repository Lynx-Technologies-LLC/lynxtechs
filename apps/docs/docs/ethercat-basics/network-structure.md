---
sidebar_position: 2
title: Network Structure
---

# Network Structure

An EtherCAT network is made up of exactly one **master** and one or more **devices**
(also called *slaves*). Understanding the role of each, and how they are connected, is
the foundation for everything else in EtherCAT.

## The master

The master is the sole controller of the network. There is always exactly one. It:

- **Owns the wire** — only the master initiates communication. Devices never transmit on
  their own initiative.
- **Drives the cycle** — the master sends a new process-data frame on every tick of a
  fixed clock, commonly every 1 ms or every 250 µs.
- **Manages startup** — the master discovers every device on the network, configures each
  one, and walks the whole network through a startup sequence before data exchange begins.
- **Detects faults** — the master monitors whether each device participated correctly in
  every cycle and can raise an alarm when something goes wrong.

The master is typically a standard PC or embedded Linux board with a dedicated Ethernet
port, running master software that handles all of the above.

## Devices (slaves)

Devices are the nodes attached to the network: motor drives, digital and analog I/O
modules, encoders, sensors, cameras, and so on. A device:

- **Processes the frame on the fly** — as the master's frame passes through it, the device
  reads the bytes addressed to it and writes its own data back into the frame, all in
  hardware, without interrupting the flow.
- **Never initiates** — devices are fully passive. They only respond to what the master sends.
- **Reports an identity** — each device stores a **vendor ID** and a **product code** in
  its configuration memory. The master reads these during startup to identify what kind of
  device it is dealing with.

## The logical ring

Although the physical cabling may look like a simple line of daisy-chained devices,
EtherCAT treats the segment as a **logical ring**. The frame leaves the master, passes
through every device in sequence, and the last device sends it back along the return path
to the master.

```
Master ──► Device 1 ──► Device 2 ──► Device 3 ──┐
  ▲                                               │
  └────────────── frame returns ─────────────────┘
```

This ring property means:

- The frame's round-trip time is proportional to the number of devices, but each device
  only adds nanoseconds of forwarding delay — the total remains in the low-microsecond range.
- The master always knows exactly how long the round trip takes for the current segment,
  which it uses to verify that all devices responded.

## Device addressing

Devices are identified by their **position** in the ring — the first device encountered
after the master is position 1, the second is position 2, and so on. This positional
address is assigned automatically during startup; you do not configure it manually.

Alongside the positional address, each device also carries a **vendor ID** and
**product code** stored in its configuration EEPROM. The master uses these two values
to match devices on the wire to the software drivers registered for them.

## Topology options

EtherCAT is flexible about how devices are physically wired. Three layouts are common:

### Line

The simplest topology. Each device has an IN port and an OUT port; you connect them one
after another in a chain.

```
Master ── Device 1 ── Device 2 ── Device 3 ── Device 4
```

Most EtherCAT deployments use a line. It is easy to wire, easy to trace, and requires no
additional hardware.

### Tree / Star

A branch is created by inserting a **junction device** (sometimes called a coupler or
switch) at any point in the line. Downstream devices connect to the branch port of the
junction.

```
Master ── Device 1 ── Junction ── Device 2 ── Device 3
                          │
                       Device 4 ── Device 5
```

Tree topologies are useful when devices are spread across physically separate parts of a
machine and routing a single long chain would be inconvenient.

### Ring (redundancy)

The OUT port of the last device is connected back to a second Ethernet port on the master,
closing a physical ring. If a cable breaks, the master can detect the break and switch to
the remaining path, keeping the network running.

```
               ┌─── Device 1 ── Device 2 ── Device 3 ───┐
Master port A ─┤                                         ├─ Master port B
               └─────────────────────────────────────────┘
```

Ring topology requires master software that supports redundancy and a second NIC on the
master, but adds fault tolerance for critical installations.

## Next steps

With the network structure in mind, the next topic is [How Data Flows](./data-communication.md)
— the two kinds of communication that happen over this network and when each is used.
