---
sidebar_position: 6
title: Diagnosing timing
---

# Diagnosing timing

Real-time EtherCAT depends on tight, predictable timing. The `diag` command
group helps you measure how well your machine holds that timing and soak-test
your CPU isolation. It has three subcommands: `jitter`, `stress`, and `probe`.

`jitter` and `probe` run on the isolated RT core at SCHED_FIFO priority inside
the `lxmaster-rt.slice` cgroup, while `stress` deliberately loads only the
non-RT cores so it never touches that core.

## Measure wake-up latency

Start by checking the wake-up latency your host achieves on the isolated CPU:

```bash
sudo lxmaster diag jitter
```

This runs `cyclictest` on your real-time CPU and summarizes the result.

**What you'll see:** a short report with the minimum, average, and maximum
wake-up latency (in µs), the priority and interval used, the sample count,
whether the kernel is `PREEMPT_RT`, and the path to a full log file:

```text
=== LXMASTER RT jitter (cyclictest) ===
  CPU              3
  Priority         49
  Interval         1000 µs
  Samples          60000
  PREEMPT_RT       1
  Log              /tmp/lxmaster-cyclictest-20260713-150501.log

  Min latency      2 µs
  Avg latency      3 µs
  Max latency      9 µs
```

Lower and tighter numbers are better; the `max` is what matters most for
real-time work. What counts as "good enough" depends on your hardware, kernel,
and cycle time, so compare runs on your own machine rather than against a fixed
target.

:::tip
Run for a fixed time instead of a sample count with `--duration` (for example
`--duration 5m`), add `--histogram 100` to see the latency distribution, or use
`--quiet` for a one-line summary.
:::

## Prove that CPU isolation holds

Good numbers on an idle machine are easy. To prove isolation works, load every
other CPU while jitter runs. In one terminal, start the jitter test:

```bash
sudo lxmaster diag jitter
```

In a second terminal, saturate all the other CPUs for two minutes:

```bash
lxmaster diag stress --duration 120s
```

**What you'll see:** if isolation is working, the jitter numbers in the first
terminal stay flat even while the rest of the machine is fully loaded.

## Find a safe cycle time

`diag probe` measures how well your host and bus can hold a given cycle, without
ever driving a device. It brings the bus up to SAFE-OP (drives stay disabled),
sweeps a range of candidate cycle times, and tells you which ones are safe.

It needs your ENI file, since that describes the devices and whether distributed
clocks are used:

```bash
sudo lxmaster diag probe --eni network.eni.xml
```

**What you'll see:** host scheduler jitter and, on a live bus, DC-phase error for
each candidate cycle, followed by a recommendation table that marks each cycle
`OK`, `RISK`, or `UNSAFE`. Use it to choose (or confirm) the cycle time you pass
to `eni gen`.

By default it tries a spread of common cycles (10 ms down to 250 µs) plus the
cycle configured in your ENI. To test specific periods, pass a comma-separated
list:

```bash
sudo lxmaster diag probe --eni network.eni.xml --cycle-ns 1000000,500000,250000
```

:::tip
Distributed-clock drives enforce a sync-error window that the ENI does not
record. If you know it from your drive's datasheet, pass it with
`--sync-tolerance-us` (for example `--sync-tolerance-us 6`) so the verdict
reflects your hardware.
:::
