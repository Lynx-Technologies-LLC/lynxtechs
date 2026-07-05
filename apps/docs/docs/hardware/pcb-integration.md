---
sidebar_position: 2
title: PCB Integration
---

# PCB Integration

> Sample content. Pinouts, voltages, and values below are placeholders. Always
> refer to the official datasheet for production designs.

This page describes how to integrate an EtherCAT hardware module onto your own
carrier PCB.

## Power

| Rail | Voltage | Notes |
| --- | --- | --- |
| VCC  | 3.3 V   | Main module supply; add local decoupling. |
| VIO  | 1.8 / 3.3 V | Host interface I/O reference. |
| GND  | 0 V     | Common ground plane. |

Recommendations:

- Place a bulk capacitor (e.g. 10 µF) plus per-pin 100 nF decoupling close to the
  module's power pins.
- Use a solid ground plane under the module.

## Host interface pinout (example)

| Pin | Signal | Direction (module) | Description |
| --- | --- | --- | --- |
| 1 | VCC | -- | 3.3 V supply |
| 2 | GND | -- | Ground |
| 3 | SPI_CLK | In | Host SPI clock |
| 4 | SPI_MOSI | In | Host to module data |
| 5 | SPI_MISO | Out | Module to host data |
| 6 | SPI_CS# | In | Chip select (active low) |
| 7 | IRQ# | Out | Interrupt to host |
| 8 | RESET# | In | Active-low reset |

## Ethernet ports

The module exposes two EtherCAT ports (IN and OUT) for daisy-chaining:

- Route each port's differential pairs (TX+/TX-, RX+/RX-) as 100 Ω differential
  with matched lengths.
- Keep the pairs short and away from noisy signals.
- Use magnetics-integrated connectors or discrete magnetics per the datasheet.

```text
Upstream device  ===>  [ IN ]  Module  [ OUT ]  ===>  Downstream device
```

## Layout checklist

- [ ] Decoupling capacitors placed close to module power pins.
- [ ] Solid, continuous ground plane beneath the module.
- [ ] Ethernet pairs routed as 100 Ω differential, length-matched.
- [ ] Host interface kept short; series termination if required.
- [ ] `RESET#` and `IRQ#` connected to the host MCU.
- [ ] EEPROM/ESI access verified during bring-up.

## Bring-up

1. Power the carrier board and confirm the module's supply rails.
2. Verify the host interface link (SPI/parallel) with a register read.
3. Connect to an EtherCAT network and confirm the device is discovered by the
   [LXMASTER software](/lxmaster/getting-started).
