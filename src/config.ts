import { PlatformConfig } from "homebridge";

let _config: PlatformConfig;
export const setConfig = (config: PlatformConfig) => {
	_config = config;
};
export const getConfig = () => _config;
