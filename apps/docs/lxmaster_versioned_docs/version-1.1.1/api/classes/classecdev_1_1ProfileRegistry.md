---
title: "ecdev::ProfileRegistry"
summary: "Registry of IProfileFactory plugins."

slug: /api/classes/ProfileRegistry
sidebar_label: "ProfileRegistry"
---

<!-- GENERATED - do not edit. Produced from the LXMASTER public headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->
# ecdev::ProfileRegistry



Registry of `IProfileFactory` plugins.  [More...](#detailed-description)


`#include <profile_registry.hpp>`

## Public Functions

|                | Name           |
| -------------- | -------------- |
| std::unique_ptr< [IDeviceProfile](/lxmaster/api/classes/IDeviceProfile) > | **[select](/lxmaster/api/classes/ProfileRegistry#function-select)**(const [ProfileSelectionInput](/lxmaster/api/classes/ProfileSelectionInput) & in) const<br>Select and construct the best-matching profile for a slave.  |
| std::unique_ptr< [IDeviceProfile](/lxmaster/api/classes/IDeviceProfile) > | **[select](/lxmaster/api/classes/ProfileRegistry#function-select)**(const [ProfileSelectionInput](/lxmaster/api/classes/ProfileSelectionInput) & in, const std::vector< std::shared_ptr< [IProfileFactory](/lxmaster/api/classes/IProfileFactory) > > & extra_factories) const<br>Like `select(in)`, but also considers app-supplied factories ahead of the built-ins.  |
| void | **[registerFactory](/lxmaster/api/classes/ProfileRegistry#function-registerfactory)**(std::unique_ptr< [IProfileFactory](/lxmaster/api/classes/IProfileFactory) > factory)<br>Add a factory to this registry.  |
| [ProfileRegistry](/lxmaster/api/classes/ProfileRegistry) & | **[builtin](/lxmaster/api/classes/ProfileRegistry#function-builtin)**()<br>The process-wide registry, populated by self-registering device-class TUs at static init.  |

## Detailed Description

```cpp
class ecdev::ProfileRegistry;
```

Registry of `IProfileFactory` plugins. 

`[select()](/lxmaster/api/classes/ProfileRegistry#function-select)` returns the best-claiming profile for a slave, or null when no factory claims it (the caller decides what an unmatched slave means).

The process-wide `[builtin](/lxmaster/api/classes/ProfileRegistry#function-builtin)` registry is populated entirely by self-registering device-class translation units (`LXMASTER_REGISTER_DEVICE`); there is no central list of built-in factories. 

## Public Functions Documentation

### function select

```cpp
std::unique_ptr< IDeviceProfile > select(
    const ProfileSelectionInput & in
) const
```

Select and construct the best-matching profile for a slave. 

**Parameters**: 

  * **in** Selection inputs including the ENI slave descriptor and default drive settings. 


**Return**: The constructed profile, or null when no factory claims the slave. 

Iterates all registered factories, picks the one with the highest `claim()` score, and calls its `create()`. 


### function select

```cpp
std::unique_ptr< IDeviceProfile > select(
    const ProfileSelectionInput & in,
    const std::vector< std::shared_ptr< IProfileFactory > > & extra_factories
) const
```

Like `select(in)`, but also considers app-supplied factories ahead of the built-ins. 

**Parameters**: 

  * **in** Selection inputs including the ENI slave descriptor and default drive settings. 
  * **extra_factories** App-supplied factories considered before the registered built-ins. 


**Return**: The constructed profile, or null when no factory claims the slave. 

Ties favour `extra_factories`, so an application can override a built-in for one run without static registration (e.g. via `NetworkConfig::extra_profile_factories`). 


### function registerFactory

```cpp
void registerFactory(
    std::unique_ptr< IProfileFactory > factory
)
```

Add a factory to this registry. 

**Parameters**: 

  * **factory** The factory to register; ownership is transferred to the registry. 


Factories are consulted in registration order; the highest `claim()` score wins. Called at static-init time by `LXMASTER_REGISTER_DEVICE`. 


### function builtin

```cpp
static ProfileRegistry & builtin()
```

The process-wide registry, populated by self-registering device-class TUs at static init. 

**Return**: Reference to the singleton built-in registry. 

-------------------------------

Updated on 2026-07-13 at 20:44:41 +0000