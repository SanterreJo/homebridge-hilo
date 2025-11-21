import { PlatformConfig } from "homebridge";

export type HiloConfig = PlatformConfig & {
  refreshToken: string;
};

const defaultConfig: Partial<HiloConfig> = {
  refreshToken: "",
};

let _config: HiloConfig;
export const setConfig = (config: HiloConfig) => {
  _config = { ...defaultConfig, ...config };
};
export const getConfig = () => _config;
