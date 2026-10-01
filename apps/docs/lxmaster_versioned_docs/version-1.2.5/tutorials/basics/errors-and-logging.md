---
sidebar_position: 2
title: "Errors, logging, and debugging"
---

# Errors, logging, and debugging

**Goal:** learn the three ways LXMASTER tells you what is happening — return
values, device status reports, and the runtime log — so that when a bring-up
fails or a device misbehaves, you can see exactly why.

You met `lastError()` in your [first application](./first-application). This page
turns that into a habit and adds the two other layers of visibility you will lean
on constantly.

## The three layers of visibility

| Layer | Answers | How you get it |
| --- | --- | --- |
| **Return value + `lastError()`** | "Did this call succeed, and if not, why?" | Check the `bool`, print `net.lastError()`. |
| **Device status report** | "What state did each device end in?" | `net.reportDeviceStatus(os)` after `stop()`. |
| **Runtime log** | "What happened, step by step, during the run?" | Enable `cfg.debug`. |

Start with the first, add the second when a run ends badly, and turn on the third
when you need the blow-by-blow.

## EtherCAT background: where errors come from

Most failures you will see originate in the EtherCAT bring-up itself, and they
carry standard diagnostic codes:

- **AL status codes** — when a slave refuses a state transition (say PRE-OP →
  SAFE-OP), it reports an *Application Layer status code* explaining why (bad SM
  config, invalid mailbox, etc.). LXMASTER surfaces these in `lastError()` and the
  device status report.
- **CoE abort / error objects** — a failed SDO configuration during PRE-OP comes
  back as a CoE abort code.
- **CiA402 fault code `0x603F`** — a faulted drive stores a manufacturer fault
  code here; the device status report prints it.

You do not need to memorize these — the point is that the error strings you print
are not generic, they pinpoint the slave and the reason.

## Layer 1: return values and `lastError()`

Every operation that can fail returns a `bool`. The rule is simple: **check it,
and print `lastError()` when it is false.**

```cpp
lxmaster::EcNetwork net(cfg);

if (!net.prepare()) {
  std::cerr << "prepare failed: " << net.lastError() << "\n";
  return 1;
}
if (!net.start()) {
  std::cerr << "start failed: " << net.lastError() << "\n";
  return 1;
}
```

Key properties of `lastError()`:

- It is **thread-safe** — safe to read from any thread.
- It holds the **last** captured message, so read it immediately after the failing
  call.
- During shutdown it also accumulates `[shutdown]` step failures, so a `stop()`
  that could not cleanly walk the bus down still leaves an explanation behind.

## Layer 2: the device status report

`reportDeviceStatus()` prints a per-device end-of-run summary. Because it reports
from a snapshot taken while the master was still open, you see what the bus
actually looked like at shutdown — not a zeroed-out table:

```cpp
net.stop();
net.reportDeviceStatus(std::cout);
```

It surfaces each device's final EtherCAT state and AL status code, a faulted
drive's CiA402 fault code (`0x603F`), and — if the run ended on a bus fault — the
break location and the slaves that went silent. **This is the first thing to check
when a run ends unexpectedly.** (Bus faults get their own treatment in
[Detecting and handling bus faults](../advanced/bus-faults).)

## Layer 3: the runtime log

For a step-by-step trace of bring-up and operation, enable logging on the config.
It is **off by default** to keep the runtime quiet.

```cpp
lxmaster::NetworkConfig cfg = lxmaster::NetworkConfig::defaults();
cfg.eni.eni_path = "/path/to/bus.eni.xml";

cfg.debug.enabled   = true;                       // master switch
cfg.debug.min_level = ecdev::LogLevel::Info;      // Error < Warn < Info < Debug < Trace
```

With `log_file` left empty, output goes to the console (`Error`/`Warn` to
`stderr`, everything else to `stdout`). Point it at a path to get a rotating log
file instead — ideal for an unattended deployment:

```cpp
cfg.debug.log_file = "/var/log/myapp/lxmaster.log";  // rotating FileSink
```

### Focusing the log by category

The log is split into subsystems; `category_mask` selects which ones you want.
Narrow it to avoid drowning in output:

```cpp
// Only bring-up and cyclic/watchdog messages:
cfg.debug.category_mask =
    static_cast<std::uint32_t>(ecdev::LogCat::Bringup) |
    static_cast<std::uint32_t>(ecdev::LogCat::Cyclic);
```

| Category (`ecdev::LogCat`) | Covers |
| --- | --- |
| `Bringup` | `prepare()`/`start()` phase walk, INIT/PRE-OP, shutdown milestones |
| `State` | ESM transitions, AL status |
| `Pdo` | mapping layout, per-cycle PDO dumps |
| `Cyclic` | OP entry, working counter, watchdog, jitter |
| `DcSync` | DC phase lock, sync stats |
| `Coe` | SDO probes, CoE error objects |
| `Rt` | RT scheduling identity |

The default (`ecdev::kLogCatAll`) passes every category.

| Level (`ecdev::LogLevel`) | Use when |
| --- | --- |
| `Error` | Something failed. Always compiled in. |
| `Warn` | Recoverable oddity. Always compiled in. |
| `Info` | High-level progress. |
| `Debug` | Detailed step tracing. |
| `Trace` | Everything, including per-cycle detail. |

:::warning Verbose levels need a debug build
`Error` and `Warn` are always compiled in, but `Info`, `Debug`, and `Trace` are
**stripped from the binary** unless LXMASTER was built with
`LXMASTER_ENABLE_DEBUG`. If you set `min_level = Trace` and see nothing extra,
you are almost certainly running a release build — that is expected.
:::

:::note Logging stays off the real-time path
The cyclic RT thread never writes to the log directly; it hands snapshots to a
background worker. So enabling logging does not add jitter to the bus — but see
the note in the [next tutorial](./facades#everything-a-facade-does-is-rt-safe)
about keeping your *own* loop lean.
:::

## Timing and host-level diagnostics

Two kinds of debugging live in their own tutorials because they are deeper topics:

- **Timing quality of your running app** — jitter, DC-sync alignment, per-cycle
  tracing — is measured with the APIs in
  [Real-time behavior and timing](../advanced/realtime-tuning).
- **Qualifying the host machine itself** — scheduling latency, behavior under
  load — is done with the CLI: [`lxmaster diag`](../../cli/diagnostics).

## A bring-up failure checklist

When `prepare()` or `start()` returns `false`, work through this:

1. **Read `lastError()`** — it usually names the slave and the reason outright.
2. **Enable `cfg.debug` at `Info`** (or `Debug` on a debug build) with the
   `Bringup` and `State` categories to watch the phase walk.
3. **Call `reportDeviceStatus()`** even on a failed start to see how far each
   device got and its AL status code.
4. **Compare the ENI to the hardware** — an identity-mismatch error means the ENI
   does not match the bus; re-scan and regenerate.

## Recap

- Always check the `bool` return and print `lastError()` — it is thread-safe and
  pinpoints the failure.
- Call `reportDeviceStatus()` after `stop()` to see each device's exit state, AL
  status, and fault codes.
- Turn on `cfg.debug` for a step-by-step log; filter with `min_level` and
  `category_mask`, and send it to a rotating file for deployments.
- `Info`/`Debug`/`Trace` require a debug build; `Error`/`Warn` are always present.

## Next

Now that you can see what the library is doing, let's talk to devices:
[Facades: talking to devices](./facades).
