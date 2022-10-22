import axios from "axios";
import { API, CharacteristicValue, PlatformAccessory } from "homebridge";
import { automationApi } from "../hiloApi";
import { HiloDevice } from "./HiloDevice";
import { HiloAccessoryContext } from "./types";

export class Thermostat extends HiloDevice<"Thermostat"> {
	constructor(
		accessory: PlatformAccessory<HiloAccessoryContext<"Thermostat">>,
		api: API
	) {
		super(accessory, api);
		const service =
			accessory.getService(this.api.hap.Service.Thermostat) ||
			accessory.addService(this.api.hap.Service.Thermostat);
		service.setCharacteristic(
			this.api.hap.Characteristic.Name,
			this.accessory.context.device.name
		);
		service
			.getCharacteristic(this.api.hap.Characteristic.CurrentHeatingCoolingState)
			.onGet(this.getCurrentHeatingCoolingState.bind(this))
			.setProps({
				validValues: [
					this.api.hap.Characteristic.CurrentHeatingCoolingState.OFF,
					this.api.hap.Characteristic.CurrentHeatingCoolingState.HEAT,
				],
				maxValue: this.api.hap.Characteristic.CurrentHeatingCoolingState.HEAT,
			});
		service
			.getCharacteristic(this.api.hap.Characteristic.TargetHeatingCoolingState)
			.onGet(this.getTargetHeatingCoolingState.bind(this))
			.onSet(this.setTargetHeatingCoolingState.bind(this))
			.setProps({
				validValues: [
					this.api.hap.Characteristic.TargetHeatingCoolingState.AUTO,
				],
				maxValue: this.api.hap.Characteristic.TargetHeatingCoolingState.AUTO,
			});
		service
			.getCharacteristic(this.api.hap.Characteristic.CurrentTemperature)
			.onGet(this.getCurrentTemperature.bind(this));
		service
			.getCharacteristic(this.api.hap.Characteristic.TargetTemperature)
			.onGet(this.getTargetTemperature.bind(this))
			.onSet(this.setTargetTemperature.bind(this))
			.setProps({
				minValue: 5,
				minStep: 0.5,
				maxValue: 30,
			});
		service
			.getCharacteristic(this.api.hap.Characteristic.TemperatureDisplayUnits)
			.onGet(this.getTemperatureDisplayUnits.bind(this))
			.onSet(this.setTemperatureDisplayUnits.bind(this));
		service
			.getCharacteristic(this.api.hap.Characteristic.CurrentRelativeHumidity)
			.onGet(this.getCurrentRelativeHumidity.bind(this));
	}

	private async getCurrentHeatingCoolingState(): Promise<CharacteristicValue> {
		this.logger.debug(`Getting ${this.device.name} currentHeatingCoolingState`);
		return this.values.Heating?.value
			? this.api.hap.Characteristic.CurrentHeatingCoolingState.HEAT
			: this.api.hap.Characteristic.CurrentHeatingCoolingState.OFF;
	}

	private async getTargetHeatingCoolingState(): Promise<CharacteristicValue> {
		this.logger.debug(`Getting ${this.device.name} targetHeatingCoolingState`);
		return this.api.hap.Characteristic.TargetHeatingCoolingState.AUTO;
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
			await automationApi.put(
				`/Locations/${this.device.locationId}/Devices/${this.device.id}/Attributes`,
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
		this.logger.debug(
			`Getting ${this.device.name} current temperature ${JSON.stringify(
				this.values
			)}`
		);
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

	private async getCurrentRelativeHumidity(): Promise<CharacteristicValue> {
		this.logger.debug(`Getting ${this.device.name} current relative humidty`);
		return this.values.Humidity?.value ?? 0;
	}
}
