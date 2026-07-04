---
title: "ecnet::BusFault"
summary: "Structured description of a cyclic-bus fault, built when the cycle-health watchdog trips (see NetworkConfig::watchdog_low_wkc_cycles)."

slug: /api/classes/BusFault
sidebar_label: "BusFault"
---
<!-- GENERATED - do not edit. Produced from the LXMASTER public
     headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->

# ecnet::BusFault

Structured description of a cyclic-bus fault, built when the cycle-health watchdog trips (see `NetworkConfig::watchdog_low_wkc_cycles`).  [More...](#detailed-description)

`#include <bus_fault.hpp>`

## Public Attributes

|                | Name           |
| -------------- | -------------- |
| int | **[wkc](/lxmaster/api/classes/BusFault#variable-wkc)** <br>Work counter observed on the tripping cycle and the expected value.  |
| bool | **[occurred](/lxmaster/api/classes/BusFault#variable-occurred)** <br>True when a fault was detected and this struct is meaningful.  |
| std::vector< [LostSlave](/lxmaster/api/classes/LostSlave) > | **[lost_slaves](/lxmaster/api/classes/BusFault#variable-lost-slaves)** <br>Slaves that stopped responding (downstream of the break).  |
| int | **[expected_wkc](/lxmaster/api/classes/BusFault#variable-expected-wkc)**  |
| std::string | **[description](/lxmaster/api/classes/BusFault#variable-description)** <br>Pre-rendered human-readable summary so simple apps can just print it.  |
| std::string | **[break_slave_name](/lxmaster/api/classes/BusFault#variable-break-slave-name)** <br>SII/ENI name of `break_slave` (empty when `break_slave == 0`).  |
| int | **[break_slave](/lxmaster/api/classes/BusFault#variable-break-slave)** <br>1-based bus index of the still-responding slave whose downstream port dropped its link.  |
| int | **[break_port](/lxmaster/api/classes/BusFault#variable-break-port)** <br>ESC port index (0-3) on `break_slave` whose link dropped, or -1 if unknown.  |

## Detailed Description

```cpp
struct ecnet::BusFault;
```

Structured description of a cyclic-bus fault, built when the cycle-health watchdog trips (see `NetworkConfig::watchdog_low_wkc_cycles`). 

Delivered to the application through the optional `[NetworkConfig::on_bus_fault](/lxmaster/api/classes/NetworkConfig#variable-on-bus-fault)` callback and also used by lxmaster to render the default `lastError()` / `reportDeviceStatus()` text.

The break point is reconstructed from the standard DL-status register (0x0110): the still-responding slave whose previously-active port lost its link is the upstream side of the cable break, and `lost_slaves` are the devices that went silent behind it. 

## Public Attributes Documentation

### variable wkc

```cpp
int wkc {0};
```

Work counter observed on the tripping cycle and the expected value. 

### variable occurred

```cpp
bool occurred {false};
```

True when a fault was detected and this struct is meaningful. 

### variable lost_slaves

```cpp
std::vector< LostSlave > lost_slaves;
```

Slaves that stopped responding (downstream of the break). 

### variable expected_wkc

```cpp
int expected_wkc {0};
```

### variable description

```cpp
std::string description;
```

Pre-rendered human-readable summary so simple apps can just print it. 

### variable break_slave_name

```cpp
std::string break_slave_name;
```

SII/ENI name of `break_slave` (empty when `break_slave == 0`). 

### variable break_slave

```cpp
int break_slave {0};
```

1-based bus index of the still-responding slave whose downstream port dropped its link. 

0 means no responder showed a dropped port (break at the master / first link). 

### variable break_port

```cpp
int break_port {-1};
```

ESC port index (0-3) on `break_slave` whose link dropped, or -1 if unknown. 

-------------------------------

Updated on 2026-07-04 at 20:22:54 +0000