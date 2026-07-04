<!-- GENERATED - do not edit. Produced from the LXMASTER public
     headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->
---
title: ecdev::ProfileRegistry
summary: Registry of IProfileFactory plugins. 

---

# ecdev::ProfileRegistry



Registry of `[IProfileFactory]()` plugins.  [More...](#detailed-description)


`#include <profile_registry.hpp>`

## Public Functions

|                | Name           |
| -------------- | -------------- |
| std::unique_ptr< [IDeviceProfile](/lxmaster/api/classes/classecdev_1_1ideviceprofile) > | **[select](/lxmaster/api/classes/classecdev_1_1profileregistry#function-select)**(const [ProfileSelectionInput](/lxmaster/api/classes/structecdev_1_1profileselectioninput) & in) const |
| std::unique_ptr< [IDeviceProfile](/lxmaster/api/classes/classecdev_1_1ideviceprofile) > | **[select](/lxmaster/api/classes/classecdev_1_1profileregistry#function-select)**(const [ProfileSelectionInput](/lxmaster/api/classes/structecdev_1_1profileselectioninput) & in, const std::vector< std::shared_ptr< [IProfileFactory](/lxmaster/api/classes/classecdev_1_1iprofilefactory) > > & extra_factories) const<br>Like `select(in)`, but also considers app-supplied factories (e.g.  |
| void | **[registerFactory](/lxmaster/api/classes/classecdev_1_1profileregistry#function-registerfactory)**(std::unique_ptr< [IProfileFactory](/lxmaster/api/classes/classecdev_1_1iprofilefactory) > factory) |
| [ProfileRegistry](/lxmaster/api/classes/classecdev_1_1profileregistry) & | **[builtin](/lxmaster/api/classes/classecdev_1_1profileregistry#function-builtin)**()<br>The process-wide registry, populated by self-registering device-class TUs at static init.  |

## Detailed Description

```cpp
class ecdev::ProfileRegistry;
```

Registry of `[IProfileFactory]()` plugins. 

`select()` returns the best-claiming profile for a slave, or null when no factory claims it (the caller decides what an unmatched slave means).

The process-wide `[builtin](/lxmaster/api/classes/classecdev_1_1profileregistry#function-builtin)` registry is populated entirely by self-registering device-class translation units (`LXMASTER_REGISTER_DEVICE`); there is no central list of built-in factories. 

## Public Functions Documentation

### function select

```cpp
std::unique_ptr< IDeviceProfile > select(
    const ProfileSelectionInput & in
) const
```


### function select

```cpp
std::unique_ptr< IDeviceProfile > select(
    const ProfileSelectionInput & in,
    const std::vector< std::shared_ptr< IProfileFactory > > & extra_factories
) const
```

Like `select(in)`, but also considers app-supplied factories (e.g. 

`NetworkConfig::extra_profile_factories`) ahead of the built-ins, so an application can bind a device class for one run without static registration. Ties favour `extra_factories`. 


### function registerFactory

```cpp
void registerFactory(
    std::unique_ptr< IProfileFactory > factory
)
```


### function builtin

```cpp
static ProfileRegistry & builtin()
```

The process-wide registry, populated by self-registering device-class TUs at static init. 

-------------------------------

Updated on 2026-07-04 at 20:22:54 +0000