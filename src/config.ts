import { PlatformConfig } from "homebridge";

export type HiloConfig = PlatformConfig & {
	username: string;
	password: string;
	noChallengeSensor: boolean;
	plannedHours: number;
};

const defaultConfig: Partial<HiloConfig> = {
	username: "",
	password: "",
	noChallengeSensor: false,
	plannedHours: 2,
};

let _config: HiloConfig;
export const setConfig = (config: HiloConfig) => {
	_config = { ...defaultConfig, ...config };
};
export const getConfig = () => _config;
