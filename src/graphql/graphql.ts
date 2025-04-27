/* eslint-disable */
import { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** The `Byte` scalar type represents non-fractional whole numeric values. Byte can represent values between 0 and 255. */
  Byte: { input: any; output: any; }
  /** The `DateTime` scalar represents an ISO-8601 compliant date time type. */
  DateTime: { input: any; output: any; }
  /** The `TimeSpan` scalar represents an ISO-8601 compliant duration type. */
  TimeSpan: { input: any; output: any; }
  UUID: { input: any; output: any; }
  /** The UnsignedLong scalar type represents a unsigned 64-bit numeric non-fractional value greater than or equal to 0. */
  UnsignedLong: { input: any; output: any; }
};

/** Defines when a policy shall be executed. */
export enum ApplyPolicy {
  /** After the resolver was executed. */
  AfterResolver = 'AFTER_RESOLVER',
  /** Before the resolver was executed. */
  BeforeResolver = 'BEFORE_RESOLVER',
  /** The policy is applied in the validation step before the execution. */
  Validation = 'VALIDATION'
}

/** A basic charge controller. */
export type BasicChargeController = IBasicDevice & {
  __typename?: 'BasicChargeController';
  alerts?: Maybe<Array<Scalars['String']['output']>>;
  ccrAllowedModes: Array<CcrMode>;
  ccrMode: CcrMode;
  ccrType: CcrKind;
  connectionStatus?: Maybe<DeviceConnectionStatus>;
  deviceType: Scalars['String']['output'];
  gDState: DeviceGdState;
  gatewayHiloId: Scalars['String']['output'];
  hiloId: Scalars['String']['output'];
  lastConnectionTime: Scalars['DateTime']['output'];
  lastUpdate: Scalars['DateTime']['output'];
  lastUpdateVersion: Scalars['UnsignedLong']['output'];
  locationHiloId: Scalars['String']['output'];
  model?: Maybe<Scalars['String']['output']>;
  physicalAddress: Scalars['String']['output'];
  power?: Maybe<PowerUnit>;
  source: Scalars['String']['output'];
  state: DeviceState;
  version?: Maybe<Scalars['String']['output']>;
  zigbeeVersion?: Maybe<Scalars['String']['output']>;
};


/** A basic charge controller. */
export type BasicChargeControllerPowerArgs = {
  kind?: InputMaybe<PowerKind>;
};

/** A basic device. */
export type BasicDevice = IBasicDevice & {
  __typename?: 'BasicDevice';
  connectionStatus?: Maybe<DeviceConnectionStatus>;
  deviceType: Scalars['String']['output'];
  gatewayHiloId: Scalars['String']['output'];
  hiloId: Scalars['String']['output'];
  lastConnectionTime: Scalars['DateTime']['output'];
  lastUpdate: Scalars['DateTime']['output'];
  lastUpdateVersion: Scalars['UnsignedLong']['output'];
  locationHiloId: Scalars['String']['output'];
  physicalAddress: Scalars['String']['output'];
  source: Scalars['String']['output'];
};

/** A basic dimmer. */
export type BasicDimmer = IBasicDevice & {
  __typename?: 'BasicDimmer';
  connectionStatus?: Maybe<DeviceConnectionStatus>;
  deviceType: Scalars['String']['output'];
  dimmerType: DimmerKind;
  gatewayHiloId: Scalars['String']['output'];
  hiloId: Scalars['String']['output'];
  lastConnectionTime: Scalars['DateTime']['output'];
  lastUpdate: Scalars['DateTime']['output'];
  lastUpdateVersion: Scalars['UnsignedLong']['output'];
  level?: Maybe<Scalars['Int']['output']>;
  locationHiloId: Scalars['String']['output'];
  model?: Maybe<Scalars['String']['output']>;
  physicalAddress: Scalars['String']['output'];
  power?: Maybe<PowerUnit>;
  source: Scalars['String']['output'];
  state: DeviceState;
};


/** A basic dimmer. */
export type BasicDimmerPowerArgs = {
  kind?: InputMaybe<PowerKind>;
};

/** A basic charging point. */
export type BasicEvCharger = IBasicDevice & {
  __typename?: 'BasicEVCharger';
  chargingPointType: ChargingPointKind;
  connectionStatus?: Maybe<DeviceConnectionStatus>;
  deviceType: Scalars['String']['output'];
  gDState: DeviceGdState;
  gatewayHiloId: Scalars['String']['output'];
  hiloId: Scalars['String']['output'];
  lastConnectionTime: Scalars['DateTime']['output'];
  lastUpdate: Scalars['DateTime']['output'];
  lastUpdateVersion: Scalars['UnsignedLong']['output'];
  locationHiloId: Scalars['String']['output'];
  physicalAddress: Scalars['String']['output'];
  power?: Maybe<PowerUnit>;
  source: Scalars['String']['output'];
  status: ChargingPointStatus;
};


/** A basic charging point. */
export type BasicEvChargerPowerArgs = {
  kind?: InputMaybe<PowerKind>;
};

/** A basic light. */
export type BasicLight = IBasicDevice & {
  __typename?: 'BasicLight';
  colorMode: LightColorMode;
  colorTemperature?: Maybe<Scalars['Int']['output']>;
  connectionStatus?: Maybe<DeviceConnectionStatus>;
  deviceType: Scalars['String']['output'];
  gatewayHiloId: Scalars['String']['output'];
  hiloId: Scalars['String']['output'];
  hue?: Maybe<Scalars['Int']['output']>;
  lastConnectionTime: Scalars['DateTime']['output'];
  lastUpdate: Scalars['DateTime']['output'];
  lastUpdateVersion: Scalars['UnsignedLong']['output'];
  level?: Maybe<Scalars['Int']['output']>;
  lightDeviceType: LightDeviceKind;
  lightType: LightType;
  locationHiloId: Scalars['String']['output'];
  model?: Maybe<Scalars['String']['output']>;
  physicalAddress: Scalars['String']['output'];
  saturation?: Maybe<Scalars['Int']['output']>;
  source: Scalars['String']['output'];
  state: DeviceState;
};

/** A basic smart meter. */
export type BasicSmartMeter = IBasicDevice & {
  __typename?: 'BasicSmartMeter';
  connectionStatus?: Maybe<DeviceConnectionStatus>;
  deviceType: Scalars['String']['output'];
  gatewayHiloId: Scalars['String']['output'];
  hiloId: Scalars['String']['output'];
  lastConnectionTime: Scalars['DateTime']['output'];
  lastUpdate: Scalars['DateTime']['output'];
  lastUpdateVersion: Scalars['UnsignedLong']['output'];
  locationHiloId: Scalars['String']['output'];
  physicalAddress: Scalars['String']['output'];
  power?: Maybe<PowerUnit>;
  smartMeterType: SmartMeterKind;
  source: Scalars['String']['output'];
  zigBeeChannel: Scalars['Int']['output'];
};


/** A basic smart meter. */
export type BasicSmartMeterPowerArgs = {
  kind?: InputMaybe<PowerKind>;
};

/** A basic switch. */
export type BasicSwitch = IBasicDevice & {
  __typename?: 'BasicSwitch';
  connectionStatus?: Maybe<DeviceConnectionStatus>;
  deviceType: Scalars['String']['output'];
  gatewayHiloId: Scalars['String']['output'];
  hiloId: Scalars['String']['output'];
  lastConnectionTime: Scalars['DateTime']['output'];
  lastUpdate: Scalars['DateTime']['output'];
  lastUpdateVersion: Scalars['UnsignedLong']['output'];
  locationHiloId: Scalars['String']['output'];
  model?: Maybe<Scalars['String']['output']>;
  physicalAddress: Scalars['String']['output'];
  power?: Maybe<PowerUnit>;
  source: Scalars['String']['output'];
  state: DeviceState;
  switchType: SwitchKind;
};


/** A basic switch. */
export type BasicSwitchPowerArgs = {
  kind?: InputMaybe<PowerKind>;
};

/** A basic thermostat. */
export type BasicThermostat = IBasicDevice & {
  __typename?: 'BasicThermostat';
  alerts?: Maybe<Array<Scalars['String']['output']>>;
  allowedModes: Array<ThermostatMode>;
  ambientHumidity?: Maybe<Scalars['Int']['output']>;
  /** The ambient temperature setpoint */
  ambientTempSetpoint?: Maybe<TemperatureUnit>;
  ambientTemperature: TemperatureUnit;
  connectionStatus?: Maybe<DeviceConnectionStatus>;
  deviceType: Scalars['String']['output'];
  gDState: DeviceGdState;
  gatewayHiloId: Scalars['String']['output'];
  /** Heat demand is the delta between the actual temperature and the desired temperature */
  heatDemand?: Maybe<Scalars['Int']['output']>;
  hiloId: Scalars['String']['output'];
  lastConnectionTime: Scalars['DateTime']['output'];
  lastUpdate: Scalars['DateTime']['output'];
  lastUpdateVersion: Scalars['UnsignedLong']['output'];
  locationHiloId: Scalars['String']['output'];
  /** Highest Ambient temperature setpoint */
  maxAmbientTempSetpoint?: Maybe<TemperatureUnit>;
  /** Highest Ambient temperature setpoint possible for the thermostat */
  maxAmbientTempSetpointLimit?: Maybe<TemperatureUnit>;
  /** Lowest Ambient temperature setpoint */
  minAmbientTempSetpoint?: Maybe<TemperatureUnit>;
  /** Lowest Ambient temperature setpoint possible for the thermostat */
  minAmbientTempSetpointLimit?: Maybe<TemperatureUnit>;
  mode: ThermostatMode;
  model?: Maybe<Scalars['String']['output']>;
  physicalAddress: Scalars['String']['output'];
  power?: Maybe<PowerUnit>;
  source: Scalars['String']['output'];
  thermostatType: ThermostatKind;
  version?: Maybe<Scalars['String']['output']>;
  zigbeeVersion?: Maybe<Scalars['String']['output']>;
};


/** A basic thermostat. */
export type BasicThermostatAmbientTempSetpointArgs = {
  kind?: InputMaybe<TemperatureKind>;
};


/** A basic thermostat. */
export type BasicThermostatAmbientTemperatureArgs = {
  kind?: InputMaybe<TemperatureKind>;
};


/** A basic thermostat. */
export type BasicThermostatMaxAmbientTempSetpointArgs = {
  kind?: InputMaybe<TemperatureKind>;
};


/** A basic thermostat. */
export type BasicThermostatMaxAmbientTempSetpointLimitArgs = {
  kind?: InputMaybe<TemperatureKind>;
};


/** A basic thermostat. */
export type BasicThermostatMinAmbientTempSetpointArgs = {
  kind?: InputMaybe<TemperatureKind>;
};


/** A basic thermostat. */
export type BasicThermostatMinAmbientTempSetpointLimitArgs = {
  kind?: InputMaybe<TemperatureKind>;
};


/** A basic thermostat. */
export type BasicThermostatPowerArgs = {
  kind?: InputMaybe<PowerKind>;
};

export enum CcrKind {
  Generic = 'GENERIC',
  WaterHeater = 'WATER_HEATER'
}

export enum CcrMode {
  Auto = 'AUTO',
  AutoBypass = 'AUTO_BYPASS',
  Manual = 'MANUAL',
  Off = 'OFF',
  Unknown = 'UNKNOWN'
}

export enum ChargingPointKind {
  Generic = 'GENERIC'
}

export enum ChargingPointStatus {
  Available = 'AVAILABLE',
  InUse = 'IN_USE',
  OutOfService = 'OUT_OF_SERVICE',
  Reserved = 'RESERVED'
}

/** A logical container device. */
export type Container = {
  __typename?: 'Container';
  devices: Array<IBasicDevice>;
  hiloId: Scalars['String']['output'];
  lastUpdate: Scalars['DateTime']['output'];
  lastUpdateVersion: Scalars['UnsignedLong']['output'];
  transmissionTime: Scalars['DateTime']['output'];
};


/** A logical container device. */
export type ContainerDevicesArgs = {
  where?: InputMaybe<IBasicDeviceFilterInput>;
};

/** Union of all devices. */
export type Device = BasicChargeController | BasicDevice | BasicDimmer | BasicEvCharger | BasicLight | BasicSmartMeter | BasicSwitch | BasicThermostat | Gateway | HeatingFloorThermostat | LowVoltageThermostat | WaterHeater;

export enum DeviceConnectionStatus {
  Connected = 'CONNECTED',
  Disconnected = 'DISCONNECTED'
}

export enum DeviceGdState {
  Active = 'ACTIVE',
  CcrActiveSecurityWithClosedRelays = 'CCR_ACTIVE_SECURITY_WITH_CLOSED_RELAYS',
  CcrInactiveSecurityWithClosedRelays = 'CCR_INACTIVE_SECURITY_WITH_CLOSED_RELAYS',
  CcrInactiveSecurityWithOpenedRelays = 'CCR_INACTIVE_SECURITY_WITH_OPENED_RELAYS',
  Excluded = 'EXCLUDED',
  OptOutThroughLocation = 'OPT_OUT_THROUGH_LOCATION',
  OptOutThroughMobileApp = 'OPT_OUT_THROUGH_MOBILE_APP',
  OptOutThroughPhysicalDevice = 'OPT_OUT_THROUGH_PHYSICAL_DEVICE',
  Unknown = 'UNKNOWN'
}

export enum DeviceState {
  Off = 'OFF',
  On = 'ON',
  Unknown = 'UNKNOWN'
}

export enum DimmerKind {
  Generic = 'GENERIC'
}

export enum FloorThermostatMode {
  Ambient = 'AMBIENT',
  Floor = 'FLOOR',
  Hybrid = 'HYBRID'
}

/** A logical gateway device. */
export type Gateway = IBasicDevice & {
  __typename?: 'Gateway';
  connectionStatus?: Maybe<DeviceConnectionStatus>;
  controllerSoftwareVersion: Scalars['String']['output'];
  deviceType: Scalars['String']['output'];
  gatewayHiloId: Scalars['String']['output'];
  hiloId: Scalars['String']['output'];
  lastConnectionTime: Scalars['DateTime']['output'];
  lastUpdate: Scalars['DateTime']['output'];
  lastUpdateVersion: Scalars['UnsignedLong']['output'];
  locationHiloId: Scalars['String']['output'];
  physicalAddress: Scalars['String']['output'];
  smartMeterPairingStatus: Scalars['Boolean']['output'];
  smartMeterZigBeeChannel: Scalars['Int']['output'];
  source: Scalars['String']['output'];
  willBeConnectedToSmartMeter?: Maybe<Scalars['Boolean']['output']>;
  zigBeeChannel: Scalars['Int']['output'];
  zigBeePairingModeEnhanced?: Maybe<Scalars['Byte']['output']>;
};

/** A floor thermostat. */
export type HeatingFloorThermostat = IBasicDevice & {
  __typename?: 'HeatingFloorThermostat';
  alerts?: Maybe<Array<Scalars['String']['output']>>;
  allowedModes: Array<ThermostatMode>;
  ambientHumidity?: Maybe<Scalars['Int']['output']>;
  /** The ambient temperature setpoint */
  ambientTempSetpoint?: Maybe<TemperatureUnit>;
  ambientTemperature: TemperatureUnit;
  connectionStatus?: Maybe<DeviceConnectionStatus>;
  deviceType: Scalars['String']['output'];
  /** Floor temperature limit. Is a safety measure to avoid fire, etc */
  floorLimit?: Maybe<TemperatureUnit>;
  floorMode: FloorThermostatMode;
  gDState: DeviceGdState;
  gatewayHiloId: Scalars['String']['output'];
  /** Heat demand is the delta between the actual temperature and the desired temperature */
  heatDemand?: Maybe<Scalars['Int']['output']>;
  hiloId: Scalars['String']['output'];
  lastConnectionTime: Scalars['DateTime']['output'];
  lastUpdate: Scalars['DateTime']['output'];
  lastUpdateVersion: Scalars['UnsignedLong']['output'];
  locationHiloId: Scalars['String']['output'];
  /** Highest Ambient temperature setpoint */
  maxAmbientTempSetpoint?: Maybe<TemperatureUnit>;
  /** Highest Ambient temperature setpoint possible for the thermostat */
  maxAmbientTempSetpointLimit?: Maybe<TemperatureUnit>;
  /** Lowest Ambient temperature setpoint */
  minAmbientTempSetpoint?: Maybe<TemperatureUnit>;
  /** Lowest Ambient temperature setpoint possible for the thermostat */
  minAmbientTempSetpointLimit?: Maybe<TemperatureUnit>;
  mode: ThermostatMode;
  model?: Maybe<Scalars['String']['output']>;
  physicalAddress: Scalars['String']['output'];
  power?: Maybe<PowerUnit>;
  source: Scalars['String']['output'];
  thermostatType: ThermostatKind;
  version?: Maybe<Scalars['String']['output']>;
  zigbeeVersion?: Maybe<Scalars['String']['output']>;
};


/** A floor thermostat. */
export type HeatingFloorThermostatAmbientTempSetpointArgs = {
  kind?: InputMaybe<TemperatureKind>;
};


/** A floor thermostat. */
export type HeatingFloorThermostatAmbientTemperatureArgs = {
  kind?: InputMaybe<TemperatureKind>;
};


/** A floor thermostat. */
export type HeatingFloorThermostatMaxAmbientTempSetpointArgs = {
  kind?: InputMaybe<TemperatureKind>;
};


/** A floor thermostat. */
export type HeatingFloorThermostatMaxAmbientTempSetpointLimitArgs = {
  kind?: InputMaybe<TemperatureKind>;
};


/** A floor thermostat. */
export type HeatingFloorThermostatMinAmbientTempSetpointArgs = {
  kind?: InputMaybe<TemperatureKind>;
};


/** A floor thermostat. */
export type HeatingFloorThermostatMinAmbientTempSetpointLimitArgs = {
  kind?: InputMaybe<TemperatureKind>;
};


/** A floor thermostat. */
export type HeatingFloorThermostatPowerArgs = {
  kind?: InputMaybe<PowerKind>;
};

export type HiloId = {
  __typename?: 'HiloId';
  id: Scalars['String']['output'];
};

export type IBasicDevice = {
  connectionStatus?: Maybe<DeviceConnectionStatus>;
  deviceType: Scalars['String']['output'];
  gatewayHiloId: Scalars['String']['output'];
  hiloId: Scalars['String']['output'];
  lastConnectionTime: Scalars['DateTime']['output'];
  lastUpdate: Scalars['DateTime']['output'];
  lastUpdateVersion: Scalars['UnsignedLong']['output'];
  locationHiloId: Scalars['String']['output'];
  physicalAddress: Scalars['String']['output'];
  source: Scalars['String']['output'];
};

export type IBasicDeviceFilterInput = {
  and?: InputMaybe<Array<IBasicDeviceFilterInput>>;
  deviceType?: InputMaybe<StringOperationFilterInput>;
  hiloId?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<IBasicDeviceFilterInput>>;
  source?: InputMaybe<StringOperationFilterInput>;
};

export enum LightColorMode {
  Color = 'COLOR',
  White = 'WHITE'
}

export enum LightDeviceKind {
  Generic = 'GENERIC'
}

export enum LightType {
  Color = 'COLOR',
  White = 'WHITE'
}

export enum LowVoltageCurrentState {
  Cooling = 'COOLING',
  Heating = 'HEATING',
  Off = 'OFF',
  Unknown = 'UNKNOWN'
}

export enum LowVoltageFanCurrentState {
  Off = 'OFF',
  On = 'ON',
  Unknown = 'UNKNOWN'
}

export enum LowVoltageFanMode {
  Auto = 'AUTO',
  Circulate = 'CIRCULATE',
  FollowSchedule = 'FOLLOW_SCHEDULE',
  Off = 'OFF',
  On = 'ON',
  Unknown = 'UNKNOWN'
}

/** A 24V thermostat. */
export type LowVoltageThermostat = IBasicDevice & {
  __typename?: 'LowVoltageThermostat';
  alerts?: Maybe<Array<Scalars['String']['output']>>;
  allowedModes: Array<ThermostatMode>;
  ambientHumidity?: Maybe<Scalars['Int']['output']>;
  /** The ambient temperature setpoint */
  ambientTempSetpoint?: Maybe<TemperatureUnit>;
  ambientTemperature: TemperatureUnit;
  connectionStatus?: Maybe<DeviceConnectionStatus>;
  /** Cool temperature setpoint */
  coolTempSetpoint?: Maybe<TemperatureUnit>;
  currentState: LowVoltageCurrentState;
  deviceType: Scalars['String']['output'];
  fanAllowedModes: Array<LowVoltageFanMode>;
  fanCurrentState: LowVoltageFanCurrentState;
  fanMode: LowVoltageFanMode;
  fanSpeed?: Maybe<Scalars['Int']['output']>;
  gDState: DeviceGdState;
  gatewayHiloId: Scalars['String']['output'];
  /** Heat demand is the delta between the actual temperature and the desired temperature */
  heatDemand?: Maybe<Scalars['Int']['output']>;
  hiloId: Scalars['String']['output'];
  lastConnectionTime: Scalars['DateTime']['output'];
  lastUpdate: Scalars['DateTime']['output'];
  lastUpdateVersion: Scalars['UnsignedLong']['output'];
  locationHiloId: Scalars['String']['output'];
  maxAmbientCoolSetPoint?: Maybe<TemperatureUnit>;
  /** Highest Ambient temperature setpoint */
  maxAmbientTempSetpoint?: Maybe<TemperatureUnit>;
  /** Highest Ambient temperature setpoint possible for the thermostat */
  maxAmbientTempSetpointLimit?: Maybe<TemperatureUnit>;
  minAmbientCoolSetPoint?: Maybe<TemperatureUnit>;
  /** Lowest Ambient temperature setpoint */
  minAmbientTempSetpoint?: Maybe<TemperatureUnit>;
  /** Lowest Ambient temperature setpoint possible for the thermostat */
  minAmbientTempSetpointLimit?: Maybe<TemperatureUnit>;
  mode: ThermostatMode;
  model?: Maybe<Scalars['String']['output']>;
  physicalAddress: Scalars['String']['output'];
  power?: Maybe<PowerUnit>;
  source: Scalars['String']['output'];
  thermostatType: ThermostatKind;
  version?: Maybe<Scalars['String']['output']>;
  zigbeeVersion?: Maybe<Scalars['String']['output']>;
};


/** A 24V thermostat. */
export type LowVoltageThermostatAmbientTempSetpointArgs = {
  kind?: InputMaybe<TemperatureKind>;
};


/** A 24V thermostat. */
export type LowVoltageThermostatAmbientTemperatureArgs = {
  kind?: InputMaybe<TemperatureKind>;
};


/** A 24V thermostat. */
export type LowVoltageThermostatMaxAmbientTempSetpointArgs = {
  kind?: InputMaybe<TemperatureKind>;
};


/** A 24V thermostat. */
export type LowVoltageThermostatMaxAmbientTempSetpointLimitArgs = {
  kind?: InputMaybe<TemperatureKind>;
};


/** A 24V thermostat. */
export type LowVoltageThermostatMinAmbientTempSetpointArgs = {
  kind?: InputMaybe<TemperatureKind>;
};


/** A 24V thermostat. */
export type LowVoltageThermostatMinAmbientTempSetpointLimitArgs = {
  kind?: InputMaybe<TemperatureKind>;
};


/** A 24V thermostat. */
export type LowVoltageThermostatPowerArgs = {
  kind?: InputMaybe<PowerKind>;
};

export type Operation = {
  __typename?: 'Operation';
  destinationInstance?: Maybe<Scalars['String']['output']>;
  device: Device;
  deviceType: Scalars['String']['output'];
  /** @deprecated GatewayHiloId should not be used, use LocationHiloId instead */
  gatewayHiloId: Scalars['String']['output'];
  /** @deprecated GatewayId should not be used, use LocationHiloId instead */
  gatewayId: Scalars['String']['output'];
  location: Container;
  locationHiloId: Scalars['String']['output'];
  message?: Maybe<Scalars['String']['output']>;
  methodName?: Maybe<Scalars['String']['output']>;
  operationId?: Maybe<Scalars['UUID']['output']>;
  sessionId?: Maybe<Scalars['UUID']['output']>;
  sourceInstance?: Maybe<Scalars['String']['output']>;
  status: OperationStatus;
  statusReason: OperationStatusReason;
  transmissionTime: Scalars['DateTime']['output'];
};

export enum OperationStatus {
  Accepted = 'ACCEPTED',
  Failed = 'FAILED',
  Rejected = 'REJECTED',
  Report = 'REPORT',
  Succeeded = 'SUCCEEDED',
  Superseded = 'SUPERSEDED',
  TimedOut = 'TIMED_OUT'
}

export enum OperationStatusReason {
  InvalidArgument = 'INVALID_ARGUMENT',
  None = 'NONE'
}

export enum PowerKind {
  BoilerHorsepower = 'BOILER_HORSEPOWER',
  BritishThermalUnitPerHour = 'BRITISH_THERMAL_UNIT_PER_HOUR',
  Decawatt = 'DECAWATT',
  Deciwatt = 'DECIWATT',
  ElectricalHorsepower = 'ELECTRICAL_HORSEPOWER',
  Femtowatt = 'FEMTOWATT',
  GigajoulePerHour = 'GIGAJOULE_PER_HOUR',
  Gigawatt = 'GIGAWATT',
  HydraulicHorsepower = 'HYDRAULIC_HORSEPOWER',
  JoulePerHour = 'JOULE_PER_HOUR',
  KilobritishThermalUnitPerHour = 'KILOBRITISH_THERMAL_UNIT_PER_HOUR',
  KilojoulePerHour = 'KILOJOULE_PER_HOUR',
  Kilowatt = 'KILOWATT',
  MechanicalHorsepower = 'MECHANICAL_HORSEPOWER',
  MegajoulePerHour = 'MEGAJOULE_PER_HOUR',
  Megawatt = 'MEGAWATT',
  MetricHorsepower = 'METRIC_HORSEPOWER',
  Microwatt = 'MICROWATT',
  MillijoulePerHour = 'MILLIJOULE_PER_HOUR',
  Milliwatt = 'MILLIWATT',
  Nanowatt = 'NANOWATT',
  Petawatt = 'PETAWATT',
  Picowatt = 'PICOWATT',
  Terawatt = 'TERAWATT',
  Watt = 'WATT'
}

export type PowerUnit = {
  __typename?: 'PowerUnit';
  kind: PowerKind;
  /** @deprecated Will be removed in future versions, use LastUpdate instead */
  lastUpate?: Maybe<Scalars['DateTime']['output']>;
  lastUpdate?: Maybe<Scalars['DateTime']['output']>;
  value?: Maybe<Scalars['Float']['output']>;
};

export type Query = {
  __typename?: 'Query';
  /**
   * Retrieve a location.
   *
   *
   * **Returns:**
   * A logical location. If the logical location does not exist, it will be created.
   */
  getLocation?: Maybe<Container>;
};


export type QueryGetLocationArgs = {
  id: Scalars['String']['input'];
};

export enum SmartMeterKind {
  Generic = 'GENERIC'
}

export type StringOperationFilterInput = {
  and?: InputMaybe<Array<StringOperationFilterInput>>;
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  eq?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ncontains?: InputMaybe<Scalars['String']['input']>;
  nendsWith?: InputMaybe<Scalars['String']['input']>;
  neq?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  nstartsWith?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<StringOperationFilterInput>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  /** Subscribe to updates from any device, including Smart Meters partitioned by the location hiloId. */
  onAnyDeviceUpdated: Operation;
  /** Subscribe to updates from any location */
  onAnyLocationUpdated: Operation;
};


export type SubscriptionOnAnyDeviceUpdatedArgs = {
  locationHiloId: Scalars['String']['input'];
};


export type SubscriptionOnAnyLocationUpdatedArgs = {
  locationHiloId: Scalars['String']['input'];
};

export enum SwitchKind {
  Generic = 'GENERIC'
}

export enum TemperatureKind {
  DegreeCelsius = 'DEGREE_CELSIUS',
  DegreeDelisle = 'DEGREE_DELISLE',
  DegreeFahrenheit = 'DEGREE_FAHRENHEIT',
  DegreeNewton = 'DEGREE_NEWTON',
  DegreeRankine = 'DEGREE_RANKINE',
  DegreeReaumur = 'DEGREE_REAUMUR',
  DegreeRoemer = 'DEGREE_ROEMER',
  Kelvin = 'KELVIN',
  MillidegreeCelsius = 'MILLIDEGREE_CELSIUS',
  SolarTemperature = 'SOLAR_TEMPERATURE'
}

export type TemperatureUnit = {
  __typename?: 'TemperatureUnit';
  kind: TemperatureKind;
  value?: Maybe<Scalars['Float']['output']>;
};

export enum ThermostatKind {
  Floor = 'FLOOR',
  Generic = 'GENERIC',
  LowVoltage = 'LOW_VOLTAGE'
}

export enum ThermostatMode {
  Auto = 'AUTO',
  AutoBypass = 'AUTO_BYPASS',
  AutoCool = 'AUTO_COOL',
  AutoHeat = 'AUTO_HEAT',
  Cool = 'COOL',
  EmergencyHeat = 'EMERGENCY_HEAT',
  Heat = 'HEAT',
  Manual = 'MANUAL',
  Off = 'OFF',
  SouthernAway = 'SOUTHERN_AWAY',
  Unknown = 'UNKNOWN'
}

/** A water heater. */
export type WaterHeater = IBasicDevice & {
  __typename?: 'WaterHeater';
  alerts?: Maybe<Array<Scalars['String']['output']>>;
  ccrAllowedModes: Array<CcrMode>;
  ccrMode: CcrMode;
  ccrType: CcrKind;
  connectionStatus?: Maybe<DeviceConnectionStatus>;
  deviceType: Scalars['String']['output'];
  gDState: DeviceGdState;
  gatewayHiloId: Scalars['String']['output'];
  /** High Temp Duration in seconds. */
  highTempDuration?: Maybe<Scalars['Int']['output']>;
  highTempThreshold?: Maybe<TemperatureUnit>;
  hiloId: Scalars['String']['output'];
  lastConnectionTime: Scalars['DateTime']['output'];
  lastUpdate: Scalars['DateTime']['output'];
  lastUpdateVersion: Scalars['UnsignedLong']['output'];
  locationHiloId: Scalars['String']['output'];
  lowTempThreshold?: Maybe<TemperatureUnit>;
  model?: Maybe<Scalars['String']['output']>;
  physicalAddress: Scalars['String']['output'];
  power?: Maybe<PowerUnit>;
  probeTemp?: Maybe<TemperatureUnit>;
  source: Scalars['String']['output'];
  state: DeviceState;
  version?: Maybe<Scalars['String']['output']>;
  zigbeeVersion?: Maybe<Scalars['String']['output']>;
};


/** A water heater. */
export type WaterHeaterPowerArgs = {
  kind?: InputMaybe<PowerKind>;
};

export type GetLocationQueryVariables = Exact<{
  locationHiloId: Scalars['String']['input'];
}>;


export type GetLocationQuery = { __typename?: 'Query', getLocation?: { __typename?: 'Container', hiloId: string, lastUpdate: any, lastUpdateVersion: any, devices: Array<{ __typename: 'BasicChargeController', deviceType: string, hiloId: string, physicalAddress: string, connectionStatus?: DeviceConnectionStatus | null } | { __typename: 'BasicDevice', deviceType: string, hiloId: string, physicalAddress: string, connectionStatus?: DeviceConnectionStatus | null } | { __typename: 'BasicDimmer', deviceType: string, hiloId: string, physicalAddress: string, connectionStatus?: DeviceConnectionStatus | null, state: DeviceState, level?: number | null, power?: { __typename?: 'PowerUnit', value?: number | null, kind: PowerKind } | null } | { __typename: 'BasicEVCharger', deviceType: string, hiloId: string, physicalAddress: string, connectionStatus?: DeviceConnectionStatus | null } | { __typename: 'BasicLight', deviceType: string, hiloId: string, physicalAddress: string, connectionStatus?: DeviceConnectionStatus | null, state: DeviceState, hue?: number | null, level?: number | null, saturation?: number | null, colorTemperature?: number | null, lightType: LightType } | { __typename: 'BasicSmartMeter', deviceType: string, hiloId: string, physicalAddress: string, connectionStatus?: DeviceConnectionStatus | null } | { __typename: 'BasicSwitch', deviceType: string, hiloId: string, physicalAddress: string, connectionStatus?: DeviceConnectionStatus | null, state: DeviceState, power?: { __typename?: 'PowerUnit', value?: number | null, kind: PowerKind } | null } | { __typename: 'BasicThermostat', deviceType: string, hiloId: string, physicalAddress: string, connectionStatus?: DeviceConnectionStatus | null, ambientHumidity?: number | null, gDState: DeviceGdState, version?: string | null, zigbeeVersion?: string | null, heatDemand?: number | null, mode: ThermostatMode, allowedModes: Array<ThermostatMode>, ambientTemperature: { __typename?: 'TemperatureUnit', value?: number | null, kind: TemperatureKind }, ambientTempSetpoint?: { __typename?: 'TemperatureUnit', value?: number | null, kind: TemperatureKind } | null, maxAmbientTempSetpoint?: { __typename?: 'TemperatureUnit', value?: number | null, kind: TemperatureKind } | null, minAmbientTempSetpoint?: { __typename?: 'TemperatureUnit', value?: number | null, kind: TemperatureKind } | null, maxAmbientTempSetpointLimit?: { __typename?: 'TemperatureUnit', value?: number | null, kind: TemperatureKind } | null, minAmbientTempSetpointLimit?: { __typename?: 'TemperatureUnit', value?: number | null, kind: TemperatureKind } | null, power?: { __typename?: 'PowerUnit', value?: number | null, kind: PowerKind } | null } | { __typename: 'Gateway', deviceType: string, hiloId: string, physicalAddress: string, connectionStatus?: DeviceConnectionStatus | null } | { __typename: 'HeatingFloorThermostat', deviceType: string, hiloId: string, physicalAddress: string, connectionStatus?: DeviceConnectionStatus | null, ambientHumidity?: number | null, gDState: DeviceGdState, version?: string | null, zigbeeVersion?: string | null, thermostatType: ThermostatKind, floorMode: FloorThermostatMode, power?: { __typename?: 'PowerUnit', value?: number | null, kind: PowerKind } | null, ambientTemperature: { __typename?: 'TemperatureUnit', value?: number | null, kind: TemperatureKind }, ambientTempSetpoint?: { __typename?: 'TemperatureUnit', value?: number | null, kind: TemperatureKind } | null, maxAmbientTempSetpoint?: { __typename?: 'TemperatureUnit', value?: number | null, kind: TemperatureKind } | null, minAmbientTempSetpoint?: { __typename?: 'TemperatureUnit', value?: number | null, kind: TemperatureKind } | null, floorLimit?: { __typename?: 'TemperatureUnit', value?: number | null } | null } | { __typename: 'LowVoltageThermostat', deviceType: string, hiloId: string, physicalAddress: string, connectionStatus?: DeviceConnectionStatus | null } | { __typename: 'WaterHeater', deviceType: string, hiloId: string, physicalAddress: string, connectionStatus?: DeviceConnectionStatus | null }> } | null };

export type OnAnyDeviceUpdatedSubscriptionVariables = Exact<{
  locationHiloId: Scalars['String']['input'];
}>;


export type OnAnyDeviceUpdatedSubscription = { __typename?: 'Subscription', onAnyDeviceUpdated: { __typename?: 'Operation', deviceType: string, locationHiloId: string, transmissionTime: any, operationId?: any | null, status: OperationStatus, device: { __typename: 'BasicChargeController' } | { __typename: 'BasicDevice' } | { __typename: 'BasicDimmer', deviceType: string, hiloId: string, physicalAddress: string, connectionStatus?: DeviceConnectionStatus | null, state: DeviceState, level?: number | null, power?: { __typename?: 'PowerUnit', value?: number | null, kind: PowerKind } | null } | { __typename: 'BasicEVCharger' } | { __typename: 'BasicLight', deviceType: string, hiloId: string, physicalAddress: string, connectionStatus?: DeviceConnectionStatus | null, state: DeviceState, hue?: number | null, level?: number | null, saturation?: number | null, colorTemperature?: number | null, lightType: LightType } | { __typename: 'BasicSmartMeter' } | { __typename: 'BasicSwitch', deviceType: string, hiloId: string, physicalAddress: string, connectionStatus?: DeviceConnectionStatus | null, state: DeviceState, power?: { __typename?: 'PowerUnit', value?: number | null, kind: PowerKind } | null } | { __typename: 'BasicThermostat', deviceType: string, hiloId: string, physicalAddress: string, connectionStatus?: DeviceConnectionStatus | null, ambientHumidity?: number | null, gDState: DeviceGdState, version?: string | null, zigbeeVersion?: string | null, heatDemand?: number | null, mode: ThermostatMode, allowedModes: Array<ThermostatMode>, ambientTemperature: { __typename?: 'TemperatureUnit', value?: number | null, kind: TemperatureKind }, ambientTempSetpoint?: { __typename?: 'TemperatureUnit', value?: number | null, kind: TemperatureKind } | null, maxAmbientTempSetpoint?: { __typename?: 'TemperatureUnit', value?: number | null, kind: TemperatureKind } | null, minAmbientTempSetpoint?: { __typename?: 'TemperatureUnit', value?: number | null, kind: TemperatureKind } | null, maxAmbientTempSetpointLimit?: { __typename?: 'TemperatureUnit', value?: number | null, kind: TemperatureKind } | null, minAmbientTempSetpointLimit?: { __typename?: 'TemperatureUnit', value?: number | null, kind: TemperatureKind } | null, power?: { __typename?: 'PowerUnit', value?: number | null, kind: PowerKind } | null } | { __typename: 'Gateway' } | { __typename: 'HeatingFloorThermostat', deviceType: string, hiloId: string, physicalAddress: string, connectionStatus?: DeviceConnectionStatus | null, ambientHumidity?: number | null, gDState: DeviceGdState, version?: string | null, zigbeeVersion?: string | null, thermostatType: ThermostatKind, floorMode: FloorThermostatMode, power?: { __typename?: 'PowerUnit', value?: number | null, kind: PowerKind } | null, ambientTemperature: { __typename?: 'TemperatureUnit', value?: number | null, kind: TemperatureKind }, ambientTempSetpoint?: { __typename?: 'TemperatureUnit', value?: number | null, kind: TemperatureKind } | null, maxAmbientTempSetpoint?: { __typename?: 'TemperatureUnit', value?: number | null, kind: TemperatureKind } | null, minAmbientTempSetpoint?: { __typename?: 'TemperatureUnit', value?: number | null, kind: TemperatureKind } | null, floorLimit?: { __typename?: 'TemperatureUnit', value?: number | null } | null } | { __typename: 'LowVoltageThermostat' } | { __typename: 'WaterHeater' } } };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: DocumentTypeDecoration<TResult, TVariables>['__apiType'];
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}

export const GetLocationDocument = new TypedDocumentString(`
    query getLocation($locationHiloId: String!) {
  getLocation(id: $locationHiloId) {
    hiloId
    lastUpdate
    lastUpdateVersion
    devices {
      __typename
      deviceType
      hiloId
      physicalAddress
      connectionStatus
      ... on BasicSwitch {
        deviceType
        hiloId
        physicalAddress
        connectionStatus
        state
        power {
          value
          kind
        }
      }
      ... on BasicLight {
        deviceType
        hiloId
        physicalAddress
        connectionStatus
        state
        hue
        level
        saturation
        colorTemperature
        lightType
      }
      ... on HeatingFloorThermostat {
        deviceType
        hiloId
        physicalAddress
        connectionStatus
        ambientHumidity
        gDState
        version
        zigbeeVersion
        thermostatType
        physicalAddress
        floorMode
        power {
          value
          kind
        }
        ambientTemperature {
          value
          kind
        }
        ambientTempSetpoint {
          value
          kind
        }
        maxAmbientTempSetpoint {
          value
          kind
        }
        minAmbientTempSetpoint {
          value
          kind
        }
        floorLimit {
          value
        }
      }
      ... on BasicDimmer {
        deviceType
        hiloId
        physicalAddress
        connectionStatus
        state
        level
        power {
          value
          kind
        }
      }
      ... on BasicThermostat {
        deviceType
        hiloId
        physicalAddress
        connectionStatus
        ambientHumidity
        gDState
        version
        zigbeeVersion
        ambientTemperature {
          value
          kind
        }
        ambientTempSetpoint {
          value
          kind
        }
        maxAmbientTempSetpoint {
          value
          kind
        }
        minAmbientTempSetpoint {
          value
          kind
        }
        maxAmbientTempSetpointLimit {
          value
          kind
        }
        minAmbientTempSetpointLimit {
          value
          kind
        }
        heatDemand
        power {
          value
          kind
        }
        mode
        allowedModes
      }
    }
  }
}
    `) as unknown as TypedDocumentString<GetLocationQuery, GetLocationQueryVariables>;
export const OnAnyDeviceUpdatedDocument = new TypedDocumentString(`
    subscription onAnyDeviceUpdated($locationHiloId: String!) {
  onAnyDeviceUpdated(locationHiloId: $locationHiloId) {
    deviceType
    locationHiloId
    transmissionTime
    operationId
    status
    device {
      __typename
      ... on BasicSwitch {
        deviceType
        hiloId
        physicalAddress
        connectionStatus
        state
        power {
          value
          kind
        }
      }
      ... on BasicLight {
        deviceType
        hiloId
        physicalAddress
        connectionStatus
        state
        hue
        level
        saturation
        colorTemperature
        lightType
      }
      ... on HeatingFloorThermostat {
        deviceType
        hiloId
        physicalAddress
        connectionStatus
        ambientHumidity
        gDState
        version
        zigbeeVersion
        thermostatType
        physicalAddress
        floorMode
        power {
          value
          kind
        }
        ambientTemperature {
          value
          kind
        }
        ambientTempSetpoint {
          value
          kind
        }
        maxAmbientTempSetpoint {
          value
          kind
        }
        minAmbientTempSetpoint {
          value
          kind
        }
        floorLimit {
          value
        }
      }
      ... on BasicDimmer {
        deviceType
        hiloId
        physicalAddress
        connectionStatus
        state
        level
        power {
          value
          kind
        }
      }
      ... on BasicThermostat {
        deviceType
        hiloId
        physicalAddress
        connectionStatus
        ambientHumidity
        gDState
        version
        zigbeeVersion
        ambientTemperature {
          value
          kind
        }
        ambientTempSetpoint {
          value
          kind
        }
        maxAmbientTempSetpoint {
          value
          kind
        }
        minAmbientTempSetpoint {
          value
          kind
        }
        maxAmbientTempSetpointLimit {
          value
          kind
        }
        minAmbientTempSetpointLimit {
          value
          kind
        }
        heatDemand
        power {
          value
          kind
        }
        mode
        allowedModes
      }
    }
  }
}
    `) as unknown as TypedDocumentString<OnAnyDeviceUpdatedSubscription, OnAnyDeviceUpdatedSubscriptionVariables>;