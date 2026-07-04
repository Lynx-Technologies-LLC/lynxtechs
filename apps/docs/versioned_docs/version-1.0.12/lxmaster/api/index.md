---
title: "LXMASTER API Reference"

---
<!-- GENERATED - do not edit. Produced from the LXMASTER public
     headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->

# LXMASTER API Reference



This is the user-facing C++ API reference for **LXMASTER**, the Linux EtherCAT master.

The reference is intentionally limited to the public API. Internal implementation - the EtherCAT backend, the DC-sync PI controller, the license subsystem, `detail::` namespaces, and everything under `src/` - is excluded by design and cannot appear here.



* [Application API](/lxmaster/api/modules/group_application_api) - for control applications (start here).
* [Device Extension API](/lxmaster/api/modules/group_device_extension_api) - for adding support for custom devices.

The public surface is defined by the headers installed by the project's CMake `install()` rules; this reference documents an explicit allowlist of those headers. 

-------------------------------

Updated on 2026-07-04 at 20:22:54 +0000
