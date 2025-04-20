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
import { getWsAccessToken, hiloApi, negotiate } from "./hiloApi";
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

const PLUGIN_NAME = "homebridge hilo";
const PLATFORM_NAME = "Hilo";

export default function (api: API) {
	api.registerPlatform(PLATFORM_NAME, Hilo);
}

class Hilo implements DynamicPlatformPlugin {
	private readonly pluginAccessories: Record<string, HiloDevice<any>> = {};
	private locations: Location[] = [];
	private webSocketRetries = 0;
	private wsConnection: signalR.HubConnection | null = null;
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
		if (!this.config.refreshToken) {
			this.log.error("Please login with hilo in the plugin configuration page");
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
			if (this.config.noChallengeSensor !== true) {
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
				}, /* 4 hours */ 4 * 60 * 60 * 1000);
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
	): PlatformAccessory<HiloAccessoryContext<Device["type"]>> {
		const uuid = this.api.hap.uuid.generate(device.assetId);
		const accessory = new this.api.platformAccessory<
			HiloAccessoryContext<Device["type"]>
		>(device.name.trim(), uuid);
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
			return;
		}
		if (!url) return;
		this.wsConnection = new signalR.HubConnectionBuilder()
			.withUrl(url, { accessTokenFactory: getWsAccessToken })
			.configureLogging(signalRLogger)
			.build();
		this.wsConnection.on("Heartbeat", (message) =>
			this.log.debug(`Heartbeat: ${message}`)
		);
		this.wsConnection.on(
			"DevicesValuesReceived",
			(message: Array<DeviceValue>) => {
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
			}
		);
		this.wsConnection.on("GatewayValuesReceived", (message: any) => {
			this.log.debug(`GatewayValuesReceived:`, message);
		});
		this.wsConnection.on("DeviceListInitialValuesReceived", (message: any) => {
			this.log.debug(`DeviceListInitialValuesReceived`, message);
		});
		this.wsConnection.onreconnecting(() => {
			this.log.info("Reconnecting to websocket");
		});
		this.wsConnection.onreconnected(() => {
			this.log.info("Reconnected to websocket");
		});
		this.wsConnection.onclose(() => {
			this.log.info("Disconnected from websocket");
			this.retryWebsocketConnection();
		});
		try {
			await this.wsConnection.start();
			this.log.info("Connected to websocket");
		} catch (e) {
			this.log.error("Unable to start websocket connection", e);
			this.retryWebsocketConnection();
			return;
		}
		for (const location of this.locations) {
			try {
				await this.wsConnection.invoke(
					"SubscribeToLocation",
					location.id.toString()
				);
			} catch (e) {
				this.log.error(`Unable to subscribe to location ${location.id}`, e);
				this.stopWebsocket();
				this.retryWebsocketConnection();
				return;
			}
		}
		this.webSocketRetries = 0;
	}

	retryWebsocketConnection() {
		if (this.webSocketRetries > 8) {
			this.log.error(
				`Unable to reconnect to websocket after ${this.webSocketRetries} attempts`
			);
			return;
		}
		const backoff = 2 ** this.webSocketRetries * 30_000;
		this.log.info(
			`Attempting to reconnect to websocket in ${backoff / 1000} seconds`
		);
		setTimeout(async () => {
			this.webSocketRetries++;
			this.log.info(`Reconnection attempt ${this.webSocketRetries}`);
			this.setupWebsocketConnection();
		}, backoff);
	}

	stopWebsocket() {
		try {
			this.wsConnection?.stop();
		} catch (e) {
			this.log.error(`Unable to stop wsConnection`, e);
		}
	}

	private async updateChallenges(location: Location) {
		if (this.config.noChallengeSensor === true) {
			return;
		}
		try {
			const response = await hiloApi.get<EventsResponse>(
				`/GDService/v1/api/Locations/${location.id}/Events`,
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
		const response = await hiloApi.get<LocationsResponse>(
			"/Automation/v1/api/Locations",
			{
				params: { force: true },
			}
		);
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
		const response = await hiloApi.get<DevicesResponse>(
			`/Automation/v1/api/Locations/${location.id}/Devices`,
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
		name: `Preheat Hilo Challenge ${location.name}`,
		type: "Challenge",
		locationId: location.id,
		modelNumber: "Hilo Challenge",
		identifier: `preheat-hilo-challenge-${location.id}`,
	},
	{
		assetId: `reduction-hilo-challenge-${location.id}`,
		id: location.id + 101,
		name: `Reduction Hilo Challenge ${location.name}`,
		type: "Challenge",
		locationId: location.id,
		modelNumber: "Hilo Challenge",
		identifier: `reduction-hilo-challenge-${location.id}`,
	},
	{
		assetId: `recovery-hilo-challenge-${location.id}`,
		id: location.id + 102,
		name: `Recovery Hilo Challenge ${location.name}`,
		type: "Challenge",
		locationId: location.id,
		modelNumber: "Hilo Challenge",
		identifier: `recovery-hilo-challenge-${location.id}`,
	},
	{
		assetId: `plannedAM-hilo-challenge-${location.id}`,
		id: location.id + 103,
		name: `Planned AM Hilo Challenge ${location.name}`,
		type: "Challenge",
		locationId: location.id,
		modelNumber: "Hilo Challenge",
		identifier: `plannedAM-hilo-challenge-${location.id}`,
	},
	{
		assetId: `plannedPM-hilo-challenge-${location.id}`,
		id: location.id + 104,
		name: `Planned PM Hilo Challenge ${location.name}`,
		type: "Challenge",
		locationId: location.id,
		modelNumber: "Hilo Challenge",
		identifier: `plannedPM-hilo-challenge-${location.id}`,
	},
	{
		assetId: `inProgress-hilo-challenge-${location.id}`,
		id: location.id + 105,
		name: `In Progress Hilo Challenge ${location.name}`,
		type: "Challenge",
		locationId: location.id,
		modelNumber: "Hilo Challenge",
		identifier: `inProgress-hilo-challenge-${location.id}`,
	},
];
