import { API } from "homebridge";

let _api: API;
export const setApi = (api: API) => {
	_api = api;
};
export const getApi = () => _api;
