import axios from "axios";
import { API, CharacteristicValue, PlatformAccessory } from "homebridge";
import { HiloDevice } from "./HiloDevice";
import { hiloApi } from "../hiloApi";
import { DeviceAccessory, LightDevice } from "./types";
export class Light extends HiloDevice<LightDevice> {
  constructor(
    accessory: PlatformAccessory<DeviceAccessory<LightDevice>>,
    api: API,
    { canDim = true }: { canDim?: boolean } = { canDim: true },
  ) {
    super(accessory, api);
    this.service =
      accessory.getService(this.api.hap.Service.Lightbulb) ||
      accessory.addService(this.api.hap.Service.Lightbulb);
    this.service.setCharacteristic(
      this.api.hap.Characteristic.Name,
      this.accessory.context.device.name,
    );
    this.service
      .getCharacteristic(this.api.hap.Characteristic.On)
      .onSet(this.setOn.bind(this))
      .onGet(this.getOn.bind(this));
    if (canDim) {
      this.service
        .getCharacteristic(this.api.hap.Characteristic.Brightness)
        .onSet(this.setBrightness.bind(this))
        .onGet(this.getBrightness.bind(this));
    }
  }

  updateDevice(device: LightDevice) {
    super.updateDevice(device);
    if ("state" in device) {
      this.service
        ?.getCharacteristic(this.api.hap.Characteristic.On)
        ?.updateValue(device.state === "ON");
    }
    if (
      "level" in device &&
      device.level !== undefined &&
      device.level !== null
    ) {
      this.service
        ?.getCharacteristic(this.api.hap.Characteristic.Brightness)
        ?.updateValue(device.level);
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

  private async setBrightness(value: CharacteristicValue) {
    const brightness = value as number;
    this.logger.debug(
      `Setting ${this.accessory.context.device.name} brightness to ${brightness}`,
    );
    try {
      await hiloApi.put(
        `/Automation/v1/api/Locations/${this.accessory.context.device.locationId}/Devices/${this.accessory.context.device.id}/Attributes`,
        { Intensity: brightness },
      );
    } catch (error) {
      this.logger.error(
        `Failed to set ${this.accessory.context.device.name} brightness to ${brightness}`,
        axios.isAxiosError(error) ? error.response?.data : error,
      );
    }
  }

  private async getBrightness(): Promise<CharacteristicValue> {
    const brightness = this.device.level ?? 100;
    this.logger.debug(
      `Getting ${this.accessory.context.device.name} brightness`,
    );
    return brightness;
  }
}
