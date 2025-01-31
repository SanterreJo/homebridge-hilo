export const SUPPORTED_DEVICE_TYPES = [
	"LightSwitch",
	"LightDimmer",
	"ColorBulb",
	"WhiteBulb",
	"Thermostat",
	"FloorThermostat",
	"Outlet",
	"Challenge",
] as const;
export type DeviceType = typeof SUPPORTED_DEVICE_TYPES[number];
export type LightType = Extract<
	DeviceType,
	"LightSwitch" | "LightDimmer" | "ColorBulb" | "WhiteBulb"
>;
export type ClimateType = Extract<DeviceType, "Thermostat" | "FloorThermostat">;

export interface DeviceValue {
	deviceId: number;
	locationId: number;
	timeStampUTC: string;
	attribute:
		| "OnOff"
		| "Intensity"
		| "CurrentTemperature"
		| "TargetTemperature"
		| "Heating"
		| "MaxTempSetPoint"
		| "MinTempSetPoint"
		| "Humidity"
		| "Challenge";
	value: unknown;
	valueType: unknown;
}

interface OnOffDeviceValue extends DeviceValue {
	attribute: "OnOff";
	value: boolean;
	valueType: "OnOff";
}

interface IntensityDeviceValue extends DeviceValue {
	attribute: "Intensity";
	value: number;
	valueType: "Percentage";
}

interface CurrentTemperatureDeviceValue extends DeviceValue {
	attribute: "CurrentTemperature";
	value: number;
	valueType: string;
}

interface TargetTemperatureDeviceValue extends DeviceValue {
	attribute: "TargetTemperature";
	value: number;
	valueType: string;
}

interface HeatingDeviceValue extends DeviceValue {
	attribute: "Heating";
	value: number;
	valueType: "Percentage";
}

interface MaxTempSetPointDeviceValue extends DeviceValue {
	attribute: "MaxTempSetPoint";
	value: number;
	valueType: string;
}

interface MinTempSetPointDeviceValue extends DeviceValue {
	attribute: "MinTempSetPoint";
	value: number;
	valueType: string;
}

interface HumidityDeviceValue extends DeviceValue {
	attribute: "Humidity";
	value: number;
	valueType: "Percentage";
}

interface ChallengeDeviceValue extends DeviceValue {
	attribute: "Challenge";
	value: boolean;
	valueType: "Boolean";
}

export type Device = {
	id: number;
	assetId: string;
	identifier: string;
	name: string;
	type: DeviceType;
	locationId: number;
	modelNumber: string;
};

type DeviceValueAttributeMap<T extends Device["type"]> = T extends LightType
	? OnOffDeviceValue | IntensityDeviceValue
	: T extends ClimateType
	?
			| CurrentTemperatureDeviceValue
			| TargetTemperatureDeviceValue
			| HeatingDeviceValue
			| MaxTempSetPointDeviceValue
			| MinTempSetPointDeviceValue
			| HumidityDeviceValue
	: T extends "Outlet"
	? OnOffDeviceValue
	: T extends "Challenge"
	? ChallengeDeviceValue
	: never;

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

export type HiloAccessoryContext<T extends Device["type"] = Device["type"]> = {
	values: Partial<{
		[P in DeviceValue["attribute"]]: Extract<
			DeviceValueAttributeMap<T>,
			{ attribute: P }
		>;
	}>;
	device: Device;
};
