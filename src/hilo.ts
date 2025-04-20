import {
	API,
	APIEvent,
	DynamicPlatformPlugin,
	Logging,
	PlatformAccessory,
	PlatformConfig,
} from "homebridge";
import { getConfig, HiloConfig, setConfig } from "./config";
import { getLogger, setLogger } from "./logger";
import { setApi } from "./api";
import { hiloApi } from "./hiloApi";
import {
	Device,
	HiloAccessoryContext,
	SUPPORTED_DEVICE_TYPES,
} from "./devices/types";
import { initializeHiloDevice } from "./devices";
import { HiloDevice } from "./devices/HiloDevice";
import { HiloChallengeSensor } from "./devices/HiloChallengeSensor";
import { setupSubscription } from "./graphql/subscription";
import axios from "axios";

const PLUGIN_NAME = "homebridge hilo";
const PLATFORM_NAME = "Hilo";

export default function (api: API) {
	api.registerPlatform(PLATFORM_NAME, Hilo);
}

class Hilo implements DynamicPlatformPlugin {
	private readonly pluginAccessories: Record<string, HiloDevice<any>> = {};
	private locations: Location[] = [];
	private subscriptions: Record<string, any> = {};

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
			await this.setupSubscriptions();
		});
	}

	private async setupSubscriptions() {
		for (const location of this.locations) {
			try {
				const subscription = await setupSubscription(
					location.id.toString(),
					(device) => {
						this.log.debug(`Device update received:`, device);
						const accessory = this.accessories[device.hiloId];
						const pluginAccessory = this.pluginAccessories[device.hiloId];
						if (!accessory || !pluginAccessory) {
							this.log.debug(`No accessory for device ${device.hiloId}`);
							return;
						}
						pluginAccessory.updateValue(device as any);
					}
				);
				this.subscriptions[location.id.toString()] = subscription;
				this.log.info(`Subscribed to updates for location ${location.id}`);
			} catch (error: unknown) {
				this.log.error(
					`Failed to subscribe to location ${location.id}:`,
					error instanceof Error ? error.message : String(error)
				);
			}
		}
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
	} catch (error: unknown) {
		getLogger().error(
			"Error while fetching locations",
			error instanceof Error ? error.message : String(error)
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
	} catch (error: unknown) {
		getLogger().error(
			"Error while fetching devices",
			error instanceof Error ? error.message : String(error)
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
