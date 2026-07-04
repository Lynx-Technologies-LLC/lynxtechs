---
sidebar_position: 1
title: API Reference
---

<!-- GENERATED CONTENT. This folder is populated at build time by
     scripts/sync-api.mjs, which downloads the versioned API-reference Markdown
     artifact produced by the lxmaster repository's release CI. Do not hand-edit. -->

# LXMASTER API Reference

The C++ API reference is **generated from the public LXMASTER headers** using
Doxygen and published as a versioned artifact from the `lxmaster` repository.

Only the **user-facing API** is documented here. The generator runs against an
explicit allowlist of installed public headers with `EXTRACT_PRIVATE=NO`, and
excludes all internal implementation (`libs/*/src`, the EtherCAT backend, the
license subsystem, and `detail::` namespaces). Internal symbols cannot appear in
this reference.

The public surface is organized in tiers:

- **Application API** - the umbrella header `#include <lxmaster/lxmaster.hpp>`:
  `EcNetwork`, `NetworkConfig`, `Axis`, `IoModule`, `Encoder`, and the fault /
  diagnostic types.
- **Device extension API** - for adding support for custom drives and I/O:
  `IDeviceProfile`, the `LXMASTER_REGISTER_DEVICE` macro, and related types.

:::info Generated at release time
Until the first API artifact is downloaded, this is placeholder content. The
generated reference pages are added automatically during the docs build for the
selected LXMASTER version.
:::
