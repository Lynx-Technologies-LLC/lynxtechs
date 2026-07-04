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
The example catalog on this page is generated at build time from the
[`lxmaster-demos`](https://github.com/Lynx-Robotics-LLC/lxmaster-demos)
repository. Until the first sync runs, this is placeholder content.
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
