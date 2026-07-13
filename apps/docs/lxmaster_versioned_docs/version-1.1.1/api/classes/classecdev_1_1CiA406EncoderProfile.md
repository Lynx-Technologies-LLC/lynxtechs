---
title: "ecdev::CiA406EncoderProfile"
summary: "CiA 406 (encoder) profile."

slug: /api/classes/CiA406EncoderProfile
sidebar_label: "CiA406EncoderProfile"
---

<!-- GENERATED - do not edit. Produced from the LXMASTER public headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->
# ecdev::CiA406EncoderProfile



CiA 406 (encoder) profile.  [More...](#detailed-description)


`#include <cia406_encoder_profile.hpp>`

Inherits from [ecdev::IDeviceProfile](/lxmaster/api/classes/IDeviceProfile), [ecdev::IEncoderProfile](/lxmaster/api/classes/IEncoderProfile), IDeviceLifecycle

## Public Functions

|                | Name           |
| -------------- | -------------- |
| virtual std::int32_t | **[velocity](/lxmaster/api/classes/CiA406EncoderProfile#function-velocity)**() const override<br>Latest velocity value, if the sensor maps one (otherwise 0).  |
| virtual std::uint16_t | **[status](/lxmaster/api/classes/CiA406EncoderProfile#function-status)**() const override<br>Raw status/operating-status word, if mapped (otherwise 0).  |
| virtual void | **[readInputs](/lxmaster/api/classes/CiA406EncoderProfile#function-readinputs)**(const ProcessImage & image, bool wkc_valid, bool operational) override<br>Read input PDO values captured this cycle.  |
| virtual const char * | **[profileName](/lxmaster/api/classes/CiA406EncoderProfile#function-profilename)**() const override<br>Stable identifier for diagnostics (e.g.  |
| virtual std::int32_t | **[position](/lxmaster/api/classes/CiA406EncoderProfile#function-position)**() const override<br>Latest position value (counts) from the sensor.  |
| virtual std::string | **[configurePreOp](/lxmaster/api/classes/CiA406EncoderProfile#function-configurepreop)**(ISlaveServices & svc, ProcessImage & image) override<br>Perform CoE / SDO configuration while the slave is in PRE_OP (bus not cycling).  |
| virtual [IEncoderProfile](/lxmaster/api/classes/IEncoderProfile) * | **[asEncoder](/lxmaster/api/classes/CiA406EncoderProfile#function-asencoder)**() override<br>Query whether this profile exposes position/velocity encoder readings.  |

## Additional inherited members

**Public Functions inherited from [ecdev::IDeviceProfile](/lxmaster/api/classes/IDeviceProfile)**

|                | Name           |
| -------------- | -------------- |
| | **[~IDeviceProfile](/lxmaster/api/classes/IDeviceProfile#function-~ideviceprofile)**() override =default |
| virtual void | **[writeOutputs](/lxmaster/api/classes/IDeviceProfile#function-writeoutputs)**(ProcessImage & image, std::uint64_t cycle_count)<br>Write output PDO values for this cycle.  |
| virtual void | **[resolveTopology](/lxmaster/api/classes/IDeviceProfile#function-resolvetopology)**(const ProcessImage & image)<br>Resolve the static channel/PDO topology from the ENI-derived process image.  |
| virtual void | **[primeOutputs](/lxmaster/api/classes/IDeviceProfile#function-primeoutputs)**(ProcessImage & image)<br>Prime output PDO bytes to safe values immediately before the bus enters SAFE_OP (outputs start being transmitted).  |
| virtual std::string | **[prepareSafeOp](/lxmaster/api/classes/IDeviceProfile#function-preparesafeop)**(ISlaveServices & svc, ProcessImage & image)<br>Final configuration step before OPERATIONAL: the slave is in SAFE_OP and the PDO IOmap is live but outputs are not yet driven.  |
| virtual void | **[captureExitDiagnostics](/lxmaster/api/classes/IDeviceProfile#function-captureexitdiagnostics)**(ISlaveServices & svc)<br>End-of-run hook called after the RT thread has joined; safe to perform SDO reads.  |
| virtual [IMotionProfile](/lxmaster/api/classes/IMotionProfile) * | **[asMotion](/lxmaster/api/classes/IDeviceProfile#function-asmotion)**()<br>Query whether this profile drives a motion (servo) axis.  |
| virtual [IIoProfile](/lxmaster/api/classes/IIoProfile) * | **[asIo](/lxmaster/api/classes/IDeviceProfile#function-asio)**()<br>Query whether this profile exposes digital/analog I/O channels.  |

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

Extending it: this class is intentionally NOT `final`. To add vendor/extra PDO variables (objects the ENI maps beyond the standard CiA406 set), subclass it, override the relevant lifecycle method (typically `readInputs`, and optionally `configurePreOp`), and CHAIN to the base (`CiA406EncoderProfile::readInputs(...)`) before doing your own work. Resolve your extra objects with `ProcessImage::resolve(index, sub)` and publish them to application threads through your own lock-free state (atomics). `Encoder` keeps working unchanged because the subclass inherits this profile's `[asEncoder()](/lxmaster/api/classes/CiA406EncoderProfile#function-asencoder)`. The application reaches the subclass via `ecfacade::DeviceFacade::deviceProfile()`. 

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

Read input PDO values captured this cycle. 

**Parameters**: 

  * **image** Live PDO byte map for this slave's input objects. 
  * **wkc_valid** False when the work counter dropped this cycle — the slave may not have responded and input data may be stale. 
  * **operational** False during the OP-entry cooldown cycles after the master enters OPERATIONAL. Motion commands should be suppressed until this is true. 


**Reimplements**: [ecdev::IDeviceProfile::readInputs](/lxmaster/api/classes/IDeviceProfile#function-readinputs)


Called on the RT cyclic thread every cycle while OPERATIONAL. Profiles should guard state updates on `wkc_valid` and `operational` to avoid acting on stale data. 


### function profileName

```cpp
inline virtual const char * profileName() const override
```

Stable identifier for diagnostics (e.g. 

**Return**: A null-terminated string literal naming this profile class. Must be stable for the lifetime of the profile object (a string literal in practice). 

**Reimplements**: [ecdev::IDeviceProfile::profileName](/lxmaster/api/classes/IDeviceProfile#function-profilename)


`"CiA402-drive"`). 


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

Perform CoE / SDO configuration while the slave is in PRE_OP (bus not cycling). 

**Parameters**: 

  * **svc** Slave services handle for SDO reads/writes and register access. 
  * **image** Process image for this slave; resolve PDO entry handles here for later cyclic use. 


**Return**: Empty string on success; a non-empty human-readable reason string aborts bring-up. 

**Reimplements**: [ecdev::IDeviceProfile::configurePreOp](/lxmaster/api/classes/IDeviceProfile#function-configurepreop)


Resolve process-image handles (PDO objects) for use in the cyclic path. Called on the bring-up thread; never on the RT thread. 


### function asEncoder

```cpp
inline virtual IEncoderProfile * asEncoder() override
```

Query whether this profile exposes position/velocity encoder readings. 

**Return**: A non-null `IEncoderProfile*` if so (used to back an `Encoder` facade handle), or null if this profile does not implement the encoder contract. 

**Reimplements**: [ecdev::IDeviceProfile::asEncoder](/lxmaster/api/classes/IDeviceProfile#function-asencoder)


-------------------------------

Updated on 2026-07-13 at 20:44:41 +0000