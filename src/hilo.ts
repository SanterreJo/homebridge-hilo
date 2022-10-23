import {
	API,
	APIEvent,
	DynamicPlatformPlugin,
	Logging,
	PlatformAccessory,
	PlatformConfig,
} from "homebridge";
import * as signalR from "@microsoft/signalr";
import { setConfig } from "./config";
import { getLogger, setLogger, signalRLogger } from "./logger";
import { setApi } from "./api";
import { automationApi, getWsAccessToken, negociate } from "./hiloApi";
import {
	Device,
	DeviceValue,
	HiloAccessoryContext,
	SUPPORTED_DEVICE_TYPES,
} from "./devices/types";
import { initializeHiloDevice } from "./devices";
import axios from "axios";
import { HiloDevice } from "./devices/HiloDevice";

const PLUGIN_NAME = "homebridge-hilo";
const PLATFORM_NAME = "Hilo";

export default function (api: API) {
	api.registerPlatform(PLATFORM_NAME, Hilo);
}

class Hilo implements DynamicPlatformPlugin {
	constructor(
		private readonly log: Logging,
		private readonly config: PlatformConfig,
		private readonly api: API,
		private readonly accessories: Record<
			string,
			PlatformAccessory<HiloAccessoryContext>
		> = {},
		private readonly pluginAccessories: Record<string, HiloDevice<any>> = {}
	) {
		if (!config.username || !config.password) {
			this.log.error(
				"Please provide a username and password in the config.json file"
			);
			return;
		}
		setConfig(config);
		setLogger(log);
		setApi(api);
		log.info("Initializing Hilo platform");
		api.on(APIEvent.DID_FINISH_LAUNCHING, async () => {
			const locations = await fetchLocations();
			if (locations.length === 0) {
				log.error("No locations found");
				return;
			}
			const devices = (
				await Promise.all(locations.map((location) => fetchDevices(location)))
			).flatMap((response) => response);
			if (devices.length === 0) {
				log.error("No devices found");
				return;
			}
			devices.forEach((device) => {
				if (!SUPPORTED_DEVICE_TYPES.includes(device.type)) {
					this.log.debug("Unsupported device", device);
					return;
				}
				let accessory = this.accessories[device.id.toString()];
				if (!accessory) {
					accessory = this.setupNewAccessory(device);
				}
				this.pluginAccessories[device.id.toString()] = initializeHiloDevice[
					device.type
				](accessory, this.api);
			});
			let url: string | undefined = undefined;
			try {
				const response = await negociate();
				url = response.url;
			} catch (error) {
				log.error(
					"Unable to connect to websocket",
					axios.isAxiosError(error) ? error.response?.data : error
				);
			}
			if (!url) return;
			const connection = new signalR.HubConnectionBuilder()
				.withUrl(url, { accessTokenFactory: getWsAccessToken })
				.withAutomaticReconnect()
				.configureLogging(signalRLogger)
				.build();
			connection.on("Heartbeat", (message) =>
				this.log.debug(`Heartbeat: ${message}`)
			);
			connection.on("DevicesValuesReceived", (message: Array<DeviceValue>) => {
				this.log.debug(`DevicesValuesReceived:`, message);
				message.forEach((value) => {
					const accessory = this.accessories[value.deviceId.toString()];
					const pluginAccessory =
						this.pluginAccessories[value.deviceId.toString()];
					if (!accessory || !pluginAccessory) {
						this.log.debug(`No accessory for device ${value.deviceId}`);
						return;
					}
					pluginAccessory.updateValue(value as any);
				});
			});
			let tryingToReconnect = false;
			connection.onreconnecting(() => {
				tryingToReconnect = true;
				this.log.info("Reconnecting to websocket");
			});
			connection.onreconnected(() => {
				tryingToReconnect = false;
				this.log.info("Reconnected to websocket");
			});
			connection.onclose(async () => {
				this.log.info("Disconnected from websocket");
				if (tryingToReconnect) {
					this.log.info("Attempting to reconnect to websocket");
					await negociate();
					connection.start();
				}
			});
			await connection.start();
			for (const location of locations) {
				try {
					await connection.invoke(
						"SubscribeToLocation",
						location.id.toString()
					);
				} catch (e) {
					log.error(`Unable to subscribe to location ${location.id}`, e);
				}
			}
			const currentDeviceAssetIds = devices.map((device) => device.assetId);
			const staleAccessories = Object.values(this.accessories).filter(
				(accessory) =>
					!currentDeviceAssetIds.includes(accessory.context.device.assetId)
			);
			this.log.debug(
				`Found ${staleAccessories.length} accessories removing...`
			);
			this.api.unregisterPlatformAccessories(
				PLUGIN_NAME,
				PLATFORM_NAME,
				staleAccessories
			);
			log.info("Hilo platform is ready");
		});
	}

	configureAccessory(accessory: PlatformAccessory<HiloAccessoryContext>): void {
		this.log.debug(`Configuring accessory from cache ${accessory.displayName}`);
		this.accessories[accessory.context.device.id.toString()] = accessory;
	}

	private setupNewAccessory(
		device: Device
	): PlatformAccessory<HiloAccessoryContext> {
		const uuid = this.api.hap.uuid.generate(device.assetId);
		const accessory = new this.api.platformAccessory<HiloAccessoryContext>(
			device.name,
			uuid
		);
		accessory.context.device = device;
		accessory.context.values = {};
		this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [
			accessory,
		]);
		this.accessories[accessory.context.device.id.toString()] = accessory;
		return accessory;
	}
}

type Location = {
	id: number;
	adressId: string;
	name: string;
	energyCostConfigured: boolean;
	postalCode: string;
	countryCode: string;
	temperatureFormat: string;
	timeFormat: string;
	timeZone: string;
	gatewayCount: number;
	createdUtc: string;
};
type LocationsResponse = Array<Location>;
async function fetchLocations() {
	getLogger().debug("Fetching locations");
	try {
		const response = await automationApi.get<LocationsResponse>("/Locations", {
			params: { force: true },
		});
		return response.data;
	} catch (error) {
		getLogger().error(
			"Error while fetching locations",
			axios.isAxiosError(error) ? error.response?.data : error
		);
		return [];
	}
}

type DevicesResponse = Array<Device>;
async function fetchDevices(location: Location) {
	getLogger().debug("Fetching devices for location", location.name);
	try {
		const response = await automationApi.get<DevicesResponse>(
			`/Locations/${location.id}/Devices`,
			{
				params: { force: true },
			}
		);
		return response.data;
	} catch (error) {
		getLogger().error(
			"Error while fetching devices",
			axios.isAxiosError(error) ? error.response?.data : error
		);
		return [];
	}
}
