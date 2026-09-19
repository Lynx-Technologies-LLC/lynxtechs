---
sidebar_position: 4
title: Generating an ENI file
---

# Generating an ENI file

An ENI (EtherCAT Network Information) file describes your bus topology and drives
network bring-up. You generate one from the live bus once, commit it to your
project, and then reuse it every time you start the network. The `eni` command
both creates and verifies these files.

## Step 1 — Gather your ESI files

Generation matches the devices on your bus against their ESI (EtherCAT Slave
Information) description files. Put the ESI XML files for your devices in a single
directory, for example `/usr/share/lxmaster/esi`.

## Step 2 — Generate the ENI

```bash
sudo lxmaster eni gen \
    --esi-dir /usr/share/lxmaster/esi \
    --out network.eni.xml
```

This scans the live bus, matches each device to its ESI, and writes a standards
-compliant ENI. If you do not pass `--cycle-ns`, `eni gen` defaults to a 1 ms
cyclic period (`1000000` ns), a common starting point. To use a different
period, set it explicitly, for example `--cycle-ns 500000` for 500 µs.

**What you'll see:** progress as each device is matched, followed by confirmation
that `network.eni.xml` was written. This file is now the description of your
network.

## Step 3 — Verify the ENI matches the bus

Whenever you want to confirm the physical bus still matches your saved ENI:

```bash
sudo lxmaster eni verify --eni network.eni.xml
```

**What you'll see:** it compares the device count, vendor ID, product code, and
revision against the ENI and prints `PASS` or `FAIL`. It exits `0` on a match and
`1` on a mismatch, which makes it handy at machine startup or in CI.

:::tip
Commit `network.eni.xml` to your project. The library reads it at bring-up, and
the cyclic period comes directly from the ENI you generated here.
:::
