---
sidebar_position: 2
title: Preparing your host
---

# Preparing your host

Before you run any EtherCAT workload, the Linux machine needs to be tuned for
deterministic, real-time operation. The `host` command does this for you. You
run it once per machine, and it is resumable across the reboots it asks for.

## Run the guided setup

```bash
sudo lxmaster host setup
```

This starts an interactive wizard that picks a real-time profile, adjusts the
kernel command line, applies real-time scheduling limits and IRQ affinity, and
finishes with a timing benchmark.

**What you'll see:** a series of prompts, each with a short explanation of what
it does and why. First you pick the profile that matches your goal:

| Profile | Best for |
| --- | --- |
| `demo` | Trying things out on your current kernel, no isolation |
| `lowlatency` | Good timing on a low-latency kernel |
| `realtime` | Best timing on a `PREEMPT_RT` kernel |

After the profile, setup asks for the real-time details it needs (RT CPU core,
EtherCAT interface, `SCHED_FIFO` priority, NIC handoff, and isolation), each
prompt self-explaining and pre-filled with your saved value. It also offers an
**optional checklist** of extra optimizations that are **off by default** — each
trades power, security, or throughput for lower jitter, so enable only the ones
that fit your host. Setup prints one line per optimization as it works, and a
run interrupted by a reboot picks up where it left off.

:::warning Install the real-time kernel yourself
The `lowlatency` and `realtime` profiles assume the matching kernel is **already
installed and booted** — lxmaster does **not** install a kernel for you. Use your
distribution's package manager first, for example:

- **Low-latency kernel** (for the `lowlatency` profile):
  `sudo apt install linux-lowlatency` (Ubuntu).
- **`PREEMPT_RT` kernel** (for the `realtime` profile):
  `sudo pro enable realtime-kernel` (Ubuntu Pro), or
  `sudo apt install linux-image-rt-amd64` (Debian).

Reboot into the new kernel, then run `sudo lxmaster host setup`. For the
`realtime` profile, setup checks the running kernel and warns (but continues) if
it is not `PREEMPT_RT`.
:::

## What each profile applies

The table below lists the optimizations each profile turns on by default. `demo`
stays on your current kernel and only sets up the essentials; `lowlatency` and
`realtime` add kernel isolation, NIC tuning, and per-boot re-tuning.

| Optimization | `demo` | `lowlatency` | `realtime` |
| --- | :---: | :---: | :---: |
| RT scheduling limits (memlock unlimited, rtprio 99) | ✓ | ✓ | ✓ |
| Host RT identity file (`/etc/profile.d/lxmaster-config.sh`) | ✓ | ✓ | ✓ |
| Timing benchmark + DC-sync gate | ✓ ¹ | ✓ ¹ | ✓ ² |
| Kernel cmdline isolation (`isolcpus`/`nohz_full`/`rcu_nocbs` + latency tokens) | — | ✓ | ✓ |
| `vm.swappiness = 10` (sysctl) | — | ✓ | ✓ |
| `kernel.sched_rt_runtime_us = -1` (sysctl) | — | — | ✓ |
| EtherCAT NIC set unmanaged in NetworkManager | — | ✓ | ✓ |
| NIC tuning (coalescing/offloads off, rings maxed, EEE/WoL off) | — | ✓ | ✓ |
| NIC hardware IRQs pinned to the RT CPU | — | ✓ | ✓ |
| `performance` governor + shallow cpuidle on the RT CPU | — | ✓ | ✓ |
| Per-boot re-tuning service (re-pins IRQs / NIC / cpufreq each boot) | — | ✓ | ✓ |
| Max OS isolation (systemd `AllowedCPUs` slices, `irqbalance` masked) | — | prompt (off) | ✓ |

¹ DC-sync is enabled once the benchmark has run; jitter is advisory only.
² `realtime` enables DC-sync regardless of whether the benchmark has run.

The values above are the profile defaults; the setup prompts (or `--enable`
for automated runs) let you override them and opt into the optional extras.

## Reboot when asked, then re-run

Setup may ask you to reboot (for example, to load a new kernel). After the
reboot, run the same command again:

```bash
sudo lxmaster host setup
```

**What you'll see:** it detects where it left off and continues from that stage.
Repeat until it reports that setup is complete.

## Confirm the result

Check the current state at any time (no root needed):

```bash
lxmaster host status
```

**What you'll see:** the chosen profile followed by a per-optimization table —
each rule marked verified, skipped, pending, or failed. The timing benchmark row
shows its result (scheduler p99 jitter and whether the DC-sync gate was allowed).

To confirm the running machine still matches the profile, use:

```bash
sudo lxmaster host verify
```

**What you'll see:** the same per-optimization table, re-checked live against the
running system, and a non-zero exit if any applied optimization has drifted.

:::tip Re-running the timing benchmark
The timing benchmark runs once and its result is remembered. To force it to run
again (for example after changing hardware or freeing up the machine):

```bash
sudo lxmaster host setup --requalify
```

If the benchmark binary wasn't available on an earlier run, a normal
`sudo lxmaster host setup` will re-attempt it automatically.
:::

## Automating setup (no prompts)

For provisioning scripts or CI, you can run setup without any interaction by
supplying the answers up front. Set the profile and the required details as
environment variables, and every prompt is skipped:

```bash
sudo env \
  LXMASTER_SETUP_PROFILE=lowlatency \
  LXMASTER_SETUP_CPU=3 \
  LXMASTER_SETUP_IFACE=eno1 \
  LXMASTER_SETUP_RT_PRIO=49 \
  LXMASTER_SETUP_NM_UNMANAGED=y \
  LXMASTER_SETUP_MAX_ISOLATION=y \
  lxmaster host setup
```

To turn on optional checklist optimizations non-interactively, pass `--enable`
with a comma-separated list of rule IDs (repeatable), or `--enable-all-optional`
to turn on every one:

```bash
# just a couple
sudo lxmaster host setup --enable mem.swapoff,mem.thp_never

# everything the checklist offers
sudo lxmaster host setup --enable-all-optional
```

The rule IDs are the ones shown in the left column of `lxmaster host status`
(for example `mem.swapoff`, `cmdline.nosmt`, `nic.rps_xps`, `cpu.fixed_freq`).

:::note
A profile that changes the kernel command line still needs its reboot. In an
automated flow, run setup, reboot, then run the same command again — it resumes
from where it left off.
:::

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
