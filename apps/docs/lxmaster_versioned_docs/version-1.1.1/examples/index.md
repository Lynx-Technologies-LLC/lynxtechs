---
sidebar_position: 1
title: Example Projects
---

<!-- GENERATED CONTENT BELOW IS REPLACED BY scripts/sync-examples.mjs AT BUILD TIME.
     Do not hand-edit example pages: edit the source in the lxmaster-demos repo. -->

# LXMASTER Example Projects

Each example is a standalone project that builds against the **installed**
LXMASTER package, exactly as a downstream consumer would:

```cmake
find_package(lxmaster CONFIG REQUIRED)
target_link_libraries(my_app PRIVATE lxmaster::lxmaster)
```

```cpp
#include <lxmaster/lxmaster.hpp>
```

:::info Content synced from `lxmaster-demos`
The individual example pages are generated at build time by syncing from the
`lxmaster-demos` repository. The list below reflects the current set of demos.
:::

## Available demos

- `custom_profile_demo`
- `imu_demo`
- `do_shift_demo`
- `servo_sin_demo`
- `servo_sin_vel_demo`
- `servo_sin_torque_demo`
- `servo_mode_sweep_demo`
- `sine_shift_demo`
