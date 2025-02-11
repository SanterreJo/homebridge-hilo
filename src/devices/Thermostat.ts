import axios from "axios";
import { API, CharacteristicValue, PlatformAccessory } from "homebridge";
import { HiloDevice } from "./HiloDevice";
import { DeviceValue, HiloAccessoryContext } from "./types";
import { hiloApi } from "../hiloApi";

export class Thermostat extends HiloDevice<"Thermostat" | "FloorThermostat"> {
	constructor(
		accessory: PlatformAccessory<HiloAccessoryContext<"Thermostat" | "FloorThermostat">>,
		api: API
	) {
		super(accessory, api);
		this.service =
			accessory.getService(this.api.hap.Service.Thermostat) ||
			accessory.addService(this.api.hap.Service.Thermostat);
		this.service.setCharacteristic(
			this.api.hap.Characteristic.Name,
			this.accessory.context.device.name
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
				minValue: 5,
				minStep: 0.5,
				maxValue: 30,
			});
		this.service
			.getCharacteristic(this.api.hap.Characteristic.TemperatureDisplayUnits)
			.onGet(this.getTemperatureDisplayUnits.bind(this))
			.onSet(this.setTemperatureDisplayUnits.bind(this));
	}

	updateValue(
		value: HiloAccessoryContext<"Thermostat">["values"][DeviceValue["attribute"]]
	): void {
		super.updateValue(value);
		switch (value?.attribute) {
			case "CurrentTemperature":
				this.service
					?.getCharacteristic(this.api.hap.Characteristic.CurrentTemperature)
					?.updateValue(value?.value ?? 20);
				break;
			case "TargetTemperature":
				this.service
					?.getCharacteristic(this.api.hap.Characteristic.TargetTemperature)
					?.updateValue(value?.value ?? 20);
				break;
			case "Heating":
				this.service
					?.getCharacteristic(
						this.api.hap.Characteristic.CurrentHeatingCoolingState
					)
					?.updateValue(
						value?.value
							? this.api.hap.Characteristic.CurrentHeatingCoolingState.HEAT
							: this.api.hap.Characteristic.CurrentHeatingCoolingState.OFF
					);
				break;
		}
	}

	private async getCurrentHeatingCoolingState(): Promise<CharacteristicValue> {
		this.logger.debug(`Getting ${this.device.name} currentHeatingCoolingState`);
		return this.values.Heating?.value
			? this.api.hap.Characteristic.CurrentHeatingCoolingState.HEAT
			: this.api.hap.Characteristic.CurrentHeatingCoolingState.OFF;
	}

	private async getTargetHeatingCoolingState(): Promise<CharacteristicValue> {
		this.logger.debug(`Getting ${this.device.name} targetHeatingCoolingState`);
		return this.api.hap.Characteristic.TargetHeatingCoolingState.HEAT;
	}

	private async setTargetHeatingCoolingState(value: CharacteristicValue) {
		this.logger.debug(
			`Setting ${this.device.name} targetHeatingCoolingState to ${value}`
		);
	}

	private async getTargetTemperature(): Promise<CharacteristicValue> {
		this.logger.debug(`Getting ${this.device.name} target temperature`);
		return this.values.TargetTemperature?.value ?? 20;
	}

	private async setTargetTemperature(value: CharacteristicValue) {
		const targetTemperature = value as number;
		this.logger.debug(
			`Setting ${this.device.name} target temparature to ${targetTemperature}`
		);
		try {
			await hiloApi.put(
				`/Automation/v1/api/Locations/${this.device.locationId}/Devices/${this.device.id}/Attributes`,
				{ TargetTemperature: targetTemperature }
			);
		} catch (error) {
			this.logger.error(
				"Failed to set target temperature",
				axios.isAxiosError(error) ? error.response?.data : error
			);
		}
	}

	private async getCurrentTemperature(): Promise<CharacteristicValue> {
		this.logger.debug(`Getting ${this.device.name} current temperature`);
		return this.values.CurrentTemperature?.value ?? 20;
	}

	private async getTemperatureDisplayUnits(): Promise<CharacteristicValue> {
		this.logger.debug(`Getting ${this.device.name} temperature display units`);
		return this.values.CurrentTemperature?.valueType === "Celcius" ||
			this.values.CurrentTemperature?.valueType === "Celsius"
			? this.api.hap.Characteristic.TemperatureDisplayUnits.CELSIUS
			: this.api.hap.Characteristic.TemperatureDisplayUnits.FAHRENHEIT;
	}

	private async setTemperatureDisplayUnits(value: CharacteristicValue) {
		this.logger.debug(
			`Setting ${this.device.name} temperature display units to ${value}`
		);
	}
}
