---
sidebar_position: 1
title: Real-time behavior and timing
---

# Real-time behavior and timing

**Goal:** understand how the LXMASTER cyclic thread is scheduled, how the bus
stays time-synchronized, and how to measure timing quality from inside your
application using the built-in diagnostics.

Up to now you have trusted `start()` to "make it real-time." This tutorial opens
that box: what the real-time thread is, the knobs that govern it, and the
statistics the library collects so you can prove your machine holds timing.

## EtherCAT background: why timing is everything

Real-time EtherCAT is built on two forms of timing:

- **Host cycle timing (jitter).** The master runs a cyclic thread that must wake
  up at a fixed period (the ENI's cycle time) and send a frame. If the OS wakes it
  late, the frame is late. **Jitter** is the signed error between when the thread
  *should* have woken and when it *actually* did.
- **Distributed Clocks (DC).** Every DC-capable slave has a local clock. The bus
  designates one slave's clock as the reference and disciplines all the others to
  it, then fires a **SYNC0** pulse at the top of each cycle so all devices act on
  data at the same instant. The master must also align its cyclic wake to that DC
  reference — the residual error is the **DC-sync alignment error**.

Good motion needs both small: low jitter so frames leave on time, and tight DC
alignment so distributed drives act in lockstep. See
[Clocks and Synchronization](../../ethercat-basics/synchronization) for the full
picture.

## The real-time thread and its knobs

`start()` applies real-time scheduling to the cyclic thread before it brings the
bus up. The settings live in `cfg.rt`:

| Field | Default | Meaning |
| --- | --- | --- |
| `enable_rt_scheduling` | `true` | Put the cyclic thread on `SCHED_FIFO`. Set `false` on stock kernels / dev machines. |
| `rt_priority` | `49` | `SCHED_FIFO` priority (1–99). 49 sits above IRQ threads but below the watchdog. |
| `cpu_affinity` | `-1` | Pin the thread to this core (0-based). `-1` = no affinity. Pin to an **isolated** core for best jitter. |

You normally do **not** set these in code. `NetworkConfig::defaults()` reads them
from the per-host environment published by `lxmaster host setup` (via
`LXMASTER_RT_ENABLE`, `LXMASTER_RT_PRIORITY`, `LXMASTER_RT_CPU`, …), so the host
profile is the single place RT identity is configured. Overriding in code is for
special cases:

```cpp
lxmaster::NetworkConfig cfg = lxmaster::NetworkConfig::defaults();
cfg.rt.enable_rt_scheduling = false;   // e.g. a laptop with no RT kernel
```

:::info The kernel still matters
Configuration only asks for real-time scheduling; the *quality* you get depends on
the kernel. A `PREEMPT_RT` kernel with an isolated core gives the tightest jitter.
See the [host tutorial](../../cli/host) for setting up an RT host, and the
[diagnostics tutorial](../../cli/diagnostics) for measuring the host itself.
:::

## Sync mode is decided by the ENI

You do not choose DC vs free-run — the ENI does. If the bus carries a SYNC0-capable
device, LXMASTER runs in **`DcSync0`** mode (cyclic wake disciplined to the DC
reference); otherwise it falls back to **`SmEvent`** (sync-manager event) mode.
Read it back after bring-up:

```cpp
switch (net.syncMode()) {
  case lxmaster::SyncMode::DcSync0: std::cout << "DC-synchronized\n"; break;
  case lxmaster::SyncMode::SmEvent: std::cout << "SM-event (no DC)\n"; break;
}
```

DC tuning parameters (PI gains, the OP-entry alignment gate) also come from the
host environment and are inert in `SmEvent` mode.

## Measuring jitter

After a run, `jitterStats()` summarizes the host cycle timing (all values in
nanoseconds):

```cpp
net.stop();
const auto j = net.jitterStats();
std::cout << "jitter  min=" << j.min_ns << " max=" << j.max_ns
          << " mean=" << j.mean_ns << " mean|abs|=" << j.mean_abs_ns
          << " over " << j.samples << " cycles\n";
```

| Field | What it tells you |
| --- | --- |
| `min_ns` / `max_ns` | Worst early / late wake. The spread is your timing envelope. |
| `mean_ns` | Systematic offset — should sit near zero. |
| `mean_abs_ns` | Average timing error magnitude regardless of sign. |
| `samples` | Cycles included. |

`jitterStats()` is also live during the run, so you can print a rolling summary.

## Measuring DC-sync alignment

In `DcSync0` mode, `dcSyncStats()` reports how tightly the master's wake tracks the
DC reference — the error *before* the PI controller corrects it:

```cpp
const auto dc = net.dcSyncStats();
if (dc.samples > 0) {   // 0 in SmEvent mode
  std::cout << "dc-sync mean=" << dc.mean_ns << " max|abs|=" << dc.mean_abs_ns
            << " converged offset=" << dc.final_integral << " ns\n";
}
```

`final_integral` is the steady-state offset the PI loop converged to — useful for
spotting a systematic host↔bus clock skew. `samples == 0` means you were not in a
DC-aligned mode.

## Per-cycle tracing

Aggregate stats hide transients. To capture *every* cycle, enable the sync trace
ring buffer before `start()`:

```cpp
cfg.debug.sync_trace_capacity   = 16384;   // power-of-two slots; 0 = disabled
cfg.debug.sync_trace_window_ns  = 10000;   // count cycles where |dc_delta| > 10 us
```

While running, `syncTraceViolationCount()` gives a live tally of cycles that
breached the window. After `stop()`, pull the full history:

```cpp
const auto report = net.syncTraceReport();
std::cout << report.samples.size() << " cycles captured, "
          << report.violation_count << " violations, "
          << report.total_writes << " total cycles\n";

for (const auto& s : report.samples) {
  // s.rt_cycle, s.dc_delta_ns, s.jitter_err_ns, s.integral_ns, s.phase ...
}
```

Each `SyncTraceSample` carries the cycle number, the DC delta, the host jitter, the
PI integrator state, and the execution phase (`Warmup`, `DcGate`, `Cooldown`,
`Operational`, `Shutdown`). Dumping these to CSV and plotting them is the best way
to diagnose an intermittent timing glitch — you can see exactly which cycle and
phase it happened in.

:::note Tracing has a cost
The ring is lock-free and cheap, but not free. Enable it while investigating, size
it to the window you care about, and leave `sync_trace_capacity = 0` in production
unless you want a permanent flight recorder.
:::

## Application vs. host diagnostics

These in-process statistics measure *your running application*. To validate the
**host** before you deploy — raw scheduling latency, behavior under load — use the
CLI: [`lxmaster diag`](../../cli/diagnostics) runs `cyclictest`-style jitter and
stress soak tests on the isolated RT core. Use the CLI to qualify the machine; use
the APIs here to monitor the real workload.

For error strings and the step-by-step runtime log (including the `DcSync` and
`Cyclic` log categories that complement these timing stats), see
[Errors, logging, and debugging](../basics/errors-and-logging).

## Recap

- The cyclic thread runs on `SCHED_FIFO`; its priority and core come from the host
  environment (`cfg.rt`, populated by `NetworkConfig::defaults()`).
- Sync mode (`DcSync0` vs `SmEvent`) is decided by the ENI, not the app.
- `jitterStats()` measures host cycle timing; `dcSyncStats()` measures DC
  alignment (only in `DcSync0`).
- Enable `sync_trace_capacity` for per-cycle forensics via `syncTraceReport()`.
- Qualify the host with `lxmaster diag`; monitor the workload with these APIs.

## Next

Timing tells you the bus is healthy. Next: what happens — and what you do — when it
is not, in [Detecting and handling bus faults](./bus-faults).
