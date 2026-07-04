<!-- GENERATED - do not edit. Produced from the LXMASTER public
     headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->
---
title: ecdev::claim_score
summary: Claim-score tiers for IProfileFactory::claim. 

---

# ecdev::claim_score

Claim-score tiers for `[IProfileFactory::claim]()`.  [More...](#detailed-description)

## Attributes

|                | Name           |
| -------------- | -------------- |
| constexpr int | **[kProfileFamily](/lxmaster/api/namespaces/namespaceecdev_1_1claim__score#variable-kprofilefamily)** <br>CANopen ProfileNo family fallback (no identity match).  |
| constexpr int | **[kNone](/lxmaster/api/namespaces/namespaceecdev_1_1claim__score#variable-knone)**  |
| constexpr int | **[kIdentityPin](/lxmaster/api/namespaces/namespaceecdev_1_1claim__score#variable-kidentitypin)** <br>Identity-matched device class (highest priority).  |

## Detailed Description

Claim-score tiers for `[IProfileFactory::claim]()`. 

Classification is explicit, in priority order: a device class that matches a precise `vendor_id`/`product_code` identity returns `kIdentityPin` and always wins; failing that, the family fallback claims by the slave's CANopen `profile_no` (402/401/406) at `kProfileFamily`. Anything that claims neither is left to the caller (unmatched PDO-mapping slaves are a hard error). Tiers are spaced to leave headroom for future bands. 



## Attributes Documentation

### variable kProfileFamily

```cpp
constexpr int kProfileFamily = 500;
```

CANopen ProfileNo family fallback (no identity match). 

### variable kNone

```cpp
constexpr int kNone = 0;
```


### variable kIdentityPin

```cpp
constexpr int kIdentityPin = 1000;
```

Identity-matched device class (highest priority). 




-------------------------------

Updated on 2026-07-04 at 20:22:54 +0000