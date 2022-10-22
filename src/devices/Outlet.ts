import axios from "axios";
import { API, CharacteristicValue, PlatformAccessory } from "homebridge";
import { automationApi } from "../hiloApi";
import { HiloDevice } from "./HiloDevice";
import { DeviceValue, HiloAccessoryContext } from "./types";

export class Outlet extends HiloDevice<"Outlet"> {
	constructor(
		accessory: PlatformAccessory<HiloAccessoryContext<"Outlet">>,
		api: API
	) {
		super(accessory, api);
		this.service =
			accessory.getService(this.api.hap.Service.Outlet) ||
			accessory.addService(this.api.hap.Service.Outlet);
		this.service.setCharacteristic(
			this.api.hap.Characteristic.Name,
			this.accessory.context.device.name
		);
		this.service
			.getCharacteristic(this.api.hap.Characteristic.On)
			.onSet(this.setOn.bind(this))
			.onGet(this.getOn.bind(this));
	}

	updateValue(
		value: HiloAccessoryContext<"Outlet">["values"][DeviceValue["attribute"]]
	) {
		super.updateValue(value);
		switch (value?.attribute) {
			case "OnOff":
				this.service
					?.getCharacteristic(this.api.hap.Characteristic.On)
					?.updateValue(value.value);
				break;
		}
	}

	private async setOn(value: CharacteristicValue) {
		const on = value as boolean;
		this.logger.debug(`Setting ${this.device.name} ${on ? "on" : "off"}`);
		try {
			await automationApi.put(
				`/Locations/${this.device.locationId}/Devices/${this.device.id}/Attributes`,
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
}
