import { PlatformConfig } from "homebridge";

export type HiloConfig = PlatformConfig & {
	noChallengeSensor: boolean;
	plannedHours: number;
	refreshToken: string;
};

const defaultConfig: Partial<HiloConfig> = {
	noChallengeSensor: false,
	plannedHours: 2,
	refreshToken: "",
};

let _config: HiloConfig;
export const setConfig = (config: HiloConfig) => {
	_config = { ...defaultConfig, ...config };
};
export const getConfig = () => _config;
