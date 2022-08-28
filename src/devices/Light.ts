import { API, CharacteristicValue, PlatformAccessory } from "homebridge";
import { automationApi } from "../hiloApi";
import { HiloDevice } from "./HiloDevice";
import { HiloAccessoryContext } from "./types";

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
		const service =
			accessory.getService(this.api.hap.Service.Lightbulb) ||
			accessory.addService(this.api.hap.Service.Lightbulb);
		service.setCharacteristic(
			this.api.hap.Characteristic.Name,
			this.accessory.context.device.name
		);
		service
			.getCharacteristic(this.api.hap.Characteristic.On)
			.onSet(this.setOn.bind(this))
			.onGet(this.getOn.bind(this));
		if (canDim) {
			service
				.getCharacteristic(this.api.hap.Characteristic.Brightness)
				.onSet(this.setBrightness.bind(this))
				.onGet(this.getBrightness.bind(this));
		}
	}

	private async setOn(value: CharacteristicValue) {
		const on = value as boolean;
		this.logger.debug(`Setting ${this.device.name} ${on ? "on" : "off"}`);
		await automationApi.put(
			`/Locations/${this.device.locationId}/Devices/${this.device.id}/Attributes`,
			{ OnOff: on }
		);
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
		await automationApi.put(
			`/Locations/${this.device.locationId}/Devices/${this.device.id}/Attributes`,
			{ Intensity: brightness / 100 }
		);
	}

	private async getBrightness(): Promise<CharacteristicValue> {
		const brightness = this.values.Intensity?.value ?? 1;
		this.logger.debug(`Getting ${this.device.name} brightness`);
		return brightness * 100;
	}
}
