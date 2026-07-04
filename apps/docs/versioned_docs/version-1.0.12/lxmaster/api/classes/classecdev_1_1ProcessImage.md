---
title: ecdev::ProcessImage
summary: Per-slave process-image accessor: the narrow cyclic-path contract that device profiles use. 

slug: /lxmaster/api/classes/ProcessImage
sidebar_label: "ProcessImage"
---
<!-- GENERATED - do not edit. Produced from the LXMASTER public
     headers by docs/api/generate-api-docs.sh (Doxygen + doxybook2). -->

# ecdev::ProcessImage



Per-slave process-image accessor: the narrow cyclic-path contract that device profiles use.  [More...](#detailed-description)


`#include <process_image.hpp>`

## Public Classes

|                | Name           |
| -------------- | -------------- |
| struct | **[Entry](/lxmaster/api/classes/ProcessImage-Entry)** <br>All resolved entries, in image order (diagnostics / enumeration by facades).  |

## Public Functions

|                | Name           |
| -------------- | -------------- |
| bool | **[writeU8](/lxmaster/api/classes/ProcessImage#function-writeu8)**(const [PdoEntryRef](/lxmaster/api/classes/PdoEntryRef) & ref, std::uint8_t value) |
| bool | **[writeU32](/lxmaster/api/classes/ProcessImage#function-writeu32)**(const [PdoEntryRef](/lxmaster/api/classes/PdoEntryRef) & ref, std::uint32_t value) |
| bool | **[writeU16](/lxmaster/api/classes/ProcessImage#function-writeu16)**(const [PdoEntryRef](/lxmaster/api/classes/PdoEntryRef) & ref, std::uint16_t value) |
| bool | **[writeI8](/lxmaster/api/classes/ProcessImage#function-writei8)**(const [PdoEntryRef](/lxmaster/api/classes/PdoEntryRef) & ref, std::int8_t value) |
| bool | **[writeI32](/lxmaster/api/classes/ProcessImage#function-writei32)**(const [PdoEntryRef](/lxmaster/api/classes/PdoEntryRef) & ref, std::int32_t value) |
| bool | **[writeI16](/lxmaster/api/classes/ProcessImage#function-writei16)**(const [PdoEntryRef](/lxmaster/api/classes/PdoEntryRef) & ref, std::int16_t value) |
| bool | **[writeBit](/lxmaster/api/classes/ProcessImage#function-writebit)**(const [PdoEntryRef](/lxmaster/api/classes/PdoEntryRef) & ref, bool value) |
| [PdoEntryRef](/lxmaster/api/classes/PdoEntryRef) | **[resolve](/lxmaster/api/classes/ProcessImage#function-resolve)**(std::uint16_t index, std::uint8_t sub) const<br>Resolve a CoE object (index:sub) to a stable handle.  |
| bool | **[readU8](/lxmaster/api/classes/ProcessImage#function-readu8)**(const [PdoEntryRef](/lxmaster/api/classes/PdoEntryRef) & ref, std::uint8_t * out) const |
| bool | **[readU32](/lxmaster/api/classes/ProcessImage#function-readu32)**(const [PdoEntryRef](/lxmaster/api/classes/PdoEntryRef) & ref, std::uint32_t * out) const |
| bool | **[readU16](/lxmaster/api/classes/ProcessImage#function-readu16)**(const [PdoEntryRef](/lxmaster/api/classes/PdoEntryRef) & ref, std::uint16_t * out) const |
| bool | **[readI8](/lxmaster/api/classes/ProcessImage#function-readi8)**(const [PdoEntryRef](/lxmaster/api/classes/PdoEntryRef) & ref, std::int8_t * out) const |
| bool | **[readI32](/lxmaster/api/classes/ProcessImage#function-readi32)**(const [PdoEntryRef](/lxmaster/api/classes/PdoEntryRef) & ref, std::int32_t * out) const |
| bool | **[readI16](/lxmaster/api/classes/ProcessImage#function-readi16)**(const [PdoEntryRef](/lxmaster/api/classes/PdoEntryRef) & ref, std::int16_t * out) const |
| bool | **[readBit](/lxmaster/api/classes/ProcessImage#function-readbit)**(const [PdoEntryRef](/lxmaster/api/classes/PdoEntryRef) & ref, bool * out) const |
| [ProcessImage](/lxmaster/api/classes/ProcessImage) | **[fromSlaveConfig](/lxmaster/api/classes/ProcessImage#function-fromslaveconfig)**(const eni::SlaveConfig & slave)<br>Build the offset tables from an ENI slave (walks rx_pdos then tx_pdos in order).  |
| const std::vector< [Entry](/lxmaster/api/classes/ProcessImage-Entry) > & | **[entries](/lxmaster/api/classes/ProcessImage#function-entries)**() const |
| void | **[bind](/lxmaster/api/classes/ProcessImage#function-bind)**(std::uint8_t * outputs, std::size_t output_bytes, const std::uint8_t * inputs, std::size_t input_bytes)<br>Bind the live PDO byte buffers for the current cycle.  |
| | **[ProcessImage](/lxmaster/api/classes/ProcessImage#function-processimage)**() =default |

## Detailed Description

```cpp
class ecdev::ProcessImage;
```

Per-slave process-image accessor: the narrow cyclic-path contract that device profiles use. 

It owns the offset tables derived from an ENI `<Slave>`'s RxPdo/TxPdo entry lists (CoE object index:sub and human name -> byte/bit offset) and binds, each cycle, to the live PDO byte buffers the backend exposes for that slave. Profiles `[resolve()](/lxmaster/api/classes/ProcessImage#function-resolve)` the objects they care about once, then use the typed read/write helpers in `writeOutputs`/`readInputs`.

Deliberately holds NO backend types and no EtherCAT master reference: the only thing a profile can do through a [ProcessImage](/lxmaster/api/classes/ProcessImage) is shuffle bytes in the bound PDO window. That makes the RT path auditable &ndash; a profile physically cannot issue a blocking SDO from a cyclic hook. 

## Public Functions Documentation

### function writeU8

```cpp
bool writeU8(
    const PdoEntryRef & ref,
    std::uint8_t value
)
```


### function writeU32

```cpp
bool writeU32(
    const PdoEntryRef & ref,
    std::uint32_t value
)
```


### function writeU16

```cpp
bool writeU16(
    const PdoEntryRef & ref,
    std::uint16_t value
)
```


### function writeI8

```cpp
bool writeI8(
    const PdoEntryRef & ref,
    std::int8_t value
)
```


### function writeI32

```cpp
bool writeI32(
    const PdoEntryRef & ref,
    std::int32_t value
)
```


### function writeI16

```cpp
bool writeI16(
    const PdoEntryRef & ref,
    std::int16_t value
)
```


### function writeBit

```cpp
bool writeBit(
    const PdoEntryRef & ref,
    bool value
)
```


### function resolve

```cpp
PdoEntryRef resolve(
    std::uint16_t index,
    std::uint8_t sub
) const
```

Resolve a CoE object (index:sub) to a stable handle. 

Do this once at setup. 


### function readU8

```cpp
bool readU8(
    const PdoEntryRef & ref,
    std::uint8_t * out
) const
```


### function readU32

```cpp
bool readU32(
    const PdoEntryRef & ref,
    std::uint32_t * out
) const
```


### function readU16

```cpp
bool readU16(
    const PdoEntryRef & ref,
    std::uint16_t * out
) const
```


### function readI8

```cpp
bool readI8(
    const PdoEntryRef & ref,
    std::int8_t * out
) const
```


### function readI32

```cpp
bool readI32(
    const PdoEntryRef & ref,
    std::int32_t * out
) const
```


### function readI16

```cpp
bool readI16(
    const PdoEntryRef & ref,
    std::int16_t * out
) const
```


### function readBit

```cpp
bool readBit(
    const PdoEntryRef & ref,
    bool * out
) const
```


### function fromSlaveConfig

```cpp
static ProcessImage fromSlaveConfig(
    const eni::SlaveConfig & slave
)
```

Build the offset tables from an ENI slave (walks rx_pdos then tx_pdos in order). 

### function entries

```cpp
inline const std::vector< Entry > & entries() const
```


### function bind

```cpp
void bind(
    std::uint8_t * outputs,
    std::size_t output_bytes,
    const std::uint8_t * inputs,
    std::size_t input_bytes
)
```

Bind the live PDO byte buffers for the current cycle. 

Cheap; call once per cycle. 


### function ProcessImage

```cpp
ProcessImage() =default
```


-------------------------------

Updated on 2026-07-04 at 20:22:54 +0000