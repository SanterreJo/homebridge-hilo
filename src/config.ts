import { PlatformConfig } from "homebridge";

export type Vendor = "hilo" | "allia";
export type HiloConfig = PlatformConfig & {
	username: string;
	password: string;
	vendor: Vendor;
	noChallengeSensor: boolean;
	plannedHours: number;
};

const defaultConfig: Partial<HiloConfig> = {
	username: "",
	password: "",
	vendor: "hilo",
	noChallengeSensor: false,
	plannedHours: 2,
};

let _config: HiloConfig;
export const setConfig = (config: HiloConfig) => {
	_config = { ...defaultConfig, ...config };
};
export const getConfig = () => _config;
