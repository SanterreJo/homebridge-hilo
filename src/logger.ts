import { Logging } from "homebridge";

let _log: Logging;
export const setLogger = (log: Logging) => {
  _log = log;
};
export const getLogger = () => _log;
