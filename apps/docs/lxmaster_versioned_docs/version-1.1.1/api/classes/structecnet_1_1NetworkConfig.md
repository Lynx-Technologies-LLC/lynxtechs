---
title: "ecnet::NetworkConfig"
summary: "User-facing configuration for an EcNetwork."

slug: /api/classes/NetworkConfig
sidebar_label: "NetworkConfig"
---

<!-- GENERATED - do not edit. Produced from the LXMASTER public headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->
# ecnet::NetworkConfig



User-facing configuration for an EcNetwork.  [More...](#detailed-description)


`#include <network_config.hpp>`

## Public Functions

|                | Name           |
| -------------- | -------------- |
| [NetworkConfig](/lxmaster/api/classes/NetworkConfig) | **[defaults](/lxmaster/api/classes/NetworkConfig#function-defaults)**()<br>Network defaults (DC-sync PI kp_div=3, ki_div=20).  |

## Public Attributes

|                | Name           |
| -------------- | -------------- |
| int | **[watchdog_low_wkc_cycles](/lxmaster/api/classes/NetworkConfig#variable-watchdog-low-wkc-cycles)** <br>Number of consecutive cycles with a low work-counter (below expected) before the cycle-health watchdog trips and raises a `BusFault`.  |
| ecmaster::Timeouts | **[timeouts](/lxmaster/api/classes/NetworkConfig#variable-timeouts)** <br>Backend protocol timeouts / retries (microseconds).  |
| ShutdownConfig | **[shutdown](/lxmaster/api/classes/NetworkConfig#variable-shutdown)**  |
| RtConfig | **[rt](/lxmaster/api/classes/NetworkConfig#variable-rt)**  |
| int | **[op_entry_cooldown_cycles](/lxmaster/api/classes/NetworkConfig#variable-op-entry-cooldown-cycles)** <br>Number of RT cycles to hold in the `Cooldown` phase after the master requests OPERATIONAL, before the executor starts processing normal motion commands.  |
| std::function< void()> | **[on_session_expiry](/lxmaster/api/classes/NetworkConfig#variable-on-session-expiry)** <br>Optional developer-session expiry notification.  |
| std::function< void(const [BusFault](/lxmaster/api/classes/BusFault) &)> | **[on_bus_fault](/lxmaster/api/classes/NetworkConfig#variable-on-bus-fault)** <br>Optional bus-fault notification.  |
| constexpr std::int32_t | **[kDcSyncBusyWaitAuto](/lxmaster/api/classes/NetworkConfig#variable-kdcsyncbusywaitauto)**  |
| std::vector< std::shared_ptr< [ecdev::IProfileFactory](/lxmaster/api/classes/IProfileFactory) > > | **[extra_profile_factories](/lxmaster/api/classes/NetworkConfig#variable-extra-profile-factories)** <br>App-supplied device classes, considered ahead of the self-registered built-ins when classifying each ENI slave (see `ecdev::ProfileRegistry::select`).  |
| EniConfig | **[eni](/lxmaster/api/classes/NetworkConfig#variable-eni)**  |
| DebugConfig | **[debug](/lxmaster/api/classes/NetworkConfig#variable-debug)**  |
| DcConfig | **[dc](/lxmaster/api/classes/NetworkConfig#variable-dc)**  |
| BusConfig | **[bus](/lxmaster/api/classes/NetworkConfig#variable-bus)**  |

## Detailed Description

```cpp
struct ecnet::NetworkConfig;
```

User-facing configuration for an EcNetwork. 

Bus timing, DC, RT scheduling, and shutdown policy live here; drive-specific PDO/FSM options live on `CiA402Config` / vendor configs.

Deployment RT overrides: `scripts/rt/README.md`. 

## Public Functions Documentation

### function defaults

```cpp
static NetworkConfig defaults()
```

Network defaults (DC-sync PI kp_div=3, ki_div=20). 

The cyclic period is left unset (`bus.cycle_ns == 0`) and the sync mode is decided by the ENI in `EcNetwork::loadAndValidateEni`; the PI tuning here is inert when the ENI resolves to the SM event. There is no app-layer DC-vs-SM choice.

Host-side params are read here from the per-host `LXMASTER_*` environment (published by `/etc/profile.d/lxmaster-config.sh`; see `scripts/rt/README.md`), so the effective precedence is built-in default < ENV. The set covers the DC-sync PI knobs (kp_div, ki_div, dc_sync_busy_wait_ns, dc_lock_warmup_cycles, ec_sync_to_dc), the OP-entry DC gate (dc_diff_op_gate_max_ns / _stable_cycles / _timeout_cycles) and op_entry_cooldown_cycles, the RT scheduling identity (rt.cpu_affinity, rt.rt_priority, rt.enable_rt_scheduling), the EtherCAT interface name (`LXMASTER_RT_IFACE` -> `bus.ifname`), and the backend protocol timeouts/retries (`LXMASTER_TIMEOUT_*`/`LXMASTER_RETRIES`->`timeouts.*`). Missing vars warn once and keep the built-in default (RT_ENABLE and the timeout knobs are silent opt-outs). 


## Public Attributes Documentation

### variable watchdog_low_wkc_cycles

```cpp
int watchdog_low_wkc_cycles {100};
```

Number of consecutive cycles with a low work-counter (below expected) before the cycle-health watchdog trips and raises a `BusFault`. 

Increase for buses that tolerate occasional WKC drops without a real cable fault; decrease for faster fault detection. 


### variable timeouts

```cpp
ecmaster::Timeouts timeouts;
```

Backend protocol timeouts / retries (microseconds). 

Defaults from the backend baseline; overridable via `LXMASTER_TIMEOUT_*` / `LXMASTER_RETRIES`. Pushed to the backend before `init()` (honored on a best-effort basis depending on the active backend). 


### variable shutdown

```cpp
ShutdownConfig shutdown;
```


### variable rt

```cpp
RtConfig rt;
```


### variable op_entry_cooldown_cycles

```cpp
int op_entry_cooldown_cycles {8};
```

Number of RT cycles to hold in the `Cooldown` phase after the master requests OPERATIONAL, before the executor starts processing normal motion commands. 

Gives drives time to settle their internal control loops after the OP transition. 


### variable on_session_expiry

```cpp
std::function< void()> on_session_expiry;
```

Optional developer-session expiry notification. 

Invoked once when the 12-hour floating-seat deadline is reached (only active on floating-seat / developer session types).

Delivery: called on a dedicated, non-RT, non-CPU-affinitised watcher thread that blocks on a `condition_variable::wait_until` (zero CPU during the run). The handler must NOT call `[EcNetwork::stop()](/lxmaster/api/classes/EcNetwork#function-stop)` directly (that would deadlock on the watcher thread's own join). Instead, set a flag that the main loop polls — for example: 

```cpp
cfg.on_session_expiry = []{ apps_common::interruptFlag().store(true,
                                std::memory_order_release); };
```

 The main loop `while (net.isRunning() && !interrupted())` then exits and calls `net.stop()`. Leave empty to opt out; the session deadline is still enforced (the watcher fires but the callback is skipped — the RT thread continues until the main loop exits by another means). 


### variable on_bus_fault

```cpp
std::function< void(const BusFault &)> on_bus_fault;
```

Optional bus-fault notification. 

Invoked exactly once when the cycle-health watchdog trips (a slave dropped out / cable unplugged / frames corrupted), carrying a structured `[BusFault](/lxmaster/api/classes/BusFault)` that pinpoints the break (upstream slave + ESC port) and lists the slaves that went silent.

Delivery: called on a detached helper thread (NOT the RT cyclic thread), so the handler may do non-RT work and may safely call `[EcNetwork::stop()](/lxmaster/api/classes/EcNetwork#function-stop)`. Because it runs detached, anything the handler captures by reference must outlive the network. Leave empty to opt out; lxmaster still renders the fault in `lastError()` / `reportDeviceStatus()`. 


### variable kDcSyncBusyWaitAuto

```cpp
static constexpr std::int32_t kDcSyncBusyWaitAuto = ecnet::kDcSyncBusyWaitAuto;
```


### variable extra_profile_factories

```cpp
std::vector< std::shared_ptr< ecdev::IProfileFactory > > extra_profile_factories;
```

App-supplied device classes, considered ahead of the self-registered built-ins when classifying each ENI slave (see `ecdev::ProfileRegistry::select`). 

Use this to bind a device identity for a single run without static registration &ndash; e.g. `cfg.extra_profile_factories.push_back(ecdev::makeIdentityProfileFactory({vendor, product}, makeMyProfile, "my-device"));`. `shared_ptr` keeps `[NetworkConfig](/lxmaster/api/classes/NetworkConfig)` copyable. The durable path for a new device is still a self-registering file (LXMASTER_REGISTER_DEVICE). 


### variable eni

```cpp
EniConfig eni;
```


### variable debug

```cpp
DebugConfig debug;
```


### variable dc

```cpp
DcConfig dc;
```


### variable bus

```cpp
BusConfig bus;
```


-------------------------------

Updated on 2026-07-13 at 20:44:41 +0000