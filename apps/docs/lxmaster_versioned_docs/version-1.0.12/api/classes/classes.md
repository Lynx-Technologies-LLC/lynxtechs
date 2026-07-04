---
title: "Classes"

---
<!-- GENERATED - do not edit. Produced from the LXMASTER public
     headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->

# Classes

## Tier 1 — Application API

Classes you use directly when writing a motion/IO application against LXMASTER.

### Network

* **class [EcNetwork](/lxmaster/api/classes/EcNetwork)** <br>User-facing runtime facade for an EtherCAT network.
    * **struct [DcSyncStats](/lxmaster/api/classes/EcNetwork-DcSyncStats)** <br>End-of-run DC-sync alignment summary (host wake vs reference-slave DC clock).
    * **struct [JitterStats](/lxmaster/api/classes/EcNetwork-JitterStats)** <br>End-of-run jitter summary (populated by the cyclic thread).
    * **struct [SlaveSnapshot](/lxmaster/api/classes/EcNetwork-SlaveSnapshot)** <br>Snapshot of each slave's EtherCAT state + AL-status code taken at shutdown.
    * **struct [SyncTraceReport](/lxmaster/api/classes/EcNetwork-SyncTraceReport)** <br>Sync-trace ring snapshot cached at stop().
* **struct [NetworkConfig](/lxmaster/api/classes/NetworkConfig)** <br>User-facing configuration for an EcNetwork.
* **struct [BusFault](/lxmaster/api/classes/BusFault)** <br>Structured description of a cyclic-bus fault, built when the watchdog trips.
    * **struct [LostSlave](/lxmaster/api/classes/LostSlave)** <br>One slave that stopped responding when the bus fault was diagnosed.

### Device handles

* **class [Axis](/lxmaster/api/classes/Axis)** <br>High-level motion handle (analogous to a TwinCAT "NC axis").
* **class [IoModule](/lxmaster/api/classes/IoModule)** <br>High-level digital/analog I/O handle.
* **class [Encoder](/lxmaster/api/classes/Encoder)** <br>High-level encoder handle.
* **class [GenericDevice](/lxmaster/api/classes/GenericDevice)** <br>Application handle for a device whose profile implements none of the typed capability contracts.

---

## Tier 2 — Device Extension API

Classes you extend or implement when writing a custom device driver profile.

### Core interfaces

* **class [IDeviceProfile](/lxmaster/api/classes/IDeviceProfile)** <br>Device-class behaviour plugged onto a slave. Start here for any custom profile.
* **class [IMotionProfile](/lxmaster/api/classes/IMotionProfile)** <br>Facade-facing contract for a motion (drive) device (CiA 402 family).
* **class [IIoProfile](/lxmaster/api/classes/IIoProfile)** <br>Facade-facing contract for a digital/analog I/O device (CiA 401 family).
* **class [IEncoderProfile](/lxmaster/api/classes/IEncoderProfile)** <br>Facade-facing contract for an encoder / position sensor (CiA 406 family).

### Built-in profiles (extend or use as reference)

* **class [GenericIoProfile](/lxmaster/api/classes/GenericIoProfile)** <br>Protocol-agnostic digital/analog I/O profile.
* **class [CiA401IoProfile](/lxmaster/api/classes/CiA401IoProfile)** <br>CiA 401 (CANopen generic I/O) profile.
* **class [CiA402DriveProfile](/lxmaster/api/classes/CiA402DriveProfile)** <br>CiA 402 (CANopen-over-EtherCAT) servo-drive profile.
    * **struct [Config](/lxmaster/api/classes/CiA402DriveProfile-Config)**
    * **struct [InputSnapshot](/lxmaster/api/classes/CiA402DriveProfile-InputSnapshot)**
    * **struct [OutputSnapshot](/lxmaster/api/classes/CiA402DriveProfile-OutputSnapshot)**
* **class [CiA406EncoderProfile](/lxmaster/api/classes/CiA406EncoderProfile)** <br>CiA 406 (encoder) profile.

### Profile registration

* **class [ProfileRegistry](/lxmaster/api/classes/ProfileRegistry)** <br>Registry of IProfileFactory plugins — pass custom factories here.
* **class [IProfileFactory](/lxmaster/api/classes/IProfileFactory)** <br>Builds the device-class profile for one slave.
* **struct [ProfileSelectionInput](/lxmaster/api/classes/ProfileSelectionInput)** <br>Inputs a factory uses to decide on and build a profile for one ENI slave.
* **struct [DeviceIdentityMatch](/lxmaster/api/classes/DeviceIdentityMatch)** <br>Exact device identity (vendor ID + product code + revision range) a device class serves.

-------------------------------

Updated on 2026-07-04 at 20:22:54 +0000
