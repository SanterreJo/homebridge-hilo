import {
	API,
	APIEvent,
	DynamicPlatformPlugin,
	Logging,
	PlatformAccessory,
	PlatformConfig,
} from "homebridge";
import * as signalR from "@microsoft/signalr";
import { getConfig, HiloConfig, setConfig } from "./config";
import { getLogger, setLogger, signalRLogger } from "./logger";
import { setApi } from "./api";
import {
	automationApi,
	eventsApi,
	getWsAccessToken,
	negotiate,
} from "./hiloApi";
import {
	Device,
	DeviceValue,
	EventsResponse,
	HiloAccessoryContext,
	SUPPORTED_DEVICE_TYPES,
} from "./devices/types";
import { initializeHiloDevice } from "./devices";
import axios from "axios";
import { HiloDevice } from "./devices/HiloDevice";
import { HiloChallengeSensor } from "./devices/HiloChallengeSensor";

const PLUGIN_NAME = "homebridge-hilo";
const PLATFORM_NAME = "Hilo";

export default function (api: API) {
	api.registerPlatform(PLATFORM_NAME, Hilo);
}

class Hilo implements DynamicPlatformPlugin {
	private readonly pluginAccessories: Record<string, HiloDevice<any>> = {};
	private locations: Location[] = [];
	private webSocketRetries = 0;
	constructor(
		private readonly log: Logging,
		private readonly config: PlatformConfig,
		private readonly api: API,
		private readonly accessories: Record<
			string,
			PlatformAccessory<HiloAccessoryContext>
		> = {}
	) {
		setConfig(config as HiloConfig);
		this.config = getConfig();
		if (!this.config.username || !this.config.password) {
			this.log.error(
				"Please provide a username and password in the config.json file"
			);
			return;
		}
		setLogger(log);
		setApi(api);
		log.info("Initializing Hilo platform");
		api.on(APIEvent.DID_FINISH_LAUNCHING, async () => {
			this.locations = await fetchLocations();
			if (this.locations.length === 0) {
				log.error("No locations found");
				return;
			}
			const devices = (
				await Promise.all(
					this.locations.map((location) => fetchDevices(location))
				)
			).flatMap((response) => response);
			if (devices.length === 0) {
				log.error("No devices found");
				return;
			}
			if (
				this.config.vendor === "hilo" &&
				this.config.noChallengeSensor !== true
			) {
				// Add Hilo Challenge sensor for each location
				this.locations.forEach((location) => {
					devices.push(...getHiloChallengeDevices(location));
				});
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
				const pluginAccessory = initializeHiloDevice[device.type](
					accessory,
					this.api
				);
				this.pluginAccessories[device.id.toString()] = pluginAccessory;
			});
			await this.setupWebsocketConnection();
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
			this.locations.forEach((location) => {
				setInterval(async () => {
					this.updateChallenges(location);
				}, /* 1 hour */ 60 * 60 * 1000);
				this.updateChallenges(location);
			});
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

	private async setupWebsocketConnection() {
		let url: string | undefined = undefined;
		try {
			const response = await negotiate();
			url = response.url;
		} catch (error) {
			this.log.error(
				"Unable to connect to websocket",
				axios.isAxiosError(error) ? error.response?.data : error
			);
			this.retryWebsocketConnection();
		}
		if (!url) return;
		const connection = new signalR.HubConnectionBuilder()
			.withUrl(url, { accessTokenFactory: getWsAccessToken })
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
		connection.on("GatewayValuesReceived", (message: any) => {
			this.log.debug(`GatewayValuesReceived:`, message);
		});
		connection.on("DeviceListInitialValuesReceived", (message: any) => {
			this.log.debug(`DeviceListInitialValuesReceived`, message);
		});
		connection.onreconnecting(() => {
			this.log.info("Reconnecting to websocket");
		});
		connection.onreconnected(() => {
			this.log.info("Reconnected to websocket");
		});
		connection.onclose(() => {
			this.log.info("Disconnected from websocket");
			this.retryWebsocketConnection();
		});
		try {
			await connection.start();
			this.webSocketRetries = 0;
			this.log.info("Connected to websocket");
		} catch (e) {
			this.log.error("Unable to start websocket connection", e);
			this.retryWebsocketConnection();
		}
		for (const location of this.locations) {
			try {
				await connection.invoke("SubscribeToLocation", location.id.toString());
			} catch (e) {
				this.log.error(`Unable to subscribe to location ${location.id}`, e);
			}
		}
	}

	retryWebsocketConnection() {
		const backoff = 2 ** this.webSocketRetries * 30_000;
		this.log.info(
			`Attempting to reconnect to websocket in ${backoff / 1000} seconds`
		);
		if (this.webSocketRetries < 5) {
			setTimeout(async () => {
				this.webSocketRetries++;
				this.log.info(`Reconnection attempt ${this.webSocketRetries}`);
				this.setupWebsocketConnection();
			}, backoff);
		} else {
			this.log.error(
				`Unable to reconnect to websocket after ${this.webSocketRetries} attempts`
			);
		}
	}

	private async updateChallenges(location: Location) {
		if (
			this.config.vendor !== "hilo" ||
			this.config.noChallengeSensor === true
		) {
			return;
		}
		try {
			const response = await eventsApi.get<EventsResponse>(
				`/Locations/${location.id}/Events`,
				{ params: { active: true } }
			);
			const challenges = response.data;
			const locationChallengeDevices = Object.values(
				this.pluginAccessories
			).filter(
				(device) =>
					device.device.locationId === location.id &&
					device.device.type === "Challenge"
			) as HiloChallengeSensor[];
			locationChallengeDevices.forEach((device) =>
				device.updateChallengeStatus(challenges)
			);
		} catch (error) {
			this.log.error("Could not retrieve Hilo Challenges", error);
		}
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

const getHiloChallengeDevices = (location: Location): Device[] => [
	{
		assetId: `preheat-hilo-challenge-${location.id}`,
		id: location.id + 100,
		name: `Preheat - Hilo Challenge ${location.name}`,
		type: "Challenge",
		locationId: location.id,
		modelNumber: "Hilo Challenge",
		identifier: `preheat-hilo-challenge-${location.id}`,
	},
	{
		assetId: `reduction-hilo-challenge-${location.id}`,
		id: location.id + 101,
		name: `Reduction - Hilo Challenge ${location.name}`,
		type: "Challenge",
		locationId: location.id,
		modelNumber: "Hilo Challenge",
		identifier: `reduction-hilo-challenge-${location.id}`,
	},
	{
		assetId: `recovery-hilo-challenge-${location.id}`,
		id: location.id + 102,
		name: `Recovery - Hilo Challenge ${location.name}`,
		type: "Challenge",
		locationId: location.id,
		modelNumber: "Hilo Challenge",
		identifier: `recovery-hilo-challenge-${location.id}`,
	},
	{
		assetId: `plannedAM-hilo-challenge-${location.id}`,
		id: location.id + 103,
		name: `Planned AM - Hilo Challenge ${location.name}`,
		type: "Challenge",
		locationId: location.id,
		modelNumber: "Hilo Challenge",
		identifier: `plannedAM-hilo-challenge-${location.id}`,
	},
	{
		assetId: `plannedPM-hilo-challenge-${location.id}`,
		id: location.id + 104,
		name: `Planned PM - Hilo Challenge ${location.name}`,
		type: "Challenge",
		locationId: location.id,
		modelNumber: "Hilo Challenge",
		identifier: `plannedPM-hilo-challenge-${location.id}`,
	},
	{
		assetId: `inProgress-hilo-challenge-${location.id}`,
		id: location.id + 105,
		name: `In Progress - Hilo Challenge ${location.name}`,
		type: "Challenge",
		locationId: location.id,
		modelNumber: "Hilo Challenge",
		identifier: `inProgress-hilo-challenge-${location.id}`,
	},
];
