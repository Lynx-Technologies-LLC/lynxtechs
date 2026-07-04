<!-- GENERATED - do not edit. Produced from the LXMASTER public
     headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->
---
title: Classes

---

# Classes




* **namespace [ecdev](/lxmaster/api/namespaces/namespaceecdev)** 
    * **class [CiA401IoProfile](/lxmaster/api/classes/classecdev_1_1cia401ioprofile)** <br>CiA 401 (CANopen generic I/O) profile. 
    * **class [CiA402DriveProfile](/lxmaster/api/classes/classecdev_1_1cia402driveprofile)** <br>CiA 402 (CANopen-over-EtherCAT) servo-drive profile. 
        * **struct [Config](/lxmaster/api/classes/structecdev_1_1cia402driveprofile_1_1config)** 
        * **struct [InputSnapshot](/lxmaster/api/classes/structecdev_1_1cia402driveprofile_1_1inputsnapshot)** 
        * **struct [OutputSnapshot](/lxmaster/api/classes/structecdev_1_1cia402driveprofile_1_1outputsnapshot)** 
    * **class [CiA406EncoderProfile](/lxmaster/api/classes/classecdev_1_1cia406encoderprofile)** <br>CiA 406 (encoder) profile. 
    * **struct [DeviceIdentityMatch](/lxmaster/api/classes/structecdev_1_1deviceidentitymatch)** <br>Exact device identity a device class serves. 
    * **class [GenericIoProfile](/lxmaster/api/classes/classecdev_1_1genericioprofile)** <br>Protocol-agnostic digital/analog I/O profile. 
    * **class [IDeviceProfile](/lxmaster/api/classes/classecdev_1_1ideviceprofile)** <br>Device-class behaviour plugged onto a `[GenericEniDevice]`. 
    * **class [IEncoderProfile](/lxmaster/api/classes/classecdev_1_1iencoderprofile)** <br>Facade-facing contract for an encoder / position sensor (CiA 406 family). 
    * **class [IIoProfile](/lxmaster/api/classes/classecdev_1_1iioprofile)** <br>Facade-facing contract for a digital/analog I/O device (CiA 401 family). 
    * **class [IMotionProfile](/lxmaster/api/classes/classecdev_1_1imotionprofile)** <br>Facade-facing contract for a motion (drive) device. 
    * **class [IProfileFactory](/lxmaster/api/classes/classecdev_1_1iprofilefactory)** <br>Builds the device-class profile for one slave. 
    * **class [PdoAssignment](/lxmaster/api/classes/classecdev_1_1pdoassignment)** <br>Generic, ENI-driven CoE PDO assignment. 
        * **struct [PdoPlan](/lxmaster/api/classes/structecdev_1_1pdoassignment_1_1pdoplan)** 
        * **struct [SmGroup](/lxmaster/api/classes/structecdev_1_1pdoassignment_1_1smgroup)** 
    * **struct [PdoEntryRef](/lxmaster/api/classes/structecdev_1_1pdoentryref)** <br>Resolved location of one mapped CoE object inside a slave's process image. 
    * **class [ProcessImage](/lxmaster/api/classes/classecdev_1_1processimage)** <br>Per-slave process-image accessor: the narrow cyclic-path contract that device profiles use. 
        * **struct [Entry](/lxmaster/api/classes/structecdev_1_1processimage_1_1entry)** <br>All resolved entries, in image order (diagnostics / enumeration by facades). 
    * **class [ProfileRegistry](/lxmaster/api/classes/classecdev_1_1profileregistry)** <br>Registry of `[IProfileFactory]()` plugins. 
    * **struct [ProfileSelectionInput](/lxmaster/api/classes/structecdev_1_1profileselectioninput)** <br>Inputs a factory uses to decide on and build a profile for one ENI slave. 
    * **namespace [claim_score](/lxmaster/api/namespaces/namespaceecdev_1_1claim__score)** <br>Claim-score tiers for `[IProfileFactory::claim]()`. 
* **namespace [ecfacade](/lxmaster/api/namespaces/namespaceecfacade)** 
    * **class [Axis](/lxmaster/api/classes/classecfacade_1_1axis)** <br>High-level motion handle a PLC/application programmer uses, analogous to a TwinCAT "NC axis". 
    * **class [DeviceFacade](/lxmaster/api/classes/classecfacade_1_1devicefacade)** <br>Shared base for every application-facing device handle ([IoModule](/lxmaster/api/classes/classecfacade_1_1iomodule), [Axis](), [Encoder](/lxmaster/api/classes/classecfacade_1_1encoder)). 
    * **class [Encoder](/lxmaster/api/classes/classecfacade_1_1encoder)** <br>High-level encoder handle. 
    * **class [GenericDevice](/lxmaster/api/classes/classecfacade_1_1genericdevice)** <br>Application handle for a device whose profile implements none of the typed capability contracts (not an `[Axis]()`, `[IoModule](/lxmaster/api/classes/classecfacade_1_1iomodule)`, or `[Encoder]()`) &ndash; e.g. 
    * **class [IoModule](/lxmaster/api/classes/classecfacade_1_1iomodule)** <br>High-level digital/analog I/O handle. 
* **namespace [ecnet](/lxmaster/api/namespaces/namespaceecnet)** 
    * **struct [BusConfig](/lxmaster/api/classes/structecnet_1_1busconfig)** 
    * **struct [BusFault](/lxmaster/api/classes/structecnet_1_1busfault)** <br>Structured description of a cyclic-bus fault, built when the cycle-health watchdog trips (see `NetworkConfig::watchdog_low_wkc_cycles`). 
    * **struct [DcConfig](/lxmaster/api/classes/structecnet_1_1dcconfig)** 
    * **struct [DebugConfig](/lxmaster/api/classes/structecnet_1_1debugconfig)** <br>Runtime logging configuration. 
    * **class [EcNetwork](/lxmaster/api/classes/classecnet_1_1ecnetwork)** <br>User-facing runtime facade for an EtherCAT network. 
        * **struct [DcSyncStats](/lxmaster/api/classes/structecnet_1_1ecnetwork_1_1dcsyncstats)** <br>End-of-run DC-sync alignment summary (host wake vs reference-slave DC clock). 
        * **struct [JitterStats](/lxmaster/api/classes/structecnet_1_1ecnetwork_1_1jitterstats)** <br>End-of-run jitter summary (populated by the cyclic thread). 
        * **struct [SlaveSnapshot](/lxmaster/api/classes/structecnet_1_1ecnetwork_1_1slavesnapshot)** <br>Snapshot of each slave's EtherCAT state + AL-status code taken while the master is still open (the last thing `[stop()](/lxmaster/api/classes/classecnet_1_1ecnetwork#function-stop)` does before `master_->close()`). 
        * **struct [SyncTraceReport](/lxmaster/api/classes/structecnet_1_1ecnetwork_1_1synctracereport)** <br>Cached at `[stop()](/lxmaster/api/classes/classecnet_1_1ecnetwork#function-stop)` from the cyclic executor's sync trace ring (see `NetworkConfig::sync_trace_capacity`). 
    * **struct [EniConfig](/lxmaster/api/classes/structecnet_1_1eniconfig)** <br>ENI-driven configuration. 
    * **struct [LostSlave](/lxmaster/api/classes/structecnet_1_1lostslave)** <br>One slave that stopped responding when the bus fault was diagnosed. 
    * **struct [NetworkConfig](/lxmaster/api/classes/structecnet_1_1networkconfig)** <br>User-facing configuration for an [EcNetwork](). 
    * **struct [RtConfig](/lxmaster/api/classes/structecnet_1_1rtconfig)** 
    * **struct [ShutdownConfig](/lxmaster/api/classes/structecnet_1_1shutdownconfig)** 
    * **struct [SyncTraceSample](/lxmaster/api/classes/structecnet_1_1synctracesample)** 
    * **namespace [diag](/lxmaster/api/namespaces/namespaceecnet_1_1diag)** <br>SAFE_OP bring-up diagnostics, split from the logging layer: each `probe*` reads the bus into a plain report struct, and `format()` renders it. 
        * **struct [CoEErrorReport](/lxmaster/api/classes/structecnet_1_1diag_1_1coeerrorreport)** 
        * **struct [CoEErrorSlave](/lxmaster/api/classes/structecnet_1_1diag_1_1coeerrorslave)** 
        * **struct [PdoAssignEntry](/lxmaster/api/classes/structecnet_1_1diag_1_1pdoassignentry)** 
        * **struct [PdoAssignObject](/lxmaster/api/classes/structecnet_1_1diag_1_1pdoassignobject)** 
        * **struct [SafeOpDcReport](/lxmaster/api/classes/structecnet_1_1diag_1_1safeopdcreport)** 
        * **struct [SafeOpDcSlave](/lxmaster/api/classes/structecnet_1_1diag_1_1safeopdcslave)** 
        * **struct [SdoI8](/lxmaster/api/classes/structecnet_1_1diag_1_1sdoi8)** 
        * **struct [SdoU16](/lxmaster/api/classes/structecnet_1_1diag_1_1sdou16)** 
        * **struct [SdoU32](/lxmaster/api/classes/structecnet_1_1diag_1_1sdou32)** 
        * **struct [SdoU8](/lxmaster/api/classes/structecnet_1_1diag_1_1sdou8)** <br>Optional SDO scalar: `present` is false when the read failed / object is absent. 
        * **struct [StrictSyncReport](/lxmaster/api/classes/structecnet_1_1diag_1_1strictsyncreport)** 
        * **struct [StrictSyncSlave](/lxmaster/api/classes/structecnet_1_1diag_1_1strictsyncslave)** 
* **namespace [lxmaster](/lxmaster/api/namespaces/namespacelxmaster)** 
* **namespace [std](/lxmaster/api/namespaces/namespacestd)** <br>STL namespace. 



-------------------------------

Updated on 2026-07-04 at 20:22:54 +0000
