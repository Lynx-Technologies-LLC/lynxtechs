---
title: "ecnet::EcNetwork::SlaveSnapshot"
summary: "Snapshot of each slave's EtherCAT state + AL-status code taken while the master is still open (the last thing stop() does before master_->close())."

slug: /api/classes/EcNetwork-SlaveSnapshot
sidebar_label: "SlaveSnapshot"
---
<!-- GENERATED - do not edit. Produced from the LXMASTER public
     headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->

# ecnet::EcNetwork::SlaveSnapshot

Snapshot of each slave's EtherCAT state + AL-status code taken while the master is still open (the last thing `[stop()](/lxmaster/api/classes/EcNetwork#function-stop)` does before `master_->close()`).  [More...](#detailed-description)

## Public Attributes

|                | Name           |
| -------------- | -------------- |
| bool | **[valid](/lxmaster/api/classes/EcNetwork-SlaveSnapshot#variable-valid)**  |
| std::uint16_t | **[state](/lxmaster/api/classes/EcNetwork-SlaveSnapshot#variable-state)**  |
| bool | **[is_lost](/lxmaster/api/classes/EcNetwork-SlaveSnapshot#variable-is-lost)**  |
| std::uint16_t | **[al_statuscode](/lxmaster/api/classes/EcNetwork-SlaveSnapshot#variable-al-statuscode)**  |

## Detailed Description

```cpp
struct ecnet::EcNetwork::SlaveSnapshot;
```

Snapshot of each slave's EtherCAT state + AL-status code taken while the master is still open (the last thing `[stop()](/lxmaster/api/classes/EcNetwork#function-stop)` does before `master_->close()`). 

`[reportDeviceStatus()](/lxmaster/api/classes/EcNetwork#function-reportdevicestatus)` prints from this so the operator sees what the bus actually looked like at shutdown instead of the zeroed slave table you get after the NIC socket is closed. Index 0 is unused to match the backend's 1-based slave numbering. 

## Public Attributes Documentation

### variable valid

```cpp
bool valid {false};
```

### variable state

```cpp
std::uint16_t state {0};
```

### variable is_lost

```cpp
bool is_lost {false};
```

### variable al_statuscode

```cpp
std::uint16_t al_statuscode {0};
```

-------------------------------

Updated on 2026-07-04 at 20:22:54 +0000