import axios from "axios";
import { API, CharacteristicValue, PlatformAccessory } from "homebridge";
import { HiloDevice } from "./HiloDevice";
import { hiloApi } from "../hiloApi";
import { ClimateDevice, DeviceAccessory } from "./types";

export class Thermostat extends HiloDevice<ClimateDevice> {
  constructor(
    accessory: PlatformAccessory<DeviceAccessory<ClimateDevice>>,
    api: API,
  ) {
    super(accessory, api);
    this.service =
      accessory.getService(this.api.hap.Service.Thermostat) ||
      accessory.addService(this.api.hap.Service.Thermostat);
    this.service.setCharacteristic(
      this.api.hap.Characteristic.Name,
      this.accessory.context.oldApiDevice.name,
    );
    this.service
      .getCharacteristic(this.api.hap.Characteristic.CurrentHeatingCoolingState)
      .onGet(this.getCurrentHeatingCoolingState.bind(this))
      .setProps({
        validValues: [
          this.api.hap.Characteristic.CurrentHeatingCoolingState.OFF,
          this.api.hap.Characteristic.CurrentHeatingCoolingState.HEAT,
        ],
        maxValue: this.api.hap.Characteristic.CurrentHeatingCoolingState.HEAT,
      });
    this.service
      .getCharacteristic(this.api.hap.Characteristic.TargetHeatingCoolingState)
      .onGet(this.getTargetHeatingCoolingState.bind(this))
      .onSet(this.setTargetHeatingCoolingState.bind(this))
      .setProps({
        validValues: [
          this.api.hap.Characteristic.TargetHeatingCoolingState.HEAT,
        ],
        maxValue: this.api.hap.Characteristic.TargetHeatingCoolingState.HEAT,
      });
    this.service
      .getCharacteristic(this.api.hap.Characteristic.CurrentTemperature)
      .onGet(this.getCurrentTemperature.bind(this));
    this.service
      .getCharacteristic(this.api.hap.Characteristic.TargetTemperature)
      .onGet(this.getTargetTemperature.bind(this))
      .onSet(this.setTargetTemperature.bind(this))
      .setProps({
        minValue: this.device.minAmbientTempSetpoint?.value ?? 5,
        minStep: 0.5,
        maxValue: this.device.maxAmbientTempSetpoint?.value ?? 30,
      });
    this.service
      .getCharacteristic(this.api.hap.Characteristic.TemperatureDisplayUnits)
      .onGet(this.getTemperatureDisplayUnits.bind(this))
      .onSet(this.setTemperatureDisplayUnits.bind(this));
  }

  updateDevice(device: ClimateDevice): void {
    super.updateDevice(device);

    if (
      "ambientTemperature" in device &&
      device.ambientTemperature !== undefined &&
      device.ambientTemperature !== null
    ) {
      this.service
        ?.getCharacteristic(this.api.hap.Characteristic.CurrentTemperature)
        ?.updateValue(device.ambientTemperature.value ?? 20);
    }
    if (
      "ambientTempSetpoint" in device &&
      device.ambientTempSetpoint !== undefined &&
      device.ambientTempSetpoint !== null
    ) {
      this.service
        ?.getCharacteristic(this.api.hap.Characteristic.TargetTemperature)
        ?.updateValue(device.ambientTempSetpoint?.value ?? 20);
    }
    if (
      "heatDemand" in device &&
      device.heatDemand !== undefined &&
      device.heatDemand !== null
    ) {
      this.service
        ?.getCharacteristic(
          this.api.hap.Characteristic.CurrentHeatingCoolingState,
        )
        ?.updateValue(
          device.heatDemand > 0
            ? this.api.hap.Characteristic.CurrentHeatingCoolingState.HEAT
            : this.api.hap.Characteristic.CurrentHeatingCoolingState.OFF,
        );
    }
  }

  private async getCurrentHeatingCoolingState(): Promise<CharacteristicValue> {
    this.logger.debug(
      `Getting ${this.accessory.context.oldApiDevice.name} currentHeatingCoolingState`,
    );
    return this.device.heatDemand && this.device.heatDemand > 0
      ? this.api.hap.Characteristic.CurrentHeatingCoolingState.HEAT
      : this.api.hap.Characteristic.CurrentHeatingCoolingState.OFF;
  }

  private async getTargetHeatingCoolingState(): Promise<CharacteristicValue> {
    this.logger.debug(
      `Getting ${this.accessory.context.oldApiDevice.name} targetHeatingCoolingState`,
    );
    return this.api.hap.Characteristic.TargetHeatingCoolingState.HEAT;
  }

  private async setTargetHeatingCoolingState(value: CharacteristicValue) {
    this.logger.debug(
      `Setting ${this.accessory.context.oldApiDevice.name} targetHeatingCoolingState to ${value}`,
    );
  }

  private async getTargetTemperature(): Promise<CharacteristicValue> {
    this.logger.debug(
      `Getting ${this.accessory.context.oldApiDevice.name} target temperature`,
    );
    return this.device.ambientTempSetpoint?.value ?? 20;
  }

  private async setTargetTemperature(value: CharacteristicValue) {
    const targetTemperature = value as number;
    this.logger.debug(
      `Setting ${this.accessory.context.oldApiDevice.name} target temparature to ${targetTemperature}`,
    );
    try {
      await hiloApi.put(
        `/Automation/v1/api/Locations/${this.accessory.context.oldApiDevice.locationId}/Devices/${this.accessory.context.oldApiDevice.id}/Attributes`,
        { TargetTemperature: targetTemperature },
      );
    } catch (error) {
      this.logger.error(
        "Failed to set target temperature",
        axios.isAxiosError(error) ? error.response?.data : error,
      );
    }
  }

  private async getCurrentTemperature(): Promise<CharacteristicValue> {
    this.logger.debug(
      `Getting ${this.accessory.context.oldApiDevice.name} current temperature`,
    );
    return this.device.ambientTemperature?.value ?? 20;
  }

  private async getTemperatureDisplayUnits(): Promise<CharacteristicValue> {
    this.logger.debug(
      `Getting ${this.accessory.context.oldApiDevice.name} temperature display units`,
    );
    return this.api.hap.Characteristic.TemperatureDisplayUnits.CELSIUS;
  }

  private async setTemperatureDisplayUnits(value: CharacteristicValue) {
    this.logger.debug(
      `Setting ${this.accessory.context.oldApiDevice.name} temperature display units to ${value}`,
    );
  }
}
