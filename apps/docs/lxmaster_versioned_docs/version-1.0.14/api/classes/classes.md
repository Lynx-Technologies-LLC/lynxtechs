---
title: Classes

---

<!-- GENERATED - do not edit. Produced from the LXMASTER public headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->
# Classes




* **class [CiA401IoProfile](/lxmaster/api/classes/CiA401IoProfile)** <br>CiA 401 (CANopen generic I/O) profile. 
* **class [CiA402DriveProfile](/lxmaster/api/classes/CiA402DriveProfile)** <br>CiA 402 (CANopen-over-EtherCAT) servo-drive profile. 
    * **struct [Config](/lxmaster/api/classes/CiA402DriveProfile-Config)** 
    * **struct [InputSnapshot](/lxmaster/api/classes/CiA402DriveProfile-InputSnapshot)** 
    * **struct [OutputSnapshot](/lxmaster/api/classes/CiA402DriveProfile-OutputSnapshot)** 
* **class [CiA406EncoderProfile](/lxmaster/api/classes/CiA406EncoderProfile)** <br>CiA 406 (encoder) profile. 
* **struct [DeviceIdentityMatch](/lxmaster/api/classes/DeviceIdentityMatch)** <br>Exact device identity a device class serves. 
* **class [GenericIoProfile](/lxmaster/api/classes/GenericIoProfile)** <br>Protocol-agnostic digital/analog I/O profile. 
* **class [IDeviceProfile](/lxmaster/api/classes/IDeviceProfile)** <br>Device-class behaviour plugged onto a `[GenericEniDevice]`. 
* **class [IEncoderProfile](/lxmaster/api/classes/IEncoderProfile)** <br>Facade-facing contract for an encoder / position sensor (CiA 406 family). 
* **class [IIoProfile](/lxmaster/api/classes/IIoProfile)** <br>Facade-facing contract for a digital/analog I/O device (CiA 401 family). 
* **class [IMotionProfile](/lxmaster/api/classes/IMotionProfile)** <br>Facade-facing contract for a motion (drive) device. 
* **class [IProfileFactory](/lxmaster/api/classes/IProfileFactory)** <br>Builds the device-class profile for one slave. 
* **class [ProfileRegistry](/lxmaster/api/classes/ProfileRegistry)** <br>Registry of `IProfileFactory` plugins. 
* **struct [ProfileSelectionInput](/lxmaster/api/classes/ProfileSelectionInput)** <br>Inputs a factory uses to decide on and build a profile for one ENI slave. 
* **namespace claim_score** <br>Claim-score tiers for `IProfileFactory::claim`. 
* **class [Axis](/lxmaster/api/classes/Axis)** <br>High-level motion handle a PLC/application programmer uses, analogous to a TwinCAT "NC axis". 
* **class [Encoder](/lxmaster/api/classes/Encoder)** <br>High-level encoder handle. 
* **class [GenericDevice](/lxmaster/api/classes/GenericDevice)** <br>Application handle for a device whose profile implements none of the typed capability contracts (not an `Axis`, `[IoModule](/lxmaster/api/classes/IoModule)`, or `Encoder`) &ndash; e.g. 
* **class [IoModule](/lxmaster/api/classes/IoModule)** <br>High-level digital/analog I/O handle. 
* **struct [BusFault](/lxmaster/api/classes/BusFault)** <br>Structured description of a cyclic-bus fault, built when the cycle-health watchdog trips (see `NetworkConfig::watchdog_low_wkc_cycles`). 
* **class [EcNetwork](/lxmaster/api/classes/EcNetwork)** <br>User-facing runtime facade for an EtherCAT network. 
    * **struct [DcSyncStats](/lxmaster/api/classes/EcNetwork-DcSyncStats)** <br>End-of-run DC-sync alignment summary (host wake vs reference-slave DC clock). 
    * **struct [JitterStats](/lxmaster/api/classes/EcNetwork-JitterStats)** <br>End-of-run jitter summary (populated by the cyclic thread). 
    * **struct [SlaveSnapshot](/lxmaster/api/classes/EcNetwork-SlaveSnapshot)** <br>Snapshot of each slave's EtherCAT state + AL-status code taken while the master is still open (the last thing `[stop()](/lxmaster/api/classes/EcNetwork#function-stop)` does before `master_->close()`). 
    * **struct [SyncTraceReport](/lxmaster/api/classes/EcNetwork-SyncTraceReport)** <br>Cached at `[stop()](/lxmaster/api/classes/EcNetwork#function-stop)` from the cyclic executor's sync trace ring (see `NetworkConfig::sync_trace_capacity`). 
* **struct [LostSlave](/lxmaster/api/classes/LostSlave)** <br>One slave that stopped responding when the bus fault was diagnosed. 
* **struct [NetworkConfig](/lxmaster/api/classes/NetworkConfig)** <br>User-facing configuration for an EcNetwork. 



-------------------------------

Updated on 2026-07-04 at 23:28:44 +0000
