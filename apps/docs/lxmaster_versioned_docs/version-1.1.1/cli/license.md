---
sidebar_position: 7
title: Activating your license
---

# Activating your license

LXMASTER uses a node-locked license tied to your machine's hardware fingerprint.
Activation needs network access once; after that, every check runs offline. The
`license` command handles activation, status, transfers, and developer seats.

There are two kinds of license you are likely to use:

- **Node-locked (perpetual)** — bound to one machine. Activate once, then it
  verifies offline forever. This is the normal production license.
- **Developer (floating seat)** — a pool of seats shared across a team. Any
  machine can claim a seat when it runs a workload, and release it when done.

The steps below start with a node-locked license, then cover transferring one to
a new machine and using floating developer seats.

## Step 1 — Find your machine fingerprint

If you do not have a license key yet, send Lynx Technologies your machine's
fingerprint:

```bash
lxmaster license fingerprint
```

**What you'll see:** a hardware fingerprint string. Copy it and email it to
`license@lynxtechs.com` when requesting a license.

## Step 2 — Activate with your key

Once you have a license key, activate the machine:

```bash
sudo lxmaster license activate <key>
```

**What you'll see:** confirmation that the license was written to
`/etc/lxmaster/license.lic`. This machine is now licensed.

## Step 3 — Check the license

View the details of the installed license at any time:

```bash
lxmaster license status
```

**What you'll see:** the license expiry, enabled features, and fingerprint hash.

For scripts and startup checks, use the quiet form that just sets an exit code:

```bash
lxmaster license check
```

**What you'll see:** it exits `0` when a valid license is installed and non-zero
otherwise, so you can gate your startup on it.

## Transferring a node-locked license to another machine

A node-locked license is tied to one machine, so moving it to new hardware is a
deliberate, authorized step.

### Step 1 — Get the transfer authorized

Email `license@lynxtechs.com` with your license key and ask for a transfer. Lynx
Technologies authorizes the move on their side. Until it is authorized, the
transfer command will refuse to run.

### Step 2 — Release the license on the old machine

Once the transfer is approved, run this on the machine you are moving away from:

```bash
sudo lxmaster license transfer <key>
```

**What you'll see:** confirmation that this machine has been deactivated and its
local license removed, along with a reminder to activate on the new computer. If
the transfer has not been authorized yet, it exits with an error telling you to
email `license@lynxtechs.com` first.

### Step 3 — Activate on the new machine

On the new computer, activate exactly as you did the first time:

```bash
sudo lxmaster license activate <key>
```

**What you'll see:** confirmation that the license is now installed on the new
machine.

## Developer (floating-seat) licenses

A floating-seat license lets a team share a fixed number of seats across many
machines, instead of locking one license to one computer.

### Activate the seat license

Activate with your key, the same as any other license:

```bash
sudo lxmaster license activate <key>
```

**What you'll see:** a message that a developer (floating-seat) license was
activated, noting that a seat is claimed each time you start the program and that
sessions last up to 12 hours.

### Claim and use a seat

You do not claim a seat manually — it happens automatically when you run a
workload:

```bash
sudo lxmaster run --pty test_servo --eni network.eni.xml
```

The program claims a seat at startup. If every seat is currently in use, it
tells you to ask a teammate to release one (or to email `license@lynxtechs.com`
to add more seats).

Check whether a seat is currently held:

```bash
lxmaster license status
```

**What you'll see:** `mode: developer (floating seat)` and whether a session is
active on this machine, including when it expires.

### Release the seat when you're done

Free your seat so a teammate can use it:

```bash
sudo lxmaster license release
```

**What you'll see:** confirmation that the seat was released. Seats also free
themselves automatically after 12 hours, so a machine that goes offline will not
hold a seat forever.
