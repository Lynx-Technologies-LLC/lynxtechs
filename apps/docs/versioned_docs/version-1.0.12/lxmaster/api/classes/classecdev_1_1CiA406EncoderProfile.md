<!-- GENERATED - do not edit. Produced from the LXMASTER public
     headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->
---
title: ecdev::CiA406EncoderProfile
summary: CiA 406 (encoder) profile. 

slug: /lxmaster/api/classes/CiA406EncoderProfile
sidebar_label: "CiA406EncoderProfile"
---

# ecdev::CiA406EncoderProfile



CiA 406 (encoder) profile.  [More...](#detailed-description)


`#include <cia406_encoder_profile.hpp>`

Inherits from [ecdev::IDeviceProfile](/lxmaster/api/classes/IDeviceProfile), [ecdev::IEncoderProfile](/lxmaster/api/classes/IEncoderProfile), IDeviceLifecycle

## Public Functions

|                | Name           |
| -------------- | -------------- |
| virtual std::int32_t | **[velocity](/lxmaster/api/classes/CiA406EncoderProfile#function-velocity)**() const override<br>Latest velocity value, if the sensor maps one (otherwise 0).  |
| virtual std::uint16_t | **[status](/lxmaster/api/classes/CiA406EncoderProfile#function-status)**() const override<br>Raw status/operating-status word, if mapped (otherwise 0).  |
| virtual void | **[readInputs](/lxmaster/api/classes/CiA406EncoderProfile#function-readinputs)**(const [ProcessImage](/lxmaster/api/classes/ProcessImage) & image, bool wkc_valid, bool operational) override |
| virtual const char * | **[profileName](/lxmaster/api/classes/CiA406EncoderProfile#function-profilename)**() const override<br>Stable identifier for diagnostics (e.g.  |
| virtual std::int32_t | **[position](/lxmaster/api/classes/CiA406EncoderProfile#function-position)**() const override<br>Latest position value (counts) from the sensor.  |
| virtual std::string | **[configurePreOp](/lxmaster/api/classes/CiA406EncoderProfile#function-configurepreop)**(ISlaveServices & svc, [ProcessImage](/lxmaster/api/classes/ProcessImage) & image) override |
| virtual [IEncoderProfile](/lxmaster/api/classes/IEncoderProfile) * | **[asEncoder](/lxmaster/api/classes/CiA406EncoderProfile#function-asencoder)**() override |

## Additional inherited members

**Public Functions inherited from [ecdev::IDeviceProfile](/lxmaster/api/classes/IDeviceProfile)**

|                | Name           |
| -------------- | -------------- |
| | **[~IDeviceProfile](/lxmaster/api/classes/IDeviceProfile#function-~ideviceprofile)**() override =default |
| virtual void | **[writeOutputs](/lxmaster/api/classes/IDeviceProfile#function-writeoutputs)**([ProcessImage](/lxmaster/api/classes/ProcessImage) & image, std::uint64_t cycle_count) |
| virtual void | **[resolveTopology](/lxmaster/api/classes/IDeviceProfile#function-resolvetopology)**(const [ProcessImage](/lxmaster/api/classes/ProcessImage) & image)<br>Resolve the static channel/PDO topology from the ENI-derived process image.  |
| virtual void | **[primeOutputs](/lxmaster/api/classes/IDeviceProfile#function-primeoutputs)**([ProcessImage](/lxmaster/api/classes/ProcessImage) & image) |
| virtual std::string | **[prepareSafeOp](/lxmaster/api/classes/IDeviceProfile#function-preparesafeop)**(ISlaveServices & svc, [ProcessImage](/lxmaster/api/classes/ProcessImage) & image) |
| virtual void | **[captureExitDiagnostics](/lxmaster/api/classes/IDeviceProfile#function-captureexitdiagnostics)**(ISlaveServices & svc)<br>End-of-run, after the RT thread has joined; safe to do SDO reads via `svc`.  |
| virtual [IMotionProfile](/lxmaster/api/classes/IMotionProfile) * | **[asMotion](/lxmaster/api/classes/IDeviceProfile#function-asmotion)**() |
| virtual [IIoProfile](/lxmaster/api/classes/IIoProfile) * | **[asIo](/lxmaster/api/classes/IDeviceProfile#function-asio)**() |

**Public Functions inherited from [ecdev::IEncoderProfile](/lxmaster/api/classes/IEncoderProfile)**

|                | Name           |
| -------------- | -------------- |
| virtual | **[~IEncoderProfile](/lxmaster/api/classes/IEncoderProfile#function-~iencoderprofile)**() =default |


## Detailed Description

```cpp
class ecdev::CiA406EncoderProfile;
```

CiA 406 (encoder) profile. 

Reads the position value (0x6004) and optional velocity/status into a lock-free snapshot exposed via `[IEncoderProfile](/lxmaster/api/classes/IEncoderProfile)` (wrapped by the `Encoder` facade). A read-only device class &ndash; another data point that the plugin model is not motion-specific.

Extending it: this class is intentionally NOT `final`. To add vendor/extra PDO variables (objects the ENI maps beyond the standard CiA406 set), subclass it, override the relevant lifecycle method (typically `readInputs`, and optionally `configurePreOp`), and CHAIN to the base (`CiA406EncoderProfile::readInputs(...)`) before doing your own work. Resolve your extra objects with `ProcessImage::resolve(index, sub)` and publish them to application threads through your own lock-free state (atomics). `Encoder` keeps working unchanged because the subclass inherits this profile's `asEncoder()`. The application reaches the subclass via `[ecfacade::DeviceFacade::deviceProfile()](/lxmaster/api/classes/DeviceFacade#function-deviceprofile)`. 

## Public Functions Documentation

### function velocity

```cpp
inline virtual std::int32_t velocity() const override
```

Latest velocity value, if the sensor maps one (otherwise 0). 

**Reimplements**: [ecdev::IEncoderProfile::velocity](/lxmaster/api/classes/IEncoderProfile#function-velocity)


### function status

```cpp
inline virtual std::uint16_t status() const override
```

Raw status/operating-status word, if mapped (otherwise 0). 

**Reimplements**: [ecdev::IEncoderProfile::status](/lxmaster/api/classes/IEncoderProfile#function-status)


### function readInputs

```cpp
virtual void readInputs(
    const ProcessImage & image,
    bool wkc_valid,
    bool operational
) override
```


**Reimplements**: [ecdev::IDeviceProfile::readInputs](/lxmaster/api/classes/IDeviceProfile#function-readinputs)


### function profileName

```cpp
inline virtual const char * profileName() const override
```

Stable identifier for diagnostics (e.g. 

**Reimplements**: [ecdev::IDeviceProfile::profileName](/lxmaster/api/classes/IDeviceProfile#function-profilename)


"CiA402-drive"). 


### function position

```cpp
inline virtual std::int32_t position() const override
```

Latest position value (counts) from the sensor. 

**Reimplements**: [ecdev::IEncoderProfile::position](/lxmaster/api/classes/IEncoderProfile#function-position)


### function configurePreOp

```cpp
virtual std::string configurePreOp(
    ISlaveServices & svc,
    ProcessImage & image
) override
```


**Reimplements**: [ecdev::IDeviceProfile::configurePreOp](/lxmaster/api/classes/IDeviceProfile#function-configurepreop)


### function asEncoder

```cpp
inline virtual IEncoderProfile * asEncoder() override
```


**Reimplements**: [ecdev::IDeviceProfile::asEncoder](/lxmaster/api/classes/IDeviceProfile#function-asencoder)


-------------------------------

Updated on 2026-07-04 at 20:22:54 +0000