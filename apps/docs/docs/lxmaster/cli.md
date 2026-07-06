---
sidebar_position: 3
title: CLI Reference
---

# LXMASTER CLI Reference

The `lxmaster` command-line tool is the single front-end for all host setup,
diagnostics, and workload launching. Most commands need root access to the
network stack and real-time scheduler:

```bash
sudo lxmaster <command> [subcommand] [options]
```

---

## `host` — Real-time host preparation

Sets up the Linux host for deterministic EtherCAT operation. Run `host setup`
once per machine; it is resumable across reboots.

### `host setup`

```bash
sudo lxmaster host setup
```

Guided, resumable, profile-driven setup. Picks a real-time profile, edits the
kernel command line, applies RT scheduling limits and IRQ affinity, and runs the
qualification benchmark. Re-run after any reboot it requests; it detects where
it left off and continues.

**Profiles**

| Profile | Kernel | Isolation | DC-sync |
| --- | --- | --- | --- |
| `demo` | current | none (RT limits + env only) | only if benchmark passes |
| `lowlatency` | lowlatency kernel + cmdline isolation | IRQ pinning + per-boot unit | only if benchmark passes |
| `realtime` | PREEMPT_RT + cmdline isolation | full slices + `lxmaster-rt.slice` | always allowed |

**Flags**

| Flag | Effect |
| --- | --- |
| `--requalify` | Re-run only the timing benchmark + DC-sync gate |
| `--status` | Show current profile / stage / RT identity |
| `--stage <bootstrap\|tune\|postboot>` | Run a single phase (advanced) |
| `--postboot-uninstall` | Remove only the per-boot tuning unit |
| `--verbose` | Per-step detail |

**Non-interactive / CI**

```bash
sudo LXMASTER_SETUP_PROFILE=lowlatency \
     LXMASTER_BOOTSTRAP_KERNEL_MODE=lowlatency \
     LXMASTER_BOOTSTRAP_RT_CPU=3 \
     LXMASTER_BOOTSTRAP_DO_INSTALL=yes \
     lxmaster host setup
```

### `host verify`

```bash
sudo lxmaster host verify [iface]
```

Read-only check that the running host matches the chosen profile. Exits non-zero
on mismatch.

### `host revert`

```bash
sudo lxmaster host revert
```

Undo everything `host setup` did — restores kernel cmdline backup, removes RT
limits and IRQ affinity snapshots, removes the `lxmaster-rt.slice` unit, and
unmasks `irqbalance`. Reboot afterwards.

### `host status`

```bash
lxmaster host status
```

Print profile, setup stage, RT identity (`LXMASTER_RT_CPU`,
`LXMASTER_RT_IFACE`, etc.) and DC-sync gate result. Does not require root.

---

## `run` — Launch a workload on the RT core

```bash
sudo lxmaster run [options] <name|path> [-- args...]
```

Runs an example (by name) or your own binary (by path) inside `lxmaster-rt.slice`
on the isolated RT CPU. Sources `/etc/profile.d/lxmaster-config.sh` and forwards
every `LXMASTER_*` variable into the slice so the library picks them up correctly.

**Options**

| Flag | Description |
| --- | --- |
| `--list` | List discoverable example binaries |
| `--pty` | Allocate a pseudo-TTY (for interactive programs) |
| `--wait` | Block until the workload exits (default) |
| `--background` | Launch and return immediately |
| `--no-slice` | Run directly without `systemd-run` (dev/testing) |
| `--cpu <N>` | Override RT CPU (default from `LXMASTER_RT_CPU`) |
| `--prio <N>` | Override SCHED_FIFO priority |
| `--no-env` | Do not forward `LXMASTER_*` variables |

**Examples**

```bash
sudo lxmaster run --list
sudo lxmaster run --pty test_servo --eni network.eni.xml
sudo lxmaster run --pty servo_sin_demo
sudo lxmaster run /path/to/my_app --eni network.eni.xml
```

---

## `diag` — Diagnostics and benchmarking

### `diag jitter`

```bash
sudo lxmaster diag jitter [options]
```

Runs `cyclictest` on the isolated RT CPU and reports wake-latency statistics
(min / avg / max). Useful for verifying that `host setup` achieved the expected
latency floor.

```bash
sudo lxmaster diag jitter
sudo lxmaster diag jitter --histogram 50
```

**Targets**

| Kernel | Expected `max` |
| --- | --- |
| PREEMPT_RT | < 30 µs |
| lowlatency | < 100 µs |
| generic | informational |

### `diag stress`

```bash
lxmaster diag stress [--duration <time>] [--vm <N>] [--cpu <N>]
```

Saturates all CPUs **except** `LXMASTER_RT_CPU` using `stress-ng`. Run this in a
second terminal while `diag jitter` or a demo runs on the RT core; jitter should
stay flat if CPU isolation is working. Does not require root. Requires
`stress-ng`.

```bash
# Terminal 1:
sudo lxmaster diag jitter

# Terminal 2:
lxmaster diag stress --duration 120s
```

### `diag dc-sync`

```bash
sudo lxmaster diag dc-sync [options]
```

Automated DC-sync debugging pipeline:

1. `host verify`
2. `test_servo` with sync tracing enabled
3. Analysis of the sync trace (correlation of jitter vs DC error)
4. `network_probe` timing characterizer
5. Optional `cyclictest` when `DC_SYNC_RUN_CYCLICTEST=1`

Prints **DISCOVERED PROBLEMS** and recommendations. Exits 1 if any problem is
flagged.

**Key environment variables**

| Variable | Default | Effect |
| --- | --- | --- |
| `IFACE` | `LXMASTER_RT_IFACE` | EtherCAT interface |
| `CYCLE_NS` | from ENI | Cyclic period in ns |
| `SYNC_WINDOW_NS` | drive-specific | DC-sync violation threshold |
| `SINE_CYCLES` | 5 | Sine cycles to run during servo trace |

### `diag probe`

```bash
sudo lxmaster diag probe [--cycle-ns <N>]
```

Runs `network_probe` in SAFE\_OP to characterize EtherCAT frame round-trip timing
without going OPERATIONAL. Useful for measuring raw bus latency.

```bash
sudo lxmaster diag probe --cycle-ns 1000000
```

---

## `scan` — Discover bus slaves

```bash
sudo lxmaster scan
```

Scans the live EtherCAT segment and prints all discovered slaves (vendor ID,
product code, name). Does not write an ENI. Requires `LXMASTER_RT_IFACE` (set by
`host setup`).

---

## `eni` — ENI generation and verification

ENI (EtherCAT Network Information) files describe the bus topology and drive the
`EcNetwork` bring-up. Generate one from the live bus once, then commit it to your
project.

### `eni gen`

```bash
sudo lxmaster eni gen [options]
```

Scans the live bus, matches slaves against ESI files, and writes a
standards-compliant ETG.2100 ENI.

| Flag | Description |
| --- | --- |
| `--esi-dir <path>` | Directory containing ESI XML files for your slaves |
| `--out <file.xml>` | Output ENI path (default: `network.eni.xml`) |
| `--cycle-ns <N>` | Cyclic period in ns (default: 1 000 000 = 1 ms) |
| `--no-dc` | Generate a non-DC ENI (SM-event only) |
| `--set-sdo <idx:sub=val>` | Inject a CoE SDO write into the ENI |

```bash
sudo lxmaster eni gen \
    --esi-dir /usr/share/lxmaster/esi \
    --out network.eni.xml \
    --cycle-ns 1000000
```

### `eni verify`

```bash
sudo lxmaster eni verify --eni network.eni.xml
```

Scans the live bus and compares slave count, vendor ID, product code, and
revision against the given ENI. Prints `PASS` or `FAIL` and exits 0 or 1.
Use this in CI or at machine startup to confirm the physical bus matches the
expected topology.

---

## `license` — Node-locked licensing

LXMASTER uses a node-locked license tied to the machine fingerprint. Activation
requires network access once; all subsequent verification is offline.

### `license activate`

```bash
sudo lxmaster license activate <key>
```

Activates this machine using the provided license key. Writes the license to
`/etc/lxmaster/license.lic`.

### `license status`

```bash
lxmaster license status
```

Print the installed license (expiry, features, fingerprint hash).

### `license check`

```bash
lxmaster license check
```

Exit 0 if a valid license is installed, non-zero otherwise. Useful in startup
scripts.

### `license fingerprint`

```bash
lxmaster license fingerprint
```

Print this machine's hardware fingerprint. Send this to Lynx Technologies when
requesting a license.

---

## `version`

```bash
lxmaster version
```

Print the installed LXMASTER version.

---

## `help`

```bash
lxmaster help
lxmaster help host
lxmaster help run
lxmaster help eni verify
```

---

## Environment variables

The library and CLI read from `/etc/profile.d/lxmaster-config.sh`, written by
`host setup`. Key variables:

| Variable | Used by | Effect |
| --- | --- | --- |
| `LXMASTER_RT_IFACE` | CLI + library | EtherCAT NIC name |
| `LXMASTER_RT_CPU` | CLI + library | Isolated RT CPU index |
| `LXMASTER_RT_PRIORITY` | library | SCHED_FIFO priority (default 49) |
| `LXMASTER_EC_SYNC_TO_DC` | library | Enable DC alignment (1/0) |
| `LXMASTER_DC_SYNC_KP_DIV` | library | DC-sync PI proportional divisor |
| `LXMASTER_DC_SYNC_KI_DIV` | library | DC-sync PI integral divisor |
| `LXMASTER_DC_LOCK_WARMUP_CYCLES` | library | Cycles before OP entry gate |
| `LXMASTER_RT_ENABLE` | library | `0` disables RT scheduling entirely |

`EcNetwork::NetworkConfig::defaults()` reads all of these as its base layer;
application code can then override individual fields.

---

## Bash completion

```bash
lxmaster completion bash | sudo tee /etc/bash_completion.d/lxmaster > /dev/null
```

Open a new shell to activate tab-completion for all `lxmaster` commands,
subcommands, and flags.
