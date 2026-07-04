<!-- GENERATED - do not edit. Produced from the LXMASTER public
     headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->
---
title: ecdev

---

# ecdev



## Namespaces

| Name           |
| -------------- |
| **[ecdev::claim_score](/lxmaster/api/namespaces/namespaceecdev_1_1claim__score)** <br>Claim-score tiers for `[IProfileFactory::claim]()`.  |

## Classes

|                | Name           |
| -------------- | -------------- |
| struct | **[ecdev::ProfileSelectionInput](/lxmaster/api/classes/structecdev_1_1profileselectioninput)** <br>Inputs a factory uses to decide on and build a profile for one ENI slave.  |
| class | **[ecdev::ProfileRegistry](/lxmaster/api/classes/classecdev_1_1profileregistry)** <br>Registry of `[IProfileFactory]()` plugins.  |
| class | **[ecdev::ProcessImage](/lxmaster/api/classes/classecdev_1_1processimage)** <br>Per-slave process-image accessor: the narrow cyclic-path contract that device profiles use.  |
| struct | **[ecdev::PdoEntryRef](/lxmaster/api/classes/structecdev_1_1pdoentryref)** <br>Resolved location of one mapped CoE object inside a slave's process image.  |
| class | **[ecdev::PdoAssignment](/lxmaster/api/classes/classecdev_1_1pdoassignment)** <br>Generic, ENI-driven CoE PDO assignment.  |
| class | **[ecdev::IProfileFactory](/lxmaster/api/classes/classecdev_1_1iprofilefactory)** <br>Builds the device-class profile for one slave.  |
| class | **[ecdev::IMotionProfile](/lxmaster/api/classes/classecdev_1_1imotionprofile)** <br>Facade-facing contract for a motion (drive) device.  |
| class | **[ecdev::IIoProfile](/lxmaster/api/classes/classecdev_1_1iioprofile)** <br>Facade-facing contract for a digital/analog I/O device (CiA 401 family).  |
| class | **[ecdev::IEncoderProfile](/lxmaster/api/classes/classecdev_1_1iencoderprofile)** <br>Facade-facing contract for an encoder / position sensor (CiA 406 family).  |
| class | **[ecdev::IDeviceProfile](/lxmaster/api/classes/classecdev_1_1ideviceprofile)** <br>Device-class behaviour plugged onto a `[GenericEniDevice]`.  |
| class | **[ecdev::GenericIoProfile](/lxmaster/api/classes/classecdev_1_1genericioprofile)** <br>Protocol-agnostic digital/analog I/O profile.  |
| struct | **[ecdev::DeviceIdentityMatch](/lxmaster/api/classes/structecdev_1_1deviceidentitymatch)** <br>Exact device identity a device class serves.  |
| class | **[ecdev::CiA406EncoderProfile](/lxmaster/api/classes/classecdev_1_1cia406encoderprofile)** <br>CiA 406 (encoder) profile.  |
| class | **[ecdev::CiA402DriveProfile](/lxmaster/api/classes/classecdev_1_1cia402driveprofile)** <br>CiA 402 (CANopen-over-EtherCAT) servo-drive profile.  |
| class | **[ecdev::CiA401IoProfile](/lxmaster/api/classes/classecdev_1_1cia401ioprofile)** <br>CiA 401 (CANopen generic I/O) profile.  |

## Types

|                | Name           |
| -------------- | -------------- |
| enum class| **[SyncMode](/lxmaster/api/namespaces/namespaceecdev#enum-syncmode)** { SmEvent, DcSync0}<br>How the EtherCAT bus synchronizes PDO cycles with the slave's internal control loop.  |
| using std::function< std::unique_ptr< [IDeviceProfile](/lxmaster/api/classes/classecdev_1_1ideviceprofile) >(const [ProfileSelectionInput](/lxmaster/api/classes/structecdev_1_1profileselectioninput) &)> | **[ProfileCreateFn](/lxmaster/api/namespaces/namespaceecdev#using-profilecreatefn)** <br>Builds the device-class profile for a matched slave.  |
| enum class| **[DriveOpMode](/lxmaster/api/namespaces/namespaceecdev#enum-driveopmode)** { Csv, Cst, Csp}<br>Cyclic operating mode for a CiA 402 (CANopen-over-EtherCAT) servo drive.  |

## Functions

|                | Name           |
| -------------- | -------------- |
| std::unique_ptr< [IProfileFactory](/lxmaster/api/classes/classecdev_1_1iprofilefactory) > | **[makeProfileFamilyFactory](/lxmaster/api/namespaces/namespaceecdev#function-makeprofilefamilyfactory)**()<br>Family-fallback factory.  |
| std::unique_ptr< [IProfileFactory](/lxmaster/api/classes/classecdev_1_1iprofilefactory) > | **[makeIdentityProfileFactory](/lxmaster/api/namespaces/namespaceecdev#function-makeidentityprofilefactory)**([DeviceIdentityMatch](/lxmaster/api/classes/structecdev_1_1deviceidentitymatch) match, ProfileCreateFn fn, const char * name)<br>Make an `[IProfileFactory]()` that claims a slave (at `[claim_score::kIdentityPin]()`) exactly when `match` matches its identity, and builds the profile via `fn`.  |
| std::unique_ptr< [IDeviceProfile](/lxmaster/api/classes/classecdev_1_1ideviceprofile) > | **[makeGenericIoProfile](/lxmaster/api/namespaces/namespaceecdev#function-makegenericioprofile)**(const [ProfileSelectionInput](/lxmaster/api/classes/structecdev_1_1profileselectioninput) & in)<br>Build a [GenericIoProfile]().  |
| std::unique_ptr< [IDeviceProfile](/lxmaster/api/classes/classecdev_1_1ideviceprofile) > | **[makeCiA406EncoderProfile](/lxmaster/api/namespaces/namespaceecdev#function-makecia406encoderprofile)**(const [ProfileSelectionInput](/lxmaster/api/classes/structecdev_1_1profileselectioninput) & in)<br>Build a [CiA406EncoderProfile]().  |
| std::unique_ptr< [IDeviceProfile](/lxmaster/api/classes/classecdev_1_1ideviceprofile) > | **[makeCiA402DriveProfile](/lxmaster/api/namespaces/namespaceecdev#function-makecia402driveprofile)**(const [ProfileSelectionInput](/lxmaster/api/classes/structecdev_1_1profileselectioninput) & in)<br>Build a [CiA402DriveProfile]() from the selection input (op-mode / fault-policy flags).  |
| std::unique_ptr< [IDeviceProfile](/lxmaster/api/classes/classecdev_1_1ideviceprofile) > | **[makeCiA401IoProfile](/lxmaster/api/namespaces/namespaceecdev#function-makecia401ioprofile)**(const [ProfileSelectionInput](/lxmaster/api/classes/structecdev_1_1profileselectioninput) & in)<br>Build a [CiA401IoProfile]().  |

## Types Documentation

### enum SyncMode

| Enumerator | Value | Description |
| ---------- | ----- | ----------- |
| SmEvent | |   |
| DcSync0 | |   |



How the EtherCAT bus synchronizes PDO cycles with the slave's internal control loop. 

**DcSync0** (default): every slave is driven by a SYNC0 pulse emitted from its own distributed-clocks unit at a programmed period. The master times its PDO transmission against the reference-slave's DC clock (`ecSyncToDc` PI controller). Each cycle is enforced: on a DC-strict slave any PDO frame arriving more than a few µs off the SYNC0 phase latches the slave's synchronization-controller fault (typically `0x603F=0x8700` in CiA-402). Target hosts: PREEMPT_RT + isolated CPU + SCHED_FIFO with measured `[dc-sync] max` well under the slave's configured sync-error window (a few µs on most servo drives, larger on I/O slaves).

**SmEvent** (non-RT friendly): the slave's control loop is triggered by SM2/SM3 sync-manager events — i.e. the arrival of the LRW frame itself. No SYNC0 pulse, no DC-strict phase enforcement, and consequently no per-cycle `[dc-sync]` metric. The drive's SM watchdog (typically 50–100 ms) is the only timing constraint, which is trivially met by any Linux userspace master. Target hosts: stock Linux kernel, or cases where you don't want firmware faults from the occasional scheduler outlier. Tradeoff: position-loop latency variability equals host scheduler jitter (tens of µs on stock Linux), so the motion command is applied one cycle later and with slightly more jitter than DC-mode.

**Hardware requirement for SmEvent:** the slave must advertise SM-synchronous operation in SDO `0x1C32:04` / `0x1C33:04` (ETG bitmask, bit0 = SM-event). Many CiA402 servos only expose DC-Sync0 (bit1) and abort writes to `0x1C32:01` / `0x1C33:01` with value `1`; the CiA 402 profile detects this in PreOP and fails fast with a clear `configureError()` instead of timing out at OP with AL 0x0027.

The enum is shared between `devices` (where device-specific PreOP writes live) and `ecnet` (which configures the master's DC registers + PI controller). 


### using ProfileCreateFn

```cpp
using ecdev::ProfileCreateFn = typedef std::function<std::unique_ptr<IDeviceProfile>(const ProfileSelectionInput&)>;
```

Builds the device-class profile for a matched slave. 

Returning null pins the slave as passive. 


### enum DriveOpMode

| Enumerator | Value | Description |
| ---------- | ----- | ----------- |
| Csv | |   |
| Cst | |   |
| Csp | |   |



Cyclic operating mode for a CiA 402 (CANopen-over-EtherCAT) servo drive. 

Maps 1:1 to the DS402 modes-of-operation object (0x6060):



* **Csp** (8): Cyclic Synchronous Position — commands target position 0x607A (INT32).
* **Csv** (9): Cyclic Synchronous Velocity — commands target velocity 0x60FF (INT32).
* **Cst** (10): Cyclic Synchronous Torque — commands target torque 0x6071 (INT16, per-mille).

Each mode's cyclic facts (target object, data width, neutral-target value) live in the `OpModeTraits` table in `cia402_drive_profile.cpp`; no mode is special-cased. 



## Functions Documentation

### function makeProfileFamilyFactory

```cpp
std::unique_ptr< IProfileFactory > makeProfileFamilyFactory()
```

Family-fallback factory. 

When no identity class matches a slave, this claims it (at `[claim_score::kProfileFamily](/lxmaster/api/namespaces/namespaceecdev_1_1claim__score#variable-kprofilefamily)`) by the slave's CANopen profile number (`eni::SlaveConfig::profile_no`) and builds the matching behavioural profile:

* 402 -> CiA402 drive (`[makeCiA402DriveProfile]`)
* 401 -> CiA401 I/O (`[makeCiA401IoProfile]`)
* 406 -> CiA406 encoder (`[makeCiA406EncoderProfile]`)

Every other value &ndash; including 5001 (ETG.5001 modular), 404, 0 (absent) and 0xFFFF &ndash; does NOT claim, because the number does not by itself imply a behavioural class; such slaves require an explicit identity class and otherwise hit the caller's unmatched-slave policy (a hard error for PDO-mapping slaves). This factory is self-registered into the builtin registry. 


### function makeIdentityProfileFactory

```cpp
std::unique_ptr< IProfileFactory > makeIdentityProfileFactory(
    DeviceIdentityMatch match,
    ProfileCreateFn fn,
    const char * name
)
```

Make an `[IProfileFactory]()` that claims a slave (at `[claim_score::kIdentityPin]()`) exactly when `match` matches its identity, and builds the profile via `fn`. 

`name` is a stable diagnostic label and must outlive the factory (a string literal in practice).

This is the low-boilerplate way to author a device class: bind an identity to any profile (an existing behaviour like `[CiA402DriveProfile](/lxmaster/api/classes/classecdev_1_1cia402driveprofile)`, or a brand-new `[IDeviceProfile](/lxmaster/api/classes/classecdev_1_1ideviceprofile)`/facade subclass) and register it with `LXMASTER_REGISTER_DEVICE`. 


### function makeGenericIoProfile

```cpp
std::unique_ptr< IDeviceProfile > makeGenericIoProfile(
    const ProfileSelectionInput & in
)
```

Build a [GenericIoProfile](). 

Bind it to a device identity with `makeIdentityProfileFactory`. 


### function makeCiA406EncoderProfile

```cpp
std::unique_ptr< IDeviceProfile > makeCiA406EncoderProfile(
    const ProfileSelectionInput & in
)
```

Build a [CiA406EncoderProfile](). 

Bind it to a device identity with `makeIdentityProfileFactory`. 


### function makeCiA402DriveProfile

```cpp
std::unique_ptr< IDeviceProfile > makeCiA402DriveProfile(
    const ProfileSelectionInput & in
)
```

Build a [CiA402DriveProfile]() from the selection input (op-mode / fault-policy flags). 

Bind it to a device identity with `makeIdentityProfileFactory`. 


### function makeCiA401IoProfile

```cpp
std::unique_ptr< IDeviceProfile > makeCiA401IoProfile(
    const ProfileSelectionInput & in
)
```

Build a [CiA401IoProfile](). 

Bind it to a device identity with `makeIdentityProfileFactory`. 






-------------------------------

Updated on 2026-07-04 at 20:22:54 +0000