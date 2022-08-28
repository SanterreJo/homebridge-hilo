import { API, PlatformAccessory } from "homebridge";
import { HiloDevice } from "./HiloDevice";
import { Light } from "./Light";
import { Outlet } from "./Outlet";
import { Thermostat } from "./Thermostat";
import { Device, HiloAccessoryContext } from "./types";

export const initializeHiloDevice: {
	[T in Device["type"]]: (
		accessory: PlatformAccessory<HiloAccessoryContext<T>>,
		api: API
	) => HiloDevice<T>;
} = {
	LightSwitch: (accessory, api) => new Light(accessory, api, { canDim: false }),
	LightDimmer: (accessory, api) => new Light(accessory, api),
	WhiteBulb: (accessory, api) => new Light(accessory, api),
	ColorBulb: (accessory, api) => new Light(accessory, api),
	Thermostat: (accessory, api) => new Thermostat(accessory, api),
	Outlet: (accessory, api) => new Outlet(accessory, api),
};
