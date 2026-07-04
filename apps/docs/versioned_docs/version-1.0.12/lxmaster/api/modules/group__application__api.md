---
title: "Application API"
summary: "The API used by control applications."

slug: /lxmaster/api/modules/group_application_api
sidebar_label: "Application API"
---
<!-- GENERATED - do not edit. Produced from the LXMASTER public
     headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->

# Application API

The API used by control applications.  [More...](#detailed-description)

## Detailed Description

The API used by control applications. 

Consume the whole library through the single umbrella header and the flat `lxmaster::` namespace:



```cpp
#include <lxmaster/lxmaster.hpp>

lxmaster::NetworkConfig cfg = lxmaster::NetworkConfig::defaults();
lxmaster::EcNetwork net(cfg);
net.start();
```

Core types: `EcNetwork`, `NetworkConfig`, and the device handles `Axis`, `IoModule`, `Encoder`, `GenericDevice`, plus the fault and diagnostic types. 






-------------------------------

Updated on 2026-07-04 at 20:22:54 +0000