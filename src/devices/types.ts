export const SUPPORTED_DEVICE_TYPES = ["LightDimmer", "Thermostat"] as const;
export type DeviceType = typeof SUPPORTED_DEVICE_TYPES[number];

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
		| "Humidity";
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

export type Device = {
	id: number;
	assetId: string;
	identifier: string;
	gatewayId: string;
	gatewayExternalId: string;
	name: string;
	type: DeviceType;
	groupId: null;
	category: string;
	icon: null;
	loadConnected: null;
	modelNumber: string;
	locationId: number;
	parameters: null;
	externalGroup: string;
	provider: number;
	providerData: null;
	supportedAttributes: string;
	settableAttributes: string;
	supportedParameters: string;
};

type DeviceValueAttributeMap<T extends Device["type"]> = T extends "LightDimmer"
	? OnOffDeviceValue | IntensityDeviceValue
	: T extends "Thermostat"
	?
			| CurrentTemperatureDeviceValue
			| TargetTemperatureDeviceValue
			| HeatingDeviceValue
			| MaxTempSetPointDeviceValue
			| MinTempSetPointDeviceValue
			| HumidityDeviceValue
	: never;

export type HiloAccessoryContext<T extends Device["type"] = Device["type"]> = {
	values: Partial<{
		[P in DeviceValue["attribute"]]: Extract<
			DeviceValueAttributeMap<T>,
			{ attribute: P }
		>;
	}>;
	device: Device;
};
