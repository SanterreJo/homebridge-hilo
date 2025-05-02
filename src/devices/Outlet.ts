import axios from "axios";
import { API, CharacteristicValue, PlatformAccessory } from "homebridge";
import { HiloDevice } from "./HiloDevice";
import { hiloApi } from "../hiloApi";
import { BasicSwitch } from "../graphql/graphql";
import { DeviceAccessory } from "./types";
export class Outlet extends HiloDevice<BasicSwitch> {
  constructor(
    accessory: PlatformAccessory<DeviceAccessory<BasicSwitch>>,
    api: API,
  ) {
    super(accessory, api);
    this.service =
      accessory.getService(this.api.hap.Service.Outlet) ||
      accessory.addService(this.api.hap.Service.Outlet);
    this.service.setCharacteristic(
      this.api.hap.Characteristic.Name,
      this.accessory.context.device.name,
    );
    this.service
      .getCharacteristic(this.api.hap.Characteristic.On)
      .onSet(this.setOn.bind(this))
      .onGet(this.getOn.bind(this));
  }

  updateDevice(device: BasicSwitch) {
    super.updateDevice(device);
    if ("state" in device) {
      this.service
        ?.getCharacteristic(this.api.hap.Characteristic.On)
        ?.updateValue(device.state === "ON");
    }
  }

  private async setOn(value: CharacteristicValue) {
    const on = value as boolean;
    this.logger.debug(
      `Setting ${this.accessory.context.device.name} ${on ? "on" : "off"}`,
    );
    try {
      await hiloApi.put(
        `/Automation/v1/api/Locations/${this.accessory.context.device.locationId}/Devices/${this.accessory.context.device.id}/Attributes`,
        { OnOff: on },
      );
    } catch (error) {
      this.logger.error(
        `Failed to set ${this.accessory.context.device.name} ${
          on ? "on" : "off"
        }`,
        axios.isAxiosError(error) ? error.response?.data : error,
      );
    }
  }

  private async getOn(): Promise<CharacteristicValue> {
    this.logger.debug(
      `Getting ${this.accessory.context.device.name} onOff status`,
    );
    return this.device.state === "ON";
  }
}
