import { API, Logging, PlatformAccessory, Service } from "homebridge";
import { getLogger } from "../logger";
import { DeviceAccessory } from "./types";
import { Device } from "../graphql/graphql";

export abstract class HiloDevice<T extends Device> {
  protected service: Service | null = null;
  constructor(
    protected readonly accessory: PlatformAccessory<DeviceAccessory<T>>,
    protected readonly api: API,
    protected readonly logger: Logging = getLogger(),
  ) {
    accessory
      .getService(this.api.hap.Service.AccessoryInformation)!
      .setCharacteristic(this.api.hap.Characteristic.Manufacturer, "Hilo")
      .setCharacteristic(
        this.api.hap.Characteristic.Model,
        accessory.context.device.type,
      )
      .setCharacteristic(
        this.api.hap.Characteristic.SerialNumber,
        accessory.context.graphqlDevice.physicalAddress,
      );
  }

  get device(): T {
    return this.accessory.context.graphqlDevice;
  }

  updateDevice(device: T) {
    this.accessory.context.graphqlDevice = device;
  }
}
