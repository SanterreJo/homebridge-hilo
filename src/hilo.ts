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
import { initializeHiloDevice } from "./devices";
import { HiloDevice } from "./devices/HiloDevice";
import { setupSubscription } from "./subscription";
import { Device } from "./graphql/graphql";
import { fetchDevicesForLocation } from "./location";
import {
  DeviceAccessory,
  OldApiDevice,
  SUPPORTED_DEVICES,
} from "./devices/types";
const PLUGIN_NAME = "homebridge-hilo";
const PLATFORM_NAME = "Hilo";

export default function (api: API) {
  api.registerPlatform(PLATFORM_NAME, Hilo);
}

// Map GraphQL __typename to the device type used in OldApiDevice context
const GRAPHQL_TO_DEVICE_TYPE: Record<string, string> = {
  BasicThermostat: "Thermostat",
  HeatingFloorThermostat: "Thermostat",
  BasicDimmer: "LightDimmer",
  BasicLight: "LightDimmer",
  BasicSwitch: "Switch",
};

class Hilo implements DynamicPlatformPlugin {
  private readonly pluginAccessories: Record<string, HiloDevice<any>> = {};
  private locations: Location[] = [];
  private subscriptions: Record<string, any> = {};
  private deviceMetadata: Record<string, OldApiDevice> = {};
  private staleAccessories: PlatformAccessory<any>[] = [];
  constructor(
    private readonly log: Logging,
    private readonly config: PlatformConfig,
    private readonly api: API,
    private readonly accessories: Record<
      string,
      PlatformAccessory<DeviceAccessory<Device>>
    > = {},
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
      } else {
        log.info(`Found ${this.locations.length} locations`);
      }
      const devices = (
        await Promise.all(
          this.locations.map((location) =>
            fetchDevicesForLocation(location.locationHiloId),
          ),
        )
      )
        .flatMap((response) => response)
        .filter((device) => SUPPORTED_DEVICES.includes(device.__typename!));

      if (devices.length === 0) {
        log.error("No devices found");
        return;
      } else {
        log.info(`Found ${devices.length} supported devices`);
      }

      this.buildDeviceMetadata(devices, this.locations);

      devices.forEach((device) => {
        this.log.debug("Initializing device", device);
        const metadata = this.deviceMetadata[device.hiloId];
        if (!metadata) {
          this.log.error("No device metadata for", device.hiloId);
          return;
        }
        let accessory = this.accessories[device.hiloId];
        if (!accessory) {
          this.log.debug(
            `Setting up new accessory for device ${device.hiloId}`,
          );
          accessory = this.setupNewAccessory(device, metadata);
        } else {
          // Update cached context with latest GraphQL data
          accessory.context.graphqlDevice = device;
        }
        const pluginAccessory = initializeHiloDevice[device.__typename!](
          accessory as any,
          this.api,
        );
        this.pluginAccessories[device.hiloId] = pluginAccessory;
      });

      // Use GraphQL device list for stale detection
      const currentDeviceHiloIds = devices.map((device) => device.hiloId);
      this.staleAccessories = this.staleAccessories.concat(
        Object.values(this.accessories).filter((accessory) => {
          return !currentDeviceHiloIds.includes(
            accessory.context.device.hiloId,
          );
        }),
      );
      this.log.debug(
        `Found ${this.staleAccessories.length} stale accessories removing...`,
      );
      this.api.unregisterPlatformAccessories(
        PLUGIN_NAME,
        PLATFORM_NAME,
        this.staleAccessories,
      );

      this.setupSubscriptions();
      log.info("Hilo platform is ready");
    });
  }

  /**
   * Build device metadata from cached accessories or GraphQL data.
   *
   * The REST endpoint /Locations/{id}/Devices was deprecated by Hilo
   * (see https://github.com/dvd-dev/hilo/issues/564).
   * For existing accessories, we use the cached device metadata.
   * For new devices, we synthesize metadata from GraphQL data.
   * Note: new devices will have an empty `id` field, which means write
   * operations (set temperature, toggle lights) won't work until the
   * device metadata is fully populated via the DeviceHub WebSocket
   * (not yet implemented — see dvd-dev/hilo#564 for the approach).
   */
  private buildDeviceMetadata(
    devices: Device[],
    locations: Location[],
  ): void {
    const locationId = locations[0]?.id?.toString() ?? "";
    for (const device of devices) {
      const cached = this.accessories[device.hiloId];
      if (cached?.context?.device) {
        this.deviceMetadata[device.hiloId] = cached.context.device;
      } else {
        this.log.warn(
          `New device ${device.hiloId} (${device.__typename}) has no cached metadata. ` +
            `Device will appear in HomeKit but control actions may not work ` +
            `until Homebridge is restarted and the device is cached.`,
        );
        this.deviceMetadata[device.hiloId] = {
          hiloId: device.hiloId,
          assetId: device.hiloId,
          name: device.physicalAddress ?? device.hiloId,
          id: "",
          type: GRAPHQL_TO_DEVICE_TYPE[device.__typename ?? ""] ?? "Unknown",
          locationId,
        };
      }
    }
  }

  private async setupSubscriptions() {
    for (const location of this.locations) {
      try {
        const subscription = await setupSubscription(
          location.locationHiloId,
          (device) => {
            this.log.debug(`Device update received:`, device);
            const accessory = this.accessories[device.hiloId];
            const pluginAccessory = this.pluginAccessories[device.hiloId];
            if (!accessory || !pluginAccessory) {
              this.log.debug(`No accessory for device ${device.hiloId}`);
              return;
            }
            pluginAccessory.updateDevice(device);
          },
        );
        this.subscriptions[location.locationHiloId] = subscription;
        this.log.info(
          `Subscribed to updates for location ${location.locationHiloId}`,
        );
      } catch (error: unknown) {
        this.log.error(
          `Failed to subscribe to location ${location.locationHiloId}:`,
          error instanceof Error ? error.message : String(error),
        );
      }
    }
  }

  configureAccessory(accessory: PlatformAccessory): void {
    this.log.debug(`Configuring accessory from cache ${accessory.displayName}`);
    if (!accessory.context.device.hiloId) {
      this.log.warn(`Could not configure accessory ${accessory.displayName}`);
      this.staleAccessories.push(accessory);
      return;
    }
    this.accessories[accessory.context.device.hiloId] =
      accessory as PlatformAccessory<DeviceAccessory<Device>>;
  }

  private setupNewAccessory(
    device: Device,
    metadata: OldApiDevice,
  ): PlatformAccessory<DeviceAccessory<Device>> {
    const uuid = this.api.hap.uuid.generate(metadata.assetId);
    const accessory = new this.api.platformAccessory<DeviceAccessory<Device>>(
      metadata.name.trim(),
      uuid,
    );
    accessory.context = {
      device: metadata,
      graphqlDevice: device,
    };
    this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [
      accessory,
    ]);
    this.accessories[device.hiloId] = accessory;
    return accessory;
  }
}

type Location = {
  id: number;
  locationHiloId: string;
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
      },
    );
    return response.data;
  } catch (error: unknown) {
    getLogger().error(
      "Error while fetching locations",
      error instanceof Error ? error.message : String(error),
    );
    return [];
  }
}
