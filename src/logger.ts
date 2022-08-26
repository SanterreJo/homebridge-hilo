import { LogLevel } from "@microsoft/signalr";
import { Logging } from "homebridge";

let _log: Logging;
export const setLogger = (log: Logging) => {
	_log = log;
};
export const getLogger = () => _log;

export const signalRLogger = {
	log: (level: LogLevel, message: string) => {
		const logger = getLogger();
		switch (level) {
			case LogLevel.Trace:
				logger.debug(message);
				break;
			case LogLevel.Debug:
				logger.debug(message);
				break;
			case LogLevel.Information:
				logger.debug(message);
				break;
			case LogLevel.Warning:
				logger.warn(message);
				break;
			case LogLevel.Error:
				logger.error(message);
				break;
			case LogLevel.Critical:
				logger.error(message);
				break;
			case LogLevel.None:
				break;
		}
	},
};
