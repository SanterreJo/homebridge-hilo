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

export type SupportedDevice = typeof SUPPORTED_DEVICES[number];

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
	locationId: string;
	id: string;
	name: string;
	assetId: string;
	hiloId: string;
};

export type DeviceAccessory<T extends Device> = {
	device: T;
	oldApiDevice: OldApiDevice;
};

export type LightDevice = BasicLight | BasicDimmer;
export type ClimateDevice = BasicThermostat | HeatingFloorThermostat;

export type ChallengeAccessory = {
	device: {
		value: boolean;
		phase: string;
		hiloId: string;
	};
};
