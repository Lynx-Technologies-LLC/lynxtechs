---
sidebar_position: 4
title: "Device profiles: how a device becomes a facade"
---

# Device profiles: how a device becomes a facade

**Goal:** understand the second core concept — the *device profile* — so you know
what actually powers a facade, how LXMASTER chooses one for every slave, and why
that matters later when you extend or write your own.

In the [previous tutorial](./facades) you commanded a servo through an `Axis`
without touching a single PDO offset. Something had to translate `moveTo(50000)`
into the right bytes and run the drive's power-up sequence. That something is a
**device profile**.

## What a device profile is

A device profile is the component that knows how one *class* of device works:

- **Its process-data layout** — which CoE objects are mapped, and where, so the
  profile can pack outputs and unpack inputs each cycle.
- **Its state machine** — the sequence to bring the device to full operation
  (for a servo: the CiA402 power-up handshake), plus fault handling.
- **Its capability contract** — a motion device implements a *motion* interface,
  an I/O device implements an *I/O* interface, and so on.

The facade is the thin public face; the profile is the implementation behind it:

```
  your code  ->  Axis (facade)  ->  CiA402DriveProfile (device profile)  ->  PDOs on the wire
```

That last capability contract is the link back to facades. A profile that
implements the motion interface is surfaced as an `Axis`; one that implements the
I/O interface becomes an `IoModule`; one that implements neither is still
reachable as a `GenericDevice`.

| The profile implements… | …and LXMASTER surfaces it as |
| --- | --- |
| a motion interface (`IMotionProfile`) | `Axis` (also in `devices()`) |
| an I/O interface (`IIoProfile`) | `IoModule` (also in `devices()`) |
| an encoder interface | `Encoder` (also in `devices()`) |
| none of the above | `GenericDevice` only |

## EtherCAT background: CoE and the CiA device profiles

Two EtherCAT concepts explain where profiles come from.

**CoE (CANopen over EtherCAT)** is the mailbox protocol that lets the master read
and write a device's *object dictionary* — a big table of parameters addressed by
a 16-bit index and 8-bit subindex (e.g. `0x6060` = "modes of operation"). During
PRE-OP the profile uses CoE to configure the device; during OP the mapped subset
of those objects flows cyclically as PDOs.

**CiA device profiles** are standards that say *which* objects a class of device
must expose and what they mean, so masters and devices from different vendors
interoperate:

| CANopen profile | Device class | Standard objects |
| --- | --- | --- |
| **CiA 402** | Motion drives / servos | `0x6040` controlword, `0x6041` statusword, `0x607A` target position, `0x6064` actual position, `0x6060` modes of operation |
| **CiA 401** | Generic digital/analog I/O | `0x6000` digital inputs, `0x7000` digital outputs, `0x6401` analog inputs |
| **CiA 406** | Encoders | `0x6004` position value |

Because these are standards, LXMASTER can ship *one* CiA402 profile that drives
almost any compliant servo — which is exactly why swapping drive brands does not
change your `Axis` code. See
[How Data Flows](../../ethercat-basics/data-communication.md) for the CoE/PDO split.

## How LXMASTER picks a profile for each slave

When you call `prepare()`, LXMASTER walks every `<Slave>` in the ENI and asks a
**profile registry** to select the best profile for it. Selection is a simple
"highest claim wins" contest:

| Priority | Match | When it applies |
| --- | --- | --- |
| **Highest** | **Identity pin** — exact vendor ID + product code | An app- or vendor-supplied profile registered for that specific device. |
| **Middle** | **Profile family** — the slave's CANopen profile number (402 / 401 / 406) | The built-in generic profiles. This is what most standard devices hit. |
| **None** | no factory claims it | A slave that maps process data but matches nothing is a **hard error** at bring-up; a slave that maps no PDOs is left passive. |

In practice, out of the box:

- A CiA402 servo in your ENI → the built-in CiA402 profile → an `Axis`.
- A CiA401 I/O terminal → the built-in I/O profile → an `IoModule`.
- A CiA406 encoder → the built-in encoder profile → an `Encoder`.

You did not register anything to get this — the built-ins claim by profile family
automatically. This is why the [first application](./first-application) already
reported the right number of axes and I/O modules.

## Why the identity tier exists (a look ahead)

The top tier — matching an exact vendor ID and product code — is the extension
point for the whole system. Because an identity match outranks the family
fallback, you can:

- **Override** the generic CiA402 profile for a specific drive to add
  vendor-specific behaviour, while keeping the standard `Axis` API. You will do
  this in [Extending a built-in profile](../advanced/extending-profiles).
- **Add** support for a device that fits none of the CiA families at all — a
  custom sensor, a proprietary controller — by writing a profile from scratch and
  reaching it through `GenericDevice`. You will do this in
  [Writing your own device profile](../advanced/custom-device-profile).

You register such a profile for a single run through the network config:

```cpp
cfg.extra_profile_factories.push_back(
    ecdev::makeIdentityProfileFactory(
        ecdev::DeviceIdentityMatch{vendorId, productCode},
        MyProfile::make, "vendor:my-device"));
```

App-supplied factories are consulted *ahead* of the built-ins, so a matching
identity always wins over the generic family profile. Don't worry about the
details yet — the point for now is that the facade you use never changes; only the
profile behind it does.

## Inspecting the profile behind a facade

Every facade can hand you its profile via the escape hatch you saw last time.
Profiles carry a stable name you can check:

```cpp
ecdev::IDeviceProfile* prof = drive->deviceProfile();
std::cout << "Axis is backed by profile: " << prof->profileName() << "\n";
```

For a standard servo this prints the built-in CiA402 profile's name. After you
register a custom profile, the same call prints yours — proof that selection
picked it.

## Recap

- A **device profile** knows a device's process-data layout, state machine, and
  capability contract; the facade is just its thin public face.
- LXMASTER selects a profile per slave by **highest claim**: exact identity beats
  CANopen profile family (402/401/406) beats nothing.
- The capability the profile implements decides which facade you get.
- The identity tier is the hook for **extending** a built-in profile or
  **writing your own** — both covered in the Advanced section.

## Next

You now understand both core concepts. Time to put them to work: in
[Motion operating modes](../intermediate/operating-modes) you will use the CiA402
profile's modes through the `Axis` facade to run position, velocity, and torque
control.
