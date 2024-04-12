import { PlatformConfig } from "homebridge";

export type HiloConfig = PlatformConfig & {
	noChallengeSensor: boolean;
	plannedHours: number;
};

const defaultConfig: Partial<HiloConfig> = {
	noChallengeSensor: false,
	plannedHours: 2,
};

let _config: HiloConfig;
export const setConfig = (config: HiloConfig) => {
	_config = { ...defaultConfig, ...config };
};
export const getConfig = () => _config;
