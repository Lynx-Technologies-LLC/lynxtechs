---
sidebar_position: 3
title: Scanning the bus
---

# Scanning the bus

Once your devices are wired up and powered on, `scan` lets you confirm that the
master can see them. It is the quickest way to check your cabling and find out
exactly which devices are on the segment.

## Step 1 — Make sure the host is set up

`scan` uses the EtherCAT interface configured during host setup
(`LXMASTER_RT_IFACE`). If you have not done that yet, follow
[Preparing your host](./host.md) first.

## Step 2 — Scan the segment

```bash
sudo lxmaster scan
```

**What you'll see:** a summary of the discovered topology, then one block per
device (in the order they are wired) showing its identity, sync managers,
mailbox protocols, process-data size, and DC support. For example:

```text
Scanning 'eth0' ...
Discovered 3 slave(s).
Process image: outputs=6 B, inputs=12 B, logical base=0x0 (indicative; ENI sizes from ESI)

[1] EK1100
    PhysAddr=0x1001 VendorId=0x2 ProductCode=0x44c2c52 RevisionNo=0x110000
    SM:
    mailbox: out@0x0/0 in@0x0/0
    process data: outputs=0 B, inputs=0 B (from SM category)
    DC: no; CoE PDOs: rx=0 tx=0

[2] EL7031
    PhysAddr=0x1002 VendorId=0x2 ProductCode=0x1b773052 RevisionNo=0x1a0000
    SM: [0 start=0x1000 len=246 type=1] [1 start=0x1100 len=246 type=2] [2 start=0x1200 len=6 type=3] [3 start=0x1280 len=6 type=4]
    mailbox: out@0x1000/246 in@0x1100/246 CoE
    process data: outputs=6 B, inputs=6 B (from CoE)
    DC: yes; CoE PDOs: rx=1 tx=1
```

### Reading the output

#### Segment summary

The first few lines describe the whole bus:

| Field | Meaning |
| --- | --- |
| `Discovered N slave(s)` | How many devices answered, in wiring order. |
| `Process image` | Total cyclic data across the bus — `outputs` are bytes the master sends to devices, `inputs` are bytes it reads back, and `logical base` is where that data starts in the address space. Indicative only; final sizes come from the ESI files at ENI generation. |

#### Per-device blocks

Each `[N] name` block then describes one device:

| Field | Meaning |
| --- | --- |
| `[N] name` | The device's position on the bus (1-based, in wiring order) and its name. |
| `PhysAddr`, `VendorId`, `ProductCode`, `RevisionNo` | The device's address and identity. These identity values are what `eni verify` later checks the physical bus against. |
| `SM` | The device's sync managers (the hardware channels that move data), each shown as `[index start=<addr> len=<bytes> type=<T>]`. Simple devices may list none. See the `type` values below. |
| `mailbox` | The mailbox windows (`out@<addr>/<size>`, `in@<addr>/<size>`) and the mailbox protocols the device supports, such as `CoE` (CANopen over EtherCAT), `FoE` (file access), or `EoE` (Ethernet tunneling). |
| `process data` | The cyclic `outputs` and `inputs` size for this device, and where the figure came from: `CoE` (read from the device's live PDO assignment) or `SM category` (derived from sync-manager sizes when the device has no CoE). |
| `DC` | Whether the device supports distributed clocks (`yes`/`no`), plus the number of receive/transmit PDOs (`rx`/`tx`) found in its CoE configuration. |

The `type` in each `SM` entry tells you what that sync manager carries:

| Type | Carries |
| --- | --- |
| `1` | Mailbox out (master to device) |
| `2` | Mailbox in (device to master) |
| `3` | Process-data outputs |
| `4` | Process-data inputs |

The exact numbers depend on your hardware. If the device count is lower than
expected or the scan reports it is incomplete, check power and cabling and scan
again.

:::note
`scan` only reads the bus — it does not write an ENI file or change anything on
the devices. When the list looks right, move on to
[Generating an ENI file](./eni.md).
:::
