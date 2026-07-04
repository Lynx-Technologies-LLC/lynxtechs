---
title: ecdev::IProfileFactory
summary: Builds the device-class profile for one slave. 

slug: /lxmaster/api/classes/IProfileFactory
sidebar_label: "IProfileFactory"
---
<!-- GENERATED - do not edit. Produced from the LXMASTER public
     headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->

# ecdev::IProfileFactory



Builds the device-class profile for one slave.  [More...](#detailed-description)


`#include <profile_registry.hpp>`

## Public Functions

|                | Name           |
| -------------- | -------------- |
| virtual | **[~IProfileFactory](/lxmaster/api/classes/IProfileFactory#function-~iprofilefactory)**() =default |
| virtual const char * | **[name](/lxmaster/api/classes/IProfileFactory#function-name)**() const =0 |
| virtual std::unique_ptr< [IDeviceProfile](/lxmaster/api/classes/IDeviceProfile) > | **[create](/lxmaster/api/classes/IProfileFactory#function-create)**(const [ProfileSelectionInput](/lxmaster/api/classes/ProfileSelectionInput) & in) const =0 |
| virtual int | **[claim](/lxmaster/api/classes/IProfileFactory#function-claim)**(const eni::SlaveConfig & slave) const =0<br>Claim strength for `slave`: `claim_score::kNone` = does not handle this slave; a positive value = this factory serves the slave (see `[claim_score](/lxmaster/api/namespaces/ecdev-claim_score)`).  |

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


### function create

```cpp
virtual std::unique_ptr< IDeviceProfile > create(
    const ProfileSelectionInput & in
) const =0
```


### function claim

```cpp
virtual int claim(
    const eni::SlaveConfig & slave
) const =0
```

Claim strength for `slave`: `claim_score::kNone` = does not handle this slave; a positive value = this factory serves the slave (see `[claim_score](/lxmaster/api/namespaces/ecdev-claim_score)`). 

The registry picks the highest-claiming factory (deterministic by registration order on ties). 


-------------------------------

Updated on 2026-07-04 at 20:22:54 +0000