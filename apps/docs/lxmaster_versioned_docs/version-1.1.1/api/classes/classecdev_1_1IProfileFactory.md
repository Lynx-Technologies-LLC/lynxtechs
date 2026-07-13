---
title: "ecdev::IProfileFactory"
summary: "Builds the device-class profile for one slave."

slug: /api/classes/IProfileFactory
sidebar_label: "IProfileFactory"
---

<!-- GENERATED - do not edit. Produced from the LXMASTER public headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->
# ecdev::IProfileFactory



Builds the device-class profile for one slave.  [More...](#detailed-description)


`#include <profile_registry.hpp>`

## Public Functions

|                | Name           |
| -------------- | -------------- |
| virtual | **[~IProfileFactory](/lxmaster/api/classes/IProfileFactory#function-~iprofilefactory)**() =default |
| virtual const char * | **[name](/lxmaster/api/classes/IProfileFactory#function-name)**() const =0<br>Stable diagnostic name for this factory (e.g.  |
| virtual std::unique_ptr< [IDeviceProfile](/lxmaster/api/classes/IDeviceProfile) > | **[create](/lxmaster/api/classes/IProfileFactory#function-create)**(const [ProfileSelectionInput](/lxmaster/api/classes/ProfileSelectionInput) & in) const =0<br>Construct and return the profile for the given slave.  |
| virtual int | **[claim](/lxmaster/api/classes/IProfileFactory#function-claim)**(const eni::SlaveConfig & slave) const =0<br>Determine whether this factory handles the given slave and how strongly it claims it.  |

## Detailed Description

```cpp
class ecdev::IProfileFactory;
```

Builds the device-class profile for one slave. 

A new device class is supported by adding a new factory (typically via `[makeIdentityProfileFactory]` + `LXMASTER_REGISTER_DEVICE`); the generic device and orchestration layer never change. 

## Public Functions Documentation

### function ~IProfileFactory

```cpp
virtual ~IProfileFactory() =default
```


### function name

```cpp
virtual const char * name() const =0
```

Stable diagnostic name for this factory (e.g. 

**Return**: A null-terminated string literal identifying this factory. 

`"cia402:vendor-model"`). Used in log messages and error strings; must outlive the factory object (a string literal in practice). 


### function create

```cpp
virtual std::unique_ptr< IDeviceProfile > create(
    const ProfileSelectionInput & in
) const =0
```

Construct and return the profile for the given slave. 

**Parameters**: 

  * **in** Selection inputs including the ENI slave descriptor and default drive settings. 


**Return**: The constructed profile, or null to pin the slave as passive (no facade handle). 

Called only when `[claim()](/lxmaster/api/classes/IProfileFactory#function-claim)` returned a positive score for this slave. 


### function claim

```cpp
virtual int claim(
    const eni::SlaveConfig & slave
) const =0
```

Determine whether this factory handles the given slave and how strongly it claims it. 

**Parameters**: 

  * **slave** ENI slave descriptor to inspect (identity, PDO objects, CANopen profile number). 


**Return**: `claim_score::kNone` (0) if this factory does not handle this slave; a positive `claim_score` value if it does — higher scores win over lower ones. 

The registry picks the highest-claiming factory (deterministic by registration order on ties). 


-------------------------------

Updated on 2026-07-13 at 20:44:41 +0000