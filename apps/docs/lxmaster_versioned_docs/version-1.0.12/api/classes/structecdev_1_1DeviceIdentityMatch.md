---
title: "ecdev::DeviceIdentityMatch"
summary: "Exact device identity a device class serves."

slug: /api/classes/DeviceIdentityMatch
sidebar_label: "DeviceIdentityMatch"
---
<!-- GENERATED - do not edit. Produced from the LXMASTER public
     headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->

# ecdev::DeviceIdentityMatch

Exact device identity a device class serves.  [More...](#detailed-description)

`#include <identity_profile.hpp>`

## Public Functions

|                | Name           |
| -------------- | -------------- |
| bool | **[matches](/lxmaster/api/classes/DeviceIdentityMatch#function-matches)**(const eni::SlaveConfig & slave) const |

## Public Attributes

|                | Name           |
| -------------- | -------------- |
| std::uint32_t | **[vendor_id](/lxmaster/api/classes/DeviceIdentityMatch#variable-vendor-id)**  |
| std::uint32_t | **[revision_min](/lxmaster/api/classes/DeviceIdentityMatch#variable-revision-min)** <br>0 = no lower bound.  |
| std::uint32_t | **[revision_max](/lxmaster/api/classes/DeviceIdentityMatch#variable-revision-max)** <br>0 = no upper bound (any revision).  |
| std::uint32_t | **[product_code](/lxmaster/api/classes/DeviceIdentityMatch#variable-product-code)**  |

## Detailed Description

```cpp
struct ecdev::DeviceIdentityMatch;
```

Exact device identity a device class serves. 

Matching is explicit: a slave matches only when its `vendor_id` and `product_code` are equal and (when bounded) its `revision` falls in the inclusive `[revision_min, revision_max]` window. A bound of 0 means "unbounded on that side", so the common `{vendor, product}` form matches every revision. 

## Public Functions Documentation

### function matches

```cpp
bool matches(
    const eni::SlaveConfig & slave
) const
```

## Public Attributes Documentation

### variable vendor_id

```cpp
std::uint32_t vendor_id {0};
```

### variable revision_min

```cpp
std::uint32_t revision_min {0};
```

0 = no lower bound. 

### variable revision_max

```cpp
std::uint32_t revision_max {0};
```

0 = no upper bound (any revision). 

### variable product_code

```cpp
std::uint32_t product_code {0};
```

-------------------------------

Updated on 2026-07-04 at 20:22:54 +0000