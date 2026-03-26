import {
  BasicDimmer,
  BasicLight,
  BasicThermostat,
  Device,
  HeatingFloorThermostat,
} from "../graphql/graphql";
import { SignalRDevice } from "../deviceHub";

export const SUPPORTED_DEVICES = [
  "BasicLight",
  "BasicDimmer",
  "BasicThermostat",
  "HeatingFloorThermostat",
  "BasicSwitch",
];

export type SupportedDevice = (typeof SUPPORTED_DEVICES)[number];

export type DeviceAccessory<T extends Device> = {
  device: SignalRDevice;
  graphqlDevice: T;
};

export type LightDevice = BasicLight | BasicDimmer;
export type ClimateDevice = BasicThermostat | HeatingFloorThermostat;
