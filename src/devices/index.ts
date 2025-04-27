import { API, PlatformAccessory } from "homebridge";
import { HiloDevice } from "./HiloDevice";
import { Light } from "./Light";
import { Outlet } from "./Outlet";
import { Thermostat } from "./Thermostat";
import { Device } from "../graphql/graphql";
import { DeviceAccessory, SupportedDevice } from "./types";

export const initializeHiloDevice: {
  [T in SupportedDevice]: (
    accessory: PlatformAccessory<
      DeviceAccessory<Extract<Device, { __typename: T }>>
    >,
    api: API,
  ) => HiloDevice<Device>;
} = {
  BasicLight: (accessory, api) => new Light(accessory, api),
  BasicDimmer: (accessory, api) => new Light(accessory, api),
  BasicThermostat: (accessory, api) => new Thermostat(accessory, api),
  HeatingFloorThermostat: (accessory, api) => new Thermostat(accessory, api),
  BasicSwitch: (accessory, api) => new Outlet(accessory, api),
};
