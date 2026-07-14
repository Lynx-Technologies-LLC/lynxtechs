export type Status = 'available' | 'in-development' | 'planned' | 'not-planned';

export interface Feature {
  name: string;
  status: Status;
  note: string;
}

export interface Category {
  title: string;
  features: Feature[];
}

export interface FeaturePack {
  name: string;
  status: Status;
  note: string;
}

export const STATUS_LABEL: Record<Status, string> = {
  'available': 'Available',
  'in-development': 'In development',
  'planned': 'Planned',
  'not-planned': 'Not planned',
};

export const CATEGORIES: Category[] = [
  {
    title: 'Core EtherCAT communication',
    features: [
      {
        name: 'EtherCAT state machine (INIT / PRE-OP / SAFE-OP / OP)',
        status: 'available',
        note: 'Full ESM with AL status + status-code handling, error-ack retry, and BOOT state support.',
      },
      {
        name: 'Service commands (APRD / FPRD / BRD / LRD / LWR / LRW / ARMW / FRMW)',
        status: 'available',
        note: 'Full EtherCAT command set driven by the configurator and the cyclic path.',
      },
      {
        name: 'Raw EtherCAT frame types (EtherType 0x88A4)',
        status: 'available',
        note: 'Standard raw EtherCAT frames on the wire.',
      },
      {
        name: 'Error handling and fault reporting',
        status: 'available',
        note: 'Per-cycle working-counter watchdog, link/topology break localisation, AL monitoring, on_bus_fault callback.',
      },
      {
        name: 'IRQ field in EtherCAT datagram',
        status: 'not-planned',
        note: 'AL-event IRQ mask is generated in the ENI, but the datagram IRQ field is not consumed; state changes are detected by polling AL Status.',
      },
      {
        name: 'Device emulation flag awareness',
        status: 'not-planned',
        note: 'Simple and complex slaves are handled, but no special error-ack skipping for device-emulation slaves.',
      },
      {
        name: 'VLAN tagging',
        status: 'not-planned',
        note: 'Optional per the EtherCAT spec; not implemented.',
      },
      {
        name: 'UDP frame types',
        status: 'not-planned',
        note: 'Optional per the EtherCAT spec; not implemented.',
      },
    ],
  },
  {
    title: 'Process data',
    features: [
      {
        name: 'Cyclic PDO exchange',
        status: 'available',
        note: 'Process data packed into segmented LWR/LRD frames per group; driven by a single real-time cyclic task.',
      },
      {
        name: 'Multiple cyclic tasks (multi-rate)',
        status: 'not-planned',
        note: 'The backend supports multi-group process data, but only a single cyclic task is exposed. Wire on demand.',
      },
      {
        name: 'Frame repetition',
        status: 'not-planned',
        note: 'Not implemented.',
      },
    ],
  },
  {
    title: 'Network configuration',
    features: [
      {
        name: 'ENI file loading and validation',
        status: 'available',
        note: 'Runtime loads and validates an ENI; online bus scan reads live SII/identity. Both paths are available.',
      },
      {
        name: 'Network configuration comparison at boot',
        status: 'available',
        note: 'Slave count, VendorId, ProductCode, and revision rules are compared on bring-up.',
      },
      {
        name: 'Explicit device identification',
        status: 'not-planned',
        note: 'ENI Identification ADO not parsed; needed for hot-connect and cable-swap detection.',
      },
      {
        name: 'Station alias addressing',
        status: 'not-planned',
        note: 'Alias address is read from hardware but addressing still uses the configured address.',
      },
      {
        name: 'EEPROM read / write / reload',
        status: 'in-development',
        note: 'Full EEPROM access (read, write, reload, dump) is available in the backend but not yet surfaced through the public API.',
      },
    ],
  },
  {
    title: 'Mailbox',
    features: [
      {
        name: 'Mailbox protocol support',
        status: 'available',
        note: 'Mailbox pool, queue, post/fetch, and sync-manager setup.',
      },
      {
        name: 'Resilient mailbox layer (link-counter + retransmit)',
        status: 'available',
        note: 'Link-counter toggle (wraps 1–7) and retransmit queue are fully implemented.',
      },
      {
        name: 'Cyclic mailbox polling (unsolicited input data)',
        status: 'in-development',
        note: 'Cyclic mailbox handler exists in the backend but is not wired in the public API.',
      },
      {
        name: 'Multiple mailbox channels',
        status: 'not-planned',
        note: 'Optional per the spec; not implemented.',
      },
    ],
  },
  {
    title: 'CoE — CANopen over EtherCAT',
    features: [
      {
        name: 'SDO upload / download (normal + expedited)',
        status: 'available',
        note: 'Used throughout for PDO assignment, CiA402 objects, and ENI InitCmd replay.',
      },
      {
        name: 'Segmented SDO transfer',
        status: 'available',
        note: 'Transparent handling of segmented uploads and downloads of any size.',
      },
      {
        name: 'SDO complete access',
        status: 'in-development',
        note: 'Backend supports complete access but callers do not yet use it.',
      },
      {
        name: 'SDO information service (object dictionary listing)',
        status: 'in-development',
        note: 'OD listing is available in the backend but not exposed through the public API.',
      },
      {
        name: 'CoE Emergency messages',
        status: 'not-planned',
        note: 'Emergency messages are decoded internally into the error log but not yet surfaced as application callbacks.',
      },
      {
        name: 'PDO transmission via CoE',
        status: 'not-planned',
        note: 'Optional; expose on demand.',
      },
    ],
  },
  {
    title: 'Mailbox protocols (EoE / FoE / SoE / AoE / VoE)',
    features: [
      {
        name: 'EoE — Ethernet over EtherCAT',
        status: 'in-development',
        note: 'IP config, fragmented send/recv, and reassembly are in the backend; not yet exposed through the public API.',
      },
      {
        name: 'EoE virtual switch + OS endpoint',
        status: 'not-planned',
        note: 'Needs a host-side L2 switch / TAP bridge to the OS IP stack.',
      },
      {
        name: 'FoE — File over EtherCAT (firmware up/download)',
        status: 'in-development',
        note: 'Full FoE get_file/put_file with password and progress hook is in the backend; not yet exposed through the public API.',
      },
      {
        name: 'BOOT state for firmware update',
        status: 'in-development',
        note: 'BOOT state exists; needs wiring in the bring-up sequence for firmware update use cases.',
      },
      {
        name: 'SoE — Servo drive profile over EtherCAT (IDN)',
        status: 'not-planned',
        note: 'SoE read_idn/write_idn/map_idns is in the backend; not yet exposed through the public API.',
      },
      {
        name: 'AoE — ADS over EtherCAT',
        status: 'not-planned',
        note: 'Routing slot exists; no AoE service module. Needs new code.',
      },
      {
        name: 'VoE — Vendor-specific over EtherCAT',
        status: 'not-planned',
        note: 'Routing slot exists; no VoE handler. Optional.',
      },
    ],
  },
  {
    title: 'Distributed Clocks',
    features: [
      {
        name: 'DC configuration and synchronisation',
        status: 'available',
        note: 'Propagation-delay measurement, reference clock selection, alignment, SYNC0/SYNC01 setup, and master-side PI drift controller.',
      },
      {
        name: 'Continuous propagation-delay re-measurement',
        status: 'not-planned',
        note: 'Master–DC drift is compensated, but periodic re-measurement of propagation delay is not yet emitted.',
      },
      {
        name: 'Sync window monitoring (hard per-cycle fault)',
        status: 'not-planned',
        note: 'System-time-difference is gated at OP entry and traced in OP, but no hard per-cycle fault threshold is enforced.',
      },
    ],
  },
  {
    title: 'Advanced bus features',
    features: [
      {
        name: 'Slave-to-slave data copy via master',
        status: 'not-planned',
        note: 'No master-side routing of one slave\'s inputs to another\'s outputs. Required for Safety-over-EtherCAT.',
      },
      {
        name: 'Master object dictionary (ETG.5001)',
        status: 'not-planned',
        note: 'No master-local OD.',
      },
    ],
  },
];

export const FEATURE_PACKS: FeaturePack[] = [
  {
    name: 'Motion control — CiA402 drive profile',
    status: 'available',
    note: 'Full CiA402 drive profile: control/status word, CSP/CSV/CST operating modes, DC sync. The primary purpose of LXMASTER.',
  },
  {
    name: 'Digital I/O — CiA401 profile',
    status: 'available',
    note: 'Digital and analog I/O modules via the IoModule facade.',
  },
  {
    name: 'Encoder — CiA406 profile',
    status: 'available',
    note: 'Encoder devices via the Encoder facade.',
  },
  {
    name: 'Custom device profiles',
    status: 'available',
    note: 'Users can implement IDeviceProfile / IMotionProfile / IIoProfile to support any EtherCAT device.',
  },
  {
    name: 'Cable redundancy',
    status: 'in-development',
    note: 'Ring-topology plumbing exists in the backend; break-localisation and facade wiring remain.',
  },
  {
    name: 'Motion control — SERCOS / SoE drive profile',
    status: 'not-planned',
    note: 'SoE transport is available; no SERCOS drive profile layer on top.',
  },
  {
    name: 'Hot connect (dynamic topology)',
    status: 'not-planned',
    note: 'No hot-connect groups or identify commands.',
  },
];
