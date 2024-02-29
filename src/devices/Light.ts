import axios from "axios";
import { API, CharacteristicValue, PlatformAccessory } from "homebridge";
import { HiloDevice } from "./HiloDevice";
import { DeviceValue, HiloAccessoryContext } from "./types";
import { hiloApi } from "../hiloApi";

export class Light extends HiloDevice<
	"LightDimmer" | "LightSwitch" | "ColorBulb" | "WhiteBulb"
> {
	constructor(
		accessory: PlatformAccessory<
			HiloAccessoryContext<
				"LightDimmer" | "LightSwitch" | "ColorBulb" | "WhiteBulb"
			>
		>,
		api: API,
		{ canDim = true }: { canDim?: boolean } = { canDim: true }
	) {
		super(accessory, api);
		this.service =
			accessory.getService(this.api.hap.Service.Lightbulb) ||
			accessory.addService(this.api.hap.Service.Lightbulb);
		this.service.setCharacteristic(
			this.api.hap.Characteristic.Name,
			this.accessory.context.device.name
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

	updateValue(
		value: HiloAccessoryContext<
			"LightDimmer" | "LightSwitch" | "ColorBulb" | "WhiteBulb"
		>["values"][DeviceValue["attribute"]]
	) {
		super.updateValue(value);
		switch (value?.attribute) {
			case "OnOff":
				this.service
					?.getCharacteristic(this.api.hap.Characteristic.On)
					?.updateValue(value.value);
				break;
			case "Intensity":
				this.service
					?.getCharacteristic(this.api.hap.Characteristic.Brightness)
					?.updateValue(value.value * 100);
				break;
		}
	}

	private async setOn(value: CharacteristicValue) {
		const on = value as boolean;
		this.logger.debug(`Setting ${this.device.name} ${on ? "on" : "off"}`);
		try {
			await hiloApi.put(
				`/Automation/v1/api/Locations/${this.device.locationId}/Devices/${this.device.id}/Attributes`,
				{ OnOff: on }
			);
		} catch (error) {
			this.logger.error(
				`Failed to set ${this.device.name} ${on ? "on" : "off"}`,
				axios.isAxiosError(error) ? error.response?.data : error
			);
		}
	}

	private async getOn(): Promise<CharacteristicValue> {
		this.logger.debug(`Getting ${this.device.name} onOff status`);
		return this.values.OnOff?.value ?? false;
	}

	private async setBrightness(value: CharacteristicValue) {
		const brightness = value as number;
		this.logger.debug(
			`Setting ${this.device.name} brightness to ${brightness}`
		);
		try {
			await hiloApi.put(
				`/Automation/v1/api/Locations/${this.device.locationId}/Devices/${this.device.id}/Attributes`,
				{ Intensity: brightness / 100 }
			);
		} catch (error) {
			this.logger.error(
				`Failed to set ${this.device.name} brightness to ${brightness}`,
				axios.isAxiosError(error) ? error.response?.data : error
			);
		}
	}

	private async getBrightness(): Promise<CharacteristicValue> {
		const brightness = this.values.Intensity?.value ?? 1;
		this.logger.debug(`Getting ${this.device.name} brightness`);
		return brightness * 100;
	}
}
