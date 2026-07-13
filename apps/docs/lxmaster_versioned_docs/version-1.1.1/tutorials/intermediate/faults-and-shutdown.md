---
sidebar_position: 3
title: Faults and safe shutdown
---

# Faults and safe shutdown

**Goal:** detect a drive fault from your application, decide how to respond, and
shut the bus down cleanly on Ctrl-C or at the end of a run.

This tutorial is about **device-level faults** — a drive that trips (overcurrent,
following error, over-temperature). A whole slave dropping off the bus (a pulled
cable) is a **bus fault**, covered later in
[Detecting and handling bus faults](../advanced/bus-faults).

## EtherCAT background: the CiA402 fault state

A CiA402 drive runs an internal power state machine (DS402). Its condensed shape
is: *Switch-On Disabled → Ready → Switched On → Operation Enabled*, with a
**Fault** state reachable from anywhere. The drive reports its state in the
**statusword** (`0x6041`); LXMASTER decodes the two bits you care about for you:

| Facade query | Statusword meaning |
| --- | --- |
| `isEnabled()` | Reached *Operation Enabled* — powered and holding. |
| `isFaulted()` | Latched in *Fault* (statusword bit 3). Motion is inhibited until cleared. |

A fault **latches**: the drive stays faulted until it receives an explicit fault
reset, even if the underlying condition has cleared. That is a safety feature — it
forces the application to acknowledge the fault.

## Watching for a fault

Poll `isFaulted()` in your control loop and react:

```cpp
while (net.isRunning() && !g_interrupted) {
  if (drive->isFaulted()) {
    std::cerr << "Drive faulted, statusword=0x"
              << std::hex << drive->statusword() << std::dec << "\n";
    break;  // leave the loop and shut down (see below)
  }
  drive->moveTo(target);
  std::this_thread::sleep_for(period);
}
```

`statusword()` gives you the raw `0x6041` value when you need manufacturer-specific
bits beyond enabled/faulted for logging or diagnostics.

## Clearing a fault

If the fault is recoverable and you want to continue, clear it with a one-shot
reset, then re-enable:

```cpp
if (drive->isFaulted()) {
  drive->resetFault();                                   // one-shot acknowledge
  std::this_thread::sleep_for(std::chrono::milliseconds(100));
  if (!drive->isFaulted()) {
    drive->enable();                                     // power back up
    drive->moveTo(drive->actualPosition());              // resume holding here
  }
}
```

`resetFault()` is a single request, not a repeated poll — call it once and give the
drive a few cycles to act before checking `isFaulted()` again.

### Automatic fault handling

You can also ask the profile to handle faults for you when you configure the axis,
rather than doing it by hand:

- **Startup fault auto-reset** (on by default): a residual fault present at OP
  entry — before the drive has ever enabled this run — is cleared automatically
  within a bounded window instead of latching a stop. This is why a drive that was
  left faulted from a previous run usually just comes up.
- **Auto fault-reset-and-recover** (off by default): mid-run faults are
  automatically reset and the drive re-enabled. Leave this **off** for anything
  that can move unexpectedly — an automatic re-enable after a following-error is
  rarely what you want on a real machine.

Mid-run faults are terminal by default precisely so your application stays in
control of recovery.

## Safe shutdown

`net.stop()` is a graceful, ordered shutdown — not a hard kill. After it joins the
real-time thread it walks the bus back down:

```
OPERATIONAL  ->  (disable outputs, settle)  ->  SAFE-OP  ->  PRE-OP  ->  INIT  ->  close NIC
```

Because of that walk-down, the pattern for a clean exit is: **put devices in a
safe state, then stop.**

```cpp
drive->moveTo(home);       // command a safe resting setpoint
drive->disable();          // power down to a de-energised rest
net.stop();                // ordered walk-down + NIC close
```

`stop()` is safe to call more than once and is a no-op if the bus is already down,
so it is fine to call it on every exit path.

## Handling Ctrl-C

A real-time process should not be killed with an un-handled signal — that skips
the walk-down and leaves drives energised. Trap the signal, flip a flag, and let
your loop exit normally:

```cpp
static std::atomic<bool> g_interrupted{false};

int main() {
  signal(SIGINT,  [](int){ g_interrupted = true; });
  signal(SIGTERM, [](int){ g_interrupted = true; });
  // ...
  while (net.isRunning() && !g_interrupted) {
    // control...
  }
  // falls through to the safe-shutdown block above
}
```

Guarding the loop with `net.isRunning()` **and** `!g_interrupted` means the loop
also exits on its own if the library stops the bus underneath you (for example
after a bus fault).

## Post-run diagnostics

After `stop()`, ask the network to print each device's exit status. It reports
from a snapshot taken while the master was still open, so you see what the bus
actually looked like at shutdown — including a drive's final statusword and CiA402
fault code (`0x603F`):

```cpp
net.stop();
net.reportDeviceStatus(std::cout);
```

This is the first thing to check when a run ends unexpectedly. For the full set of
error- and log-viewing tools — including the runtime log and how to filter it —
see [Errors, logging, and debugging](../basics/errors-and-logging).

## Recap

- A CiA402 fault **latches**; watch it with `isFaulted()` and read `statusword()`
  for detail.
- Clear a recoverable fault with a one-shot `resetFault()`, then `enable()` and
  resume.
- Leave mid-run auto-recovery **off** unless you are certain it is safe.
- Exit by commanding a safe state, then `net.stop()` (an ordered walk-down);
  trap Ctrl-C so you always reach it.
- Use `reportDeviceStatus()` after `stop()` to see how the run ended.

## Next

So far you have controlled one device at a time. Next you will run several facades
together in one loop: [Multiple devices on one bus](./multiple-devices).
