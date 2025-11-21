import {
  BasicDimmer,
  BasicLight,
  BasicThermostat,
  Device,
  HeatingFloorThermostat,
} from "../graphql/graphql";

export const SUPPORTED_DEVICES = [
  "BasicLight",
  "BasicDimmer",
  "BasicThermostat",
  "HeatingFloorThermostat",
  "BasicSwitch",
];

export type SupportedDevice = (typeof SUPPORTED_DEVICES)[number];

export type OldApiDevice = {
  type: "Thermostat" | "LightDimmer";
  locationId: string;
  id: string;
  name: string;
  assetId: string;
  hiloId: string;
};

export type DeviceAccessory<T extends Device> = {
  device: OldApiDevice;
  graphqlDevice: T;
};

export type LightDevice = BasicLight | BasicDimmer;
export type ClimateDevice = BasicThermostat | HeatingFloorThermostat;
