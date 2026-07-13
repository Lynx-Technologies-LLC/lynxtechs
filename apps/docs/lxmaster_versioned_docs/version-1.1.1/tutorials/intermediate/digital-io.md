---
sidebar_position: 2
title: Working with I/O
---

# Working with I/O

**Goal:** read and write digital and analog channels through the `IoModule`
facade — the second most common device type on an EtherCAT bus.

I/O terminals sit alongside your drives: limit switches, e-stop contacts,
solenoids, indicator lamps, analog sensors and setpoints. LXMASTER surfaces any
CiA401-style I/O terminal as an `IoModule` facade, the same way it surfaces a
servo as an `Axis`.

## EtherCAT background: I/O in the process image

An I/O terminal's channels are just more **process data**. A digital input block
maps into a TxPDO (device → master); a digital output block maps into an RxPDO
(master → device). Analog channels work the same way with wider values.

The `IoModule` facade addresses channels by a **0-based index in process-image
order** — you do not compute byte offsets or bit masks. Under the hood a
`writeDigital(3, true)` sets the correct bit in the output PDO, which reaches the
terminal on the next EtherCAT frame (see
[How Data Flows](../../ethercat-basics/data-communication.md)).

## Discovering an I/O module

Ask the network for its I/O modules, and query each one's channel counts to pick
the one you want:

```cpp
lxmaster::IoModule* mod = nullptr;
for (lxmaster::IoModule* m : net.ioModules()) {
  if (m->digitalOutputCount() >= 16) { mod = m; break; }
}
if (!mod) { std::cerr << "No suitable I/O module.\n"; return 1; }
mod->configure();   // opt it into the OPERATIONAL bring-up
```

Just like an axis, an I/O module you never `configure()` is held at PRE-OP.

The count accessors also double as safe bounds — each is the exclusive upper limit
for the matching accessor:

| Query | Returns | Bounds for |
| --- | --- | --- |
| `digitalInputCount()` | # digital inputs | `readDigital(ch)` |
| `digitalOutputCount()` | # digital outputs | `writeDigital(ch, v)` / `digitalOutputState(ch)` |
| `analogInputCount()` | # analog inputs | `readAnalog(ch)` |
| `analogOutputCount()` | # analog outputs | `writeAnalog(ch, v)` / `analogOutputState(ch)` |

Out-of-range channel indices are handled gracefully: reads return `false` / `0`
and writes are silently ignored.

## Reading and writing channels

All accessors are RT-safe to call from the application thread while the bus runs:

```cpp
// Digital
bool estop = mod->readDigital(0);          // read input channel 0
mod->writeDigital(3, true);                // assert output channel 3
bool lamp  = mod->digitalOutputState(3);   // read back what we last commanded

// Analog (raw process-image counts)
int32_t level = mod->readAnalog(0);        // read analog input 0
mod->writeAnalog(1, 2048);                 // command analog output 1
```

Note the difference between `readDigital()` (an actual **input** from the field)
and `digitalOutputState()` (the last value you **wrote** to an output). Analog
mirrors this with `readAnalog()` vs `analogOutputState()`.

:::note Analog values are raw counts
`readAnalog()` / `writeAnalog()` deal in the terminal's raw process-image units.
Converting counts to volts, milliamps, or engineering units depends on the
specific terminal's scaling — consult its datasheet.
:::

## Worked example: walking an output bit

The [DO Shift Demo](../../examples/do-shift-demo) walks a single active bit across
16 digital outputs, one per second. It is the smallest complete `IoModule`
program.

### 1. Clear to a known state after start

```cpp
if (!net.start()) { std::cerr << net.lastError() << "\n"; return 1; }
for (int ch = 0; ch < 16; ++ch) mod->writeDigital(ch, false);
```

### 2. Advance the active bit over time

```cpp
const auto start = std::chrono::steady_clock::now();
int active_bit = -1;

while (net.isRunning() && !g_interrupted) {
  const auto now = std::chrono::steady_clock::now();
  const int bit  = int(std::chrono::duration<double>(now - start).count() / 1.0);
  if (bit >= 16) break;

  if (bit != active_bit) {           // only touch outputs when the bit changes
    active_bit = bit;
    for (int ch = 0; ch < 16; ++ch) mod->writeDigital(ch, false);
    mod->writeDigital(bit, true);
  }
  std::this_thread::sleep_for(std::chrono::milliseconds(50));
}
```

Two things worth noticing:

- The loop polls at **50 ms**, far slower than the EtherCAT cycle. That is fine —
  I/O does not need to be updated every cycle; the facade simply holds the last
  commanded output until you change it. The RT thread keeps exchanging PDOs
  regardless.
- Outputs are only rewritten when the active bit changes, keeping the loop cheap.

### 3. Clear on the way out

```cpp
for (int ch = 0; ch < 16; ++ch) mod->writeDigital(ch, false);
net.stop();
```

Always drive outputs to a safe state before `stop()` — after shutdown the terminal
holds whatever it last received until the bus comes back.

## Recap

- CiA401-style I/O terminals appear as `IoModule` facades from
  `net.ioModules()`.
- Channels are addressed by **0-based index**; the `*Count()` accessors give you
  safe bounds.
- `readDigital()` reads a field input; `digitalOutputState()` reads back a
  commanded output. Analog mirrors this.
- I/O can be updated at your own pace — the RT thread handles the cyclic exchange.

## Next

Real machines fault. Next: how to detect drive faults and bring the bus down
safely in [Faults and safe shutdown](./faults-and-shutdown).
