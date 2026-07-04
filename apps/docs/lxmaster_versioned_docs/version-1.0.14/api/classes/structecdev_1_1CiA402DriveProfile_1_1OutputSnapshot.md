---
title: "ecdev::CiA402DriveProfile::OutputSnapshot"

slug: /api/classes/CiA402DriveProfile-OutputSnapshot
sidebar_label: "OutputSnapshot"
---

<!-- GENERATED - do not edit. Produced from the LXMASTER public headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->
# ecdev::CiA402DriveProfile::OutputSnapshot





## Public Attributes

|                | Name           |
| -------------- | -------------- |
| std::atomic< std::int32_t > | **[target_velocity](/lxmaster/api/classes/CiA402DriveProfile-OutputSnapshot#variable-target-velocity)**  |
| std::atomic< std::int32_t > | **[target_torque](/lxmaster/api/classes/CiA402DriveProfile-OutputSnapshot#variable-target-torque)**  |
| std::atomic< std::int32_t > | **[target_position](/lxmaster/api/classes/CiA402DriveProfile-OutputSnapshot#variable-target-position)**  |
| std::atomic< bool > | **[request_fault_reset](/lxmaster/api/classes/CiA402DriveProfile-OutputSnapshot#variable-request-fault-reset)**  |
| std::atomic< bool > | **[request_disable](/lxmaster/api/classes/CiA402DriveProfile-OutputSnapshot#variable-request-disable)**  |
| std::atomic< bool > | **[have_target_position](/lxmaster/api/classes/CiA402DriveProfile-OutputSnapshot#variable-have-target-position)**  |
| std::atomic< DriveOpMode > | **[desired_mode](/lxmaster/api/classes/CiA402DriveProfile-OutputSnapshot#variable-desired-mode)** <br>Live operating-mode request (PDO mode control).  |

## Public Attributes Documentation

### variable target_velocity

```cpp
std::atomic< std::int32_t > target_velocity {0};
```


### variable target_torque

```cpp
std::atomic< std::int32_t > target_torque {0};
```


### variable target_position

```cpp
std::atomic< std::int32_t > target_position {0};
```


### variable request_fault_reset

```cpp
std::atomic< bool > request_fault_reset {false};
```


### variable request_disable

```cpp
std::atomic< bool > request_disable {false};
```


### variable have_target_position

```cpp
std::atomic< bool > have_target_position {false};
```


### variable desired_mode

```cpp
std::atomic< DriveOpMode > desired_mode {DriveOpMode::Csp};
```

Live operating-mode request (PDO mode control). 

Seeded from Config::op_mode in the ctor. 


-------------------------------

Updated on 2026-07-04 at 23:28:44 +0000