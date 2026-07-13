---
sidebar_position: 3
title: "Facades: talking to devices"
---

# Facades: talking to devices

**Goal:** understand what a *facade* is — the central concept in the LXMASTER
application API — and use one to command a real drive.

## What is a facade?

On the wire, an EtherCAT device speaks in raw process data: byte offsets, bit
masks, CoE object dictionary indices, control/status words. Talking to a drive
that way means writing a "controlword" of `0x000F` to enter operation, packing a
target position into the right offset of an output buffer, and decoding a
"statusword" bitfield to know whether it worked.

A **facade** is a small, typed handle that hides all of that. Instead of PDO
offsets you call methods that mean something:

```cpp
axis->enable();          // not: write 0x000F to the controlword PDO
axis->moveTo(50000);     // not: pack 50000 into output offset 0x11
axis->actualPosition();  // not: decode input offset 0x09 as int32
```

The facade is *thin*: it just forwards to the device's profile (the subject of
the [next tutorial](./device-profiles)). But it is what makes application code
portable — swap one CiA402 servo for another brand and your `Axis` code does not
change.

LXMASTER gives you four facade types:

| Facade | For | You get it from | Key methods |
| --- | --- | --- | --- |
| `Axis` | Motion drives (CiA402 servos) | `net.axes()` | `enable()`, `moveTo()`, `actualPosition()`, `isEnabled()` |
| `IoModule` | Digital / analog I/O terminals | `net.ioModules()` | `readDigital()`, `writeDigital()`, `readAnalog()` |
| `Encoder` | Standalone feedback devices (CiA406) | `net.encoders()` | `position()` |
| `GenericDevice` | Anything else (custom sensors, etc.) | `net.devices()` | `deviceProfile()` (escape hatch) |

## How you discover facades

You do not create facades — the network creates one per device while it brings
the bus up, and you ask for them by type:

```cpp
std::vector<lxmaster::Axis*>     axes = net.axes();
std::vector<lxmaster::IoModule*> ios  = net.ioModules();
```

Each list is in **bus order** and the storage is owned by the `EcNetwork`, so you
hold plain pointers, not smart pointers. `net.devices()` returns *every*
profile-carrying slave as a `GenericDevice*` — a device that also has a typed
facade appears in both its typed list and there.

:::note When are the lists valid?
The typed lists become populated during bring-up. After `prepare()` you can see
the axes to configure them; after `start()` all facades are live and safe to
command. Always guard against empty lists — an ENI with no drives returns an
empty `axes()`.
:::

## EtherCAT background: process data (PDOs)

Everything a facade does ultimately becomes **process data** exchanged once per
cycle.

- Data flowing **from the master to a device** (a target position, an output bit)
  travels in an **RxPDO** — the device *receives* it.
- Data flowing **from a device to the master** (an actual position, an input bit)
  travels in a **TxPDO** — the device *transmits* it.

The ENI defines exactly which objects are mapped into each PDO and where. When you
call `moveTo(counts)`, the facade writes `counts` into the object the ENI mapped
for the target position; on the next EtherCAT frame that value reaches the drive.
When you read `actualPosition()`, you get the value the drive placed in its TxPDO
on the most recent cycle. This is why reads and commands are effectively
instantaneous from your code's point of view but only take physical effect on the
next cycle. See [How Data Flows](../../ethercat-basics/data-communication) for
detail.

## Everything a facade does is RT-safe

You call facade methods from your **application thread** while the real-time
cyclic thread runs the bus underneath. That is safe by design: facades exchange
values through lock-free state, so a `moveTo()` never blocks the RT thread and a
read never tears. You do **not** need your own mutex around facade calls.

The one exception is configuration: `setDriveMode()` and `configure()` must be
called during the PRE-OP window (between `prepare()` and `start()`), not while the
bus is running.

:::warning RT-safe does not mean "free"
A facade call never blocks the cyclic thread, but the *loop you call it from* still
shares the machine with that thread — and, as covered in
[Your first application](./first-application#where-your-application-runs), your loop
runs at a lower priority than the RT thread. Pace your loop (sleep for the cycle
period) and keep it lean; a busy-wait around `actualPosition()` will burn a whole
core and can starve the very thread feeding you that data.
:::

## Worked example: driving an Axis

Let's use the `Axis` facade to move a servo. This is the essence of the
[`servo_sin_demo`](../../examples/servo-sin-demo) example project, trimmed to the
facade interactions.

### 1. Bring up to PRE-OP and grab the axis

```cpp
lxmaster::NetworkConfig cfg = lxmaster::NetworkConfig::defaults();
cfg.eni.eni_path = "/home/user/myenifolder/myenifile.xml";

lxmaster::EcNetwork net(cfg);
if (!net.prepare()) { std::cerr << net.lastError() << "\n"; return 1; }

std::vector<lxmaster::Axis*> axes = net.axes();
if (axes.empty()) { std::cerr << "No motion axes in ENI.\n"; return 1; }
lxmaster::Axis* drive = axes.front();
```

We use `prepare()` (not `start()`) because we want the PRE-OP window to configure
the axis before it goes live.

### 2. Configure the axis, then start

```cpp
for (lxmaster::Axis* ax : axes) {
  ax->setDriveMode(lxmaster::DriveOpMode::Csp);  // cyclic synchronous position
  ax->configure();                               // opt this device into OP bring-up
}

if (!net.start()) { std::cerr << net.lastError() << "\n"; return 1; }
```

`setDriveMode()` records *intent*; `configure()` opts the device into the walk to
OPERATIONAL. A device you never `configure()` is held at PRE-OP. (You will learn
what CSP and the other modes mean in
[Motion operating modes](../intermediate/operating-modes).)

### 3. Read, then command

```cpp
std::this_thread::sleep_for(std::chrono::milliseconds(50));  // let a few cycles run

const int32_t home   = drive->actualPosition();  // read where we are
const auto    period = std::chrono::nanoseconds(net.cycleTimeNs());

// Nudge 10,000 counts past home and hold.
drive->moveTo(home + 10000);
std::this_thread::sleep_for(std::chrono::milliseconds(500));
```

Reading `actualPosition()` right after `start()` needs a couple of cycles to
produce a valid encoder value, hence the short sleep. Everything here is a plain
method call — no PDO offsets in sight.

### 4. Return home and stop

```cpp
drive->moveTo(home);
std::this_thread::sleep_for(std::chrono::milliseconds(200));
net.stop();
```

For the full sinusoidal-motion version, see the
[Servo Sin Demo](../../examples/servo-sin-demo).

## The escape hatch

Facades intentionally expose only the common surface. When you need something a
device supports that the typed facade does not, every facade offers a way down to
the underlying profile:

```cpp
ecdev::IMotionProfile* mp  = axis->motionProfile();   // Axis
ecdev::IIoProfile*     iop = io->ioProfile();          // IoModule
ecdev::IDeviceProfile* dp  = dev->deviceProfile();     // any facade
```

You rarely need this in application code, but it is the bridge to the concept in
the next tutorial.

## Recap

- A **facade** is a typed handle that hides PDOs, CoE, and the state machine
  behind meaningful methods.
- There are four: `Axis`, `IoModule`, `Encoder`, and `GenericDevice`.
- You *discover* facades from `net.axes()` / `ioModules()` / `encoders()` /
  `devices()` — the network owns them.
- Facade calls are RT-safe from the application thread; only `setDriveMode()` /
  `configure()` are PRE-OP-only.

## Next

Facades are thin — the real work happens in the **device profile** behind each
one. Next you will learn what a profile is and how LXMASTER picks the right one
for every slave: [Device profiles](./device-profiles).
