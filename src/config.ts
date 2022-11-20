import { PlatformConfig } from "homebridge";

export type Vendor = "hilo" | "allia";
export type HiloConfig = PlatformConfig & {
	username: string;
	password: string;
	vendor: Vendor;
};

let _config: HiloConfig;
export const setConfig = (config: HiloConfig) => {
	_config = config;
};
export const getConfig = () => _config;
