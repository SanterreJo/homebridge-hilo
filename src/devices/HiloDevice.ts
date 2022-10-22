import { API, Logging, PlatformAccessory, Service } from "homebridge";
import { getLogger } from "../logger";
import { Device, DeviceValue, HiloAccessoryContext } from "./types";

export abstract class HiloDevice<T extends Device["type"]> {
	protected service: Service | null = null;
	constructor(
		protected readonly accessory: PlatformAccessory<HiloAccessoryContext<T>>,
		protected readonly api: API,
		protected readonly logger: Logging = getLogger()
	) {
		accessory
			.getService(this.api.hap.Service.AccessoryInformation)!
			.setCharacteristic(this.api.hap.Characteristic.Manufacturer, "Hilo")
			.setCharacteristic(
				this.api.hap.Characteristic.Model,
				accessory.context.device.type
			)
			.setCharacteristic(
				this.api.hap.Characteristic.SerialNumber,
				accessory.context.device.modelNumber
			);
	}

	get device(): Device {
		return this.accessory.context.device;
	}

	get values(): HiloAccessoryContext<T>["values"] {
		return this.accessory.context.values;
	}

	updateValue(
		value: HiloAccessoryContext<T>["values"][DeviceValue["attribute"]]
	) {
		if (!value) return;
		(this.accessory.context.values[value.attribute] as any) = value;
	}
}
