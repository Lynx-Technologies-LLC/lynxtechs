---
title: libs/devices/include/devices/device_registration.hpp

slug: /lxmaster/api/files/device_registration_8hpp
sidebar_label: "libs/devices/include/devices/device_registration.hpp"
---
<!-- GENERATED - do not edit. Produced from the LXMASTER public
     headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->

# libs/devices/include/devices/device_registration.hpp



## Defines

|                | Name           |
| -------------- | -------------- |
|  | **[LXMASTER_REGISTER_DEVICE](/lxmaster/api/files/device_registration_8hpp#define-lxmaster-register-device)**(tag, factory_expr) <br>Register a device class into the process-wide `[ecdev::ProfileRegistry::builtin](/lxmaster/api/classes/ProfileRegistry#function-builtin)` registry at static-initialization time.  |




## Macros Documentation

### define LXMASTER_REGISTER_DEVICE

```cpp
#define LXMASTER_REGISTER_DEVICE(
    tag,
    factory_expr
)
  namespace {                                                              \
  const bool lxmaster_dev_registered_##tag = [] {                           \
    ::ecdev::ProfileRegistry::builtin().registerFactory((factory_expr));   \
    return true;                                                           \
  }();                                                                     \
  }
```

Register a device class into the process-wide `[ecdev::ProfileRegistry::builtin](/lxmaster/api/classes/ProfileRegistry#function-builtin)` registry at static-initialization time. 

`tag` is a unique identifier within the translation unit (used to name the internal-linkage registrar); `factory_expr` is an expression yielding a `std::unique_ptr<[ecdev::IProfileFactory](/lxmaster/api/classes/IProfileFactory)>` (typically `ecdev::makeIdentityProfileFactory(...)`).

Usage (one per device file): LXMASTER_REGISTER_DEVICE(a6, ecdev::makeIdentityProfileFactory({0x00400000, 0x0715}, ecdev::makeCiA402DriveProfile, "cia402:stepperonline-a6"));

IMPORTANT (linker): a self-registering TU is referenced by nothing, so a static library will drop it (and its registrar) unless the consuming target links the device library whole-archive (`-Wl,--whole-archive` / CMake `$<LINK_LIBRARY:WHOLE_ARCHIVE,...>`). The in-tree apps and the merged liblxmaster.so do this; an external device-support library must do the same. 




-------------------------------

Updated on 2026-07-04 at 20:22:54 +0000
