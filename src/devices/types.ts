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

export type Challenge = {
  progress: string;
  isParticipating: boolean;
  isConfigurable: boolean;
  id: number;
  period: "am" | "pm";
  phases: {
    preheatStartDateUTC: string;
    preheatEndDateUTC: string;
    reductionStartDateUTC: string;
    reductionEndDateUTC: string;
    recoveryStartDateUTC: string;
    recoveryEndDateUTC: string;
  };
};
export type EventsResponse = Array<Challenge>;

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

export type ChallengeAccessory = {
  device: {
    assetId: string;
    id: number;
    name: string;
    type: "Challenge";
    locationId: number;
    modelNumber: string;
    identifier: string;
    hiloId?: string;
  };
  v4Device: {
    value: boolean;
    phase: string;
    localId: string;
  };
};
