---
title: "ecnet::EcNetwork"
summary: "User-facing runtime facade for an EtherCAT network."

slug: /lxmaster/api/classes/EcNetwork
sidebar_label: "EcNetwork"
---
<!-- GENERATED - do not edit. Produced from the LXMASTER public
     headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->

# ecnet::EcNetwork

User-facing runtime facade for an EtherCAT network.  [More...](#detailed-description)

`#include <ec_network.hpp>`

## Public Classes

|                | Name           |
| -------------- | -------------- |
| struct | **[SyncTraceReport](/lxmaster/api/classes/EcNetwork-SyncTraceReport)** <br>Cached at `[stop()](/lxmaster/api/classes/EcNetwork#function-stop)` from the cyclic executor's sync trace ring (see `NetworkConfig::sync_trace_capacity`).  |
| struct | **[JitterStats](/lxmaster/api/classes/EcNetwork-JitterStats)** <br>End-of-run jitter summary (populated by the cyclic thread).  |
| struct | **[DcSyncStats](/lxmaster/api/classes/EcNetwork-DcSyncStats)** <br>End-of-run DC-sync alignment summary (host wake vs reference-slave DC clock).  |

## Public Functions

|                | Name           |
| -------------- | -------------- |
| | **[~EcNetwork](/lxmaster/api/classes/EcNetwork#function-~ecnetwork)**() |
| std::uint64_t | **[syncTraceViolationCount](/lxmaster/api/classes/EcNetwork#function-synctraceviolationcount)**() const<br>Live violation tally while the cyclic thread is running (`sync_trace_window_ns` > 0).  |
| [SyncTraceReport](/lxmaster/api/classes/EcNetwork-SyncTraceReport) | **[syncTraceReport](/lxmaster/api/classes/EcNetwork#function-synctracereport)**() const<br>Per-cycle DC-sync + host jitter capture from the last session (`NetworkConfig::sync_trace_capacity`).  |
| SyncMode | **[syncMode](/lxmaster/api/classes/EcNetwork#function-syncmode)**() const<br>Synchronization mode resolved from the ENI (DcSync0 when the bus carries a SYNC0 device, else SmEvent).  |
| void | **[stop](/lxmaster/api/classes/EcNetwork#function-stop)**()<br>Stop the cyclic thread and close the master.  |
| bool | **[start](/lxmaster/api/classes/EcNetwork#function-start)**()<br>Phase 2 of bring-up (runs `[prepare()]()` first if it has not been called): per-device CoE configuration (commits each drive's operating mode to 0x6060), configures DC, reaches SAFE_OP + OPERATIONAL, and spawns the cyclic thread.  |
| void | **[reportDeviceStatus](/lxmaster/api/classes/EcNetwork#function-reportdevicestatus)**(std::ostream & os) const<br>Print each device's exit status via `reportExitStatus` to `os`.  |
| bool | **[prepare](/lxmaster/api/classes/EcNetwork#function-prepare)**()<br>Phase 1 of bring-up: applies RT scheduling, loads + validates the ENI, opens the NIC, verifies the scanned hardware, reaches PRE_OP, and binds devices so that `[axes()]()` / `[ioModules()]()` / `[encoders()]()` become valid.  |
| [EcNetwork](/lxmaster/api/classes/EcNetwork) & | **[operator=](/lxmaster/api/classes/EcNetwork#function-operator=)**(const [EcNetwork](/lxmaster/api/classes/EcNetwork) & ) =delete |
| std::string | **[lastError](/lxmaster/api/classes/EcNetwork#function-lasterror)**() const<br>Last human-readable error captured from the library (thread-safe).  |
| [JitterStats](/lxmaster/api/classes/EcNetwork-JitterStats) | **[jitterStats](/lxmaster/api/classes/EcNetwork#function-jitterstats)**() const<br>Snapshot of cycle-timing jitter (updated throughout the run; final at `[stop()](/lxmaster/api/classes/EcNetwork#function-stop)`).  |
| bool | **[isRunning](/lxmaster/api/classes/EcNetwork#function-isrunning)**() const<br>True once the cyclic thread is live, false after `[stop()](/lxmaster/api/classes/EcNetwork#function-stop)` or on failure.  |
| std::vector< [ecfacade::IoModule](/lxmaster/api/classes/IoModule) * > | **[ioModules](/lxmaster/api/classes/EcNetwork#function-iomodules)**() const<br>I/O modules in bus order (slaves whose profile exposes a digital/analog I/O interface).  |
| std::vector< [ecfacade::Encoder](/lxmaster/api/classes/Encoder) * > | **[encoders](/lxmaster/api/classes/EcNetwork#function-encoders)**() const<br>Encoders in bus order (slaves whose profile exposes an encoder interface).  |
| std::vector< [ecfacade::GenericDevice](/lxmaster/api/classes/GenericDevice) * > | **[devices](/lxmaster/api/classes/EcNetwork#function-devices)**() const<br>Every profile-carrying slave in bus order, as generic handles.  |
| [DcSyncStats](/lxmaster/api/classes/EcNetwork-DcSyncStats) | **[dcSyncStats](/lxmaster/api/classes/EcNetwork#function-dcsyncstats)**() const<br>Snapshot of DC-sync alignment quality (host cyclic wake vs reference-slave DC clock, the error before the PI controller corrects it).  |
| std::uint32_t | **[cycleTimeNs](/lxmaster/api/classes/EcNetwork#function-cycletimens)**() const<br>Cyclic period in ns, adopted from the ENI's `<Config><Cyclic><CycleTime>`.  |
| std::uint64_t | **[cycleCount](/lxmaster/api/classes/EcNetwork#function-cyclecount)**() const<br>Total cycles executed by the RT thread since `[start()](/lxmaster/api/classes/EcNetwork#function-start)`.  |
| std::vector< [ecfacade::Axis](/lxmaster/api/classes/Axis) * > | **[axes](/lxmaster/api/classes/EcNetwork#function-axes)**() const<br>Motion axes in bus order, one per slave whose auto-selected profile exposes a motion interface (e.g.  |
| | **[EcNetwork](/lxmaster/api/classes/EcNetwork#function-ecnetwork)**([NetworkConfig](/lxmaster/api/classes/NetworkConfig) cfg) |
| | **[EcNetwork](/lxmaster/api/classes/EcNetwork#function-ecnetwork)**(const [EcNetwork](/lxmaster/api/classes/EcNetwork) & ) =delete |

## Detailed Description

```cpp
class ecnet::EcNetwork;
```

User-facing runtime facade for an EtherCAT network. 

Owns the EtherCAT master, the cyclic RT thread, and the devices auto-created from the ENI. A typical program is:

[ecnet::NetworkConfig](/lxmaster/api/classes/NetworkConfig) cfg = [ecnet::NetworkConfig::defaults()](/lxmaster/api/classes/NetworkConfig#function-defaults); // iface from LXMASTER_RT_IFACE cfg.eni.eni_path = "network.eni.xml"; // required: ENI is the only setup mode and the // sole source of the cyclic period (CycleTime). [ecnet::EcNetwork](/lxmaster/api/classes/EcNetwork) net(cfg); if (!net.[start()](/lxmaster/api/classes/EcNetwork#function-start)) { std::cerr << net.lastError(); return 1; } auto axis = net.axes().front(); ... axis->moveTo(axis->actualPosition()); ... net.stop();

No backend types leak through this API. `[start()](/lxmaster/api/classes/EcNetwork#function-start)` loads + validates the ENI, verifies it against the scanned hardware, and creates one generic CiA402 device per slave.

Two-phase bring-up (per-axis configuration). Operating mode and fault policy are per-axis intent the application sets on each discovered drive before the bus is brought up. `[prepare()](/lxmaster/api/classes/EcNetwork#function-prepare)` runs the offline + PRE_OP phases so `[axes()](/lxmaster/api/classes/EcNetwork#function-axes)` becomes valid while the drives are still in PRE_OP and no mode has been committed; the application then configures each axis and calls `[start()](/lxmaster/api/classes/EcNetwork#function-start)` to finish:

[ecnet::EcNetwork](/lxmaster/api/classes/EcNetwork) net(cfg); if (!net.[prepare()](/lxmaster/api/classes/EcNetwork#function-prepare)) { std::cerr << net.lastError(); return 1; } for ([ecfacade::Axis](/lxmaster/api/classes/Axis)* ax : net.axes()) { ax->setDriveMode(ecdev::DriveOpMode::Cst); ax->configure(); } if (!net.[start()](/lxmaster/api/classes/EcNetwork#function-start)) { std::cerr << net.lastError(); return 1; }

`[start()](/lxmaster/api/classes/EcNetwork#function-start)` calls `[prepare()](/lxmaster/api/classes/EcNetwork#function-prepare)` itself when it has not run, so the single-call form above still works. 

## Public Functions Documentation

### function ~EcNetwork

```cpp
~EcNetwork()
```

### function syncTraceViolationCount

```cpp
std::uint64_t syncTraceViolationCount() const
```

Live violation tally while the cyclic thread is running (`sync_trace_window_ns` > 0). 

After `[stop()](/lxmaster/api/classes/EcNetwork#function-stop)`, prefer `[syncTraceReport()](/lxmaster/api/classes/EcNetwork#function-synctracereport).violation_count`. 

### function syncTraceReport

```cpp
inline SyncTraceReport syncTraceReport() const
```

Per-cycle DC-sync + host jitter capture from the last session (`NetworkConfig::sync_trace_capacity`). 

Populated when `[stop()](/lxmaster/api/classes/EcNetwork#function-stop)` joins the executor; empty if tracing was off or the bus never ran. 

### function syncMode

```cpp
SyncMode syncMode() const
```

Synchronization mode resolved from the ENI (DcSync0 when the bus carries a SYNC0 device, else SmEvent). 

Valid after `[prepare()](/lxmaster/api/classes/EcNetwork#function-prepare)` / `[start()](/lxmaster/api/classes/EcNetwork#function-start)`. Not an app input &ndash; the ENI decides. 

### function stop

```cpp
void stop()
```

Stop the cyclic thread and close the master. 

Safe to call multiple times. 

### function start

```cpp
bool start()
```

Phase 2 of bring-up (runs `[prepare()]()` first if it has not been called): per-device CoE configuration (commits each drive's operating mode to 0x6060), configures DC, reaches SAFE_OP + OPERATIONAL, and spawns the cyclic thread. 

Returns true on success; false + `[lastError()](/lxmaster/api/classes/EcNetwork#function-lasterror)` on failure. Failures at any step tear down what was initialized. 

### function reportDeviceStatus

```cpp
void reportDeviceStatus(
    std::ostream & os
) const
```

Print each device's exit status via `reportExitStatus` to `os`. 

Call after `[stop()](/lxmaster/api/classes/EcNetwork#function-stop)` to surface device-specific end-of-run diagnostics (e.g. final statusword, CiA402 fault code 0x603F). 

### function prepare

```cpp
bool prepare()
```

Phase 1 of bring-up: applies RT scheduling, loads + validates the ENI, opens the NIC, verifies the scanned hardware, reaches PRE_OP, and binds devices so that `[axes()]()` / `[ioModules()]()` / `[encoders()]()` become valid. 

Crucially it stops _before_ any per-device CoE configuration, so the application can set per-axis intent (e.g. `axis->setOperatingMode(...)`) on the discovered drives before the operating mode is committed to the drive in `[start()](/lxmaster/api/classes/EcNetwork#function-start)`. Returns true on success; false + `[lastError()](/lxmaster/api/classes/EcNetwork#function-lasterror)` on failure (which tears down what was initialized). Idempotent: a second call after success is a no-op success. Calling it after `[start()](/lxmaster/api/classes/EcNetwork#function-start)` is an error. 

### function operator=

```cpp
EcNetwork & operator=(
    const EcNetwork & 
) =delete
```

### function lastError

```cpp
std::string lastError() const
```

Last human-readable error captured from the library (thread-safe). 

Includes `[shutdown]` step failures accumulated during `[stop()](/lxmaster/api/classes/EcNetwork#function-stop)` after the cyclic thread has been joined. 

### function jitterStats

```cpp
JitterStats jitterStats() const
```

Snapshot of cycle-timing jitter (updated throughout the run; final at `[stop()](/lxmaster/api/classes/EcNetwork#function-stop)`). 

### function isRunning

```cpp
bool isRunning() const
```

True once the cyclic thread is live, false after `[stop()](/lxmaster/api/classes/EcNetwork#function-stop)` or on failure. 

### function ioModules

```cpp
std::vector< ecfacade::IoModule * > ioModules() const
```

I/O modules in bus order (slaves whose profile exposes a digital/analog I/O interface). 

### function encoders

```cpp
std::vector< ecfacade::Encoder * > encoders() const
```

Encoders in bus order (slaves whose profile exposes an encoder interface). 

### function devices

```cpp
std::vector< ecfacade::GenericDevice * > devices() const
```

Every profile-carrying slave in bus order, as generic handles. 

This is the complete set: a device that also exposes a typed capability appears in both its typed list (`[axes()](/lxmaster/api/classes/EcNetwork#function-axes)` etc.) and here. Use this for brand-new device classes that fit none of the typed contracts (e.g. an IMU): `configure()` the handle to bring it to OPERATIONAL and `deviceProfile()` to reach its custom profile API. Valid after a successful `[start()](/lxmaster/api/classes/EcNetwork#function-start)`; storage is owned by this `[EcNetwork](/lxmaster/api/classes/EcNetwork)`. 

### function dcSyncStats

```cpp
DcSyncStats dcSyncStats() const
```

Snapshot of DC-sync alignment quality (host cyclic wake vs reference-slave DC clock, the error before the PI controller corrects it). 

`samples == 0` outside DC-aligned mode. 

### function cycleTimeNs

```cpp
std::uint32_t cycleTimeNs() const
```

Cyclic period in ns, adopted from the ENI's `<Config><Cyclic><CycleTime>`. 

Valid (non-zero) after a successful `[start()](/lxmaster/api/classes/EcNetwork#function-start)`; 0 before the ENI is loaded. 

### function cycleCount

```cpp
std::uint64_t cycleCount() const
```

Total cycles executed by the RT thread since `[start()](/lxmaster/api/classes/EcNetwork#function-start)`. 

### function axes

```cpp
std::vector< ecfacade::Axis * > axes() const
```

Motion axes in bus order, one per slave whose auto-selected profile exposes a motion interface (e.g. 

CiA402 drives). Valid after a successful `[start()](/lxmaster/api/classes/EcNetwork#function-start)`; the storage is owned by this `[EcNetwork](/lxmaster/api/classes/EcNetwork)`. This is the high-level handle a PLC/application programmer uses (`[axes()](/lxmaster/api/classes/EcNetwork#function-axes)[0]->moveTo(...)`) &ndash; it never exposes CiA profiles, the ENI, or the backend. 

### function EcNetwork

```cpp
explicit EcNetwork(
    NetworkConfig cfg
)
```

### function EcNetwork

```cpp
EcNetwork(
    const EcNetwork & 
) =delete
```

-------------------------------

Updated on 2026-07-04 at 20:22:54 +0000