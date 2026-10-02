---
sidebar_position: 4
title: Multiple devices on one bus
---

# Multiple devices on one bus

**Goal:** coordinate several facades — a drive and an I/O module — in a single
control loop, and understand how one EtherCAT cycle serves the whole bus at once.

Everything so far has focused on one device. Real machines mix device types on one
bus: servos, I/O terminals, encoders. The good news is that nothing new is
required — you already have all the facades. This tutorial shows how they fit
together.

## EtherCAT background: one frame serves every device

EtherCAT does not poll devices one at a time. Each cycle, a single frame passes
through *every* slave on the segment: each device reads the outputs addressed to it
and writes its inputs into the same frame as it flows by. One cycle → one frame →
all devices updated together.

The practical consequence for your code: when you set a servo position **and** a
digital output in the same loop iteration, LXMASTER packs both into the next
frame, and both take effect on the same cycle. There is no per-device transaction
to manage — you just update the facades you care about and the RT thread does the
rest. See [How Data Flows](../../ethercat-basics/data-communication.md) for the frame
mechanics.

## Configuring a mixed bus

Bring-up is the same two-phase flow; you just configure each device type in the
PRE-OP window before `start()`:

```cpp
lxmaster::EcNetwork net(cfg);
if (!net.prepare()) { std::cerr << net.lastError() << "\n"; return 1; }

// Configure every axis...
for (lxmaster::Axis* ax : net.axes()) {
  ax->setDriveMode(lxmaster::DriveOpMode::Csp);
  ax->configure();
}
lxmaster::Axis* drive = net.axes().front();

// ...and pick + configure an I/O module.
lxmaster::IoModule* io = nullptr;
for (lxmaster::IoModule* m : net.ioModules()) {
  if (m->digitalOutputCount() >= 16) { io = m; break; }
}
if (!io) { std::cerr << "No suitable I/O module.\n"; return 1; }
io->configure();

if (!net.start()) { std::cerr << net.lastError() << "\n"; return 1; }
```

Only devices you `configure()` are walked to OPERATIONAL. This is how you opt each
participant in — a servo needs a mode plus `configure()`; an I/O module just needs
`configure()`.

## One loop, many devices

With the bus running, drive all your facades from the same loop. This is the heart
of the [Sine Shift Demo](../../examples/sine-shift-demo), which runs a sine
position on the servo while walking an output bit across the I/O module:

```cpp
const int32_t home   = drive->actualPosition();
const auto    period = std::chrono::nanoseconds(net.cycleTimeNs());
const auto    start  = std::chrono::steady_clock::now();
int active_bit = -1;

while (net.isRunning() && !g_interrupted) {
  const auto   now     = std::chrono::steady_clock::now();
  const double elapsed = std::chrono::duration<double>(now - start).count();

  // --- I/O: advance one bit per second ---
  const int bit = int(elapsed / 1.0);
  if (bit >= 16) break;
  if (bit != active_bit) {
    active_bit = bit;
    for (int ch = 0; ch < 16; ++ch) io->writeDigital(ch, false);
    io->writeDigital(bit, true);
  }

  // --- Motion: sine position around home ---
  drive->moveTo(home + int32_t(0.5 * kAmplitude * (std::cos(kTwoPi * elapsed) - 1.0)));

  std::this_thread::sleep_for(period);
}
```

Both updates happen in the same iteration; lxmaster applies them together on the
next EtherCAT frame. You do not synchronise the devices yourself — the cycle does
it.

## Pacing the loop

Pace the loop at the cycle period (`net.cycleTimeNs()`) when you want to feed the
servo a fresh setpoint every cycle, as above. Devices that do not need
cycle-rate updates (like slow I/O) can be updated less often within the same
loop — note how the bit only changes once per second even though the loop runs at
the cycle rate. Facades hold their last value, so under-updating a device simply
holds its output steady.

## Keeping devices independent

Each facade is independent — a fault on one does not silently corrupt another. A
robust mixed-device loop checks the health of each participant:

```cpp
if (drive->isFaulted()) {
  std::cerr << "Drive faulted; stopping.\n";
  break;
}
```

When you leave the loop, put **every** device in a safe state before `stop()`:

```cpp
for (int ch = 0; ch < 16; ++ch) io->writeDigital(ch, false);  // outputs off
drive->moveTo(home);                                          // servo home
net.stop();
```

## Scaling up

The same pattern extends to any count and mix of devices — iterate `net.axes()`
to command a gantry of drives, keep a handful of `IoModule` pointers, read an
`Encoder`. Because the facades are just pointers into storage the network owns,
holding several of them costs nothing and they all ride the same cycle.

## Recap

- A mixed bus needs no new API — configure each device type in PRE-OP, then drive
  all facades from one loop.
- One EtherCAT frame per cycle updates every device together; you never manage
  per-device transactions.
- Pace the loop at the cycle time for cycle-rate devices; slower devices can be
  updated less often in the same loop.
- Check each device's health and put every device in a safe state before
  `stop()`.

## Next

You have covered the everyday application surface. The Advanced section goes under
the hood — starting with [Real-time behavior and timing](../advanced/realtime-tuning).
