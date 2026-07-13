---
sidebar_position: 2
title: Preparing your host
---

# Preparing your host

Before you run any EtherCAT workload, the Linux machine needs to be tuned for
deterministic, real-time operation. The `host` command does this for you. You
run it once per machine, and it is resumable across the reboots it asks for.

## Step 1 — Run the guided setup

```bash
sudo lxmaster host setup
```

This starts an interactive wizard that picks a real-time profile, adjusts the
kernel command line, applies real-time scheduling limits and IRQ affinity, and
finishes with a timing benchmark.

**What you'll see:** a series of prompts guiding you through each choice. Pick
the profile that matches your goal:

| Profile | Best for |
| --- | --- |
| `demo` | Trying things out on your current kernel, no isolation |
| `lowlatency` | Good timing on a low-latency kernel |
| `realtime` | Best timing on a `PREEMPT_RT` kernel |

:::warning
The `realtime` profile requires a `PREEMPT_RT` kernel, and **you must install
that kernel yourself** — this step is not done by lxmaster. Setup prints the
exact install command for your distribution (for example
`sudo apt install linux-image-rt-amd64` on Debian, or
`sudo pro enable realtime-kernel` on Ubuntu), but you run it, reboot into the new
kernel, and then re-run `sudo lxmaster host setup` to continue. (The
`lowlatency` profile is different — setup can install the lowlatency kernel for
you via apt.)
:::

## Step 2 — Reboot when asked, then re-run

Setup may ask you to reboot (for example, to load a new kernel). After the
reboot, run the same command again:

```bash
sudo lxmaster host setup
```

**What you'll see:** it detects where it left off and continues from that stage.
Repeat until it reports that setup is complete.

## Step 3 — Confirm the result

Check the current state at any time (no root needed):

```bash
lxmaster host status
```

**What you'll see:** the chosen profile, the setup stage, your real-time
identity (such as `LXMASTER_RT_CPU` and `LXMASTER_RT_IFACE`), and whether the
DC-sync timing gate passed.

To confirm the running machine still matches the profile, use:

```bash
sudo lxmaster host verify
```

**What you'll see:** a pass message, or a non-zero exit and a list of mismatches
if something drifted.

## Undoing the setup

If you need to return the machine to its original state:

```bash
sudo lxmaster host revert
```

This restores the kernel command line, removes the real-time limits and IRQ
settings, and re-enables `irqbalance`. Reboot afterwards.

:::tip
Settings are written to `/etc/profile.d/lxmaster-config.sh` and are picked up
automatically by both the CLI and the library at runtime.
:::
