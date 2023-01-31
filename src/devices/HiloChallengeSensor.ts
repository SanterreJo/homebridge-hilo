import { API, CharacteristicValue, PlatformAccessory } from "homebridge";
import { HiloDevice } from "./HiloDevice";
import { Challenge, DeviceValue, HiloAccessoryContext } from "./types";

const phases: Record<
	string,
	| { start: keyof Challenge["phases"]; end: keyof Challenge["phases"] }
	| undefined
> = {
	preheat: {
		start: "preheatStartDateUTC",
		end: "preheatEndDateUTC",
	},
	reduction: {
		start: "reductionStartDateUTC",
		end: "reductionEndDateUTC",
	},
	recovery: {
		start: "recoveryStartDateUTC",
		end: "recoveryEndDateUTC",
	},
};

export class HiloChallengeSensor extends HiloDevice<"Challenge"> {
	private challenges: Record<number, NodeJS.Timeout[]> = {};
	constructor(
		accessory: PlatformAccessory<HiloAccessoryContext<"Challenge">>,
		api: API
	) {
		super(accessory, api);
		this.service =
			accessory.getService(this.api.hap.Service.ContactSensor) ||
			accessory.addService(this.api.hap.Service.ContactSensor);
		this.service.setCharacteristic(
			this.api.hap.Characteristic.Name,
			"Hilo Challenge"
		);
		this.service
			.getCharacteristic(this.api.hap.Characteristic.ContactSensorState)
			.onGet(this.getContactSensorState.bind(this));
	}

	updateValue(
		value: HiloAccessoryContext<"Challenge">["values"][DeviceValue["attribute"]]
	) {
		super.updateValue(value);
		switch (value?.attribute) {
			case "Challenge":
				this.service
					?.getCharacteristic(this.api.hap.Characteristic.ContactSensorState)
					?.updateValue(value.value);
				break;
		}
	}

	private async getContactSensorState(): Promise<CharacteristicValue> {
		const activeChallenge = this.values.Challenge?.value ?? false;
		this.logger.debug(`Getting active Hilo Challenge: ${activeChallenge}`);
		return activeChallenge;
	}

	async updateChallengeStatus(challenges: Challenge[]) {
		challenges.forEach((challenge) => {
			challenge.isParticipating
				? this.participating(challenge)
				: this.notParticipating(challenge);
		});
		if (
			challenges.filter((challenge) => challenge.isParticipating).length === 0
		) {
			this.updateChallengeValue(false);
		}
	}

	private updateChallengeValue(active: boolean) {
		this.updateValue({
			deviceId: this.device.id,
			locationId: this.device.locationId,
			timeStampUTC: new Date().toISOString(),
			attribute: "Challenge",
			value: active,
			valueType: "Boolean",
		});
	}

	private participating(challenge: Challenge) {
		if (this.challenges[challenge.id]) {
			return;
		}
		this.challenges[challenge.id] = [];
		const devicePhase = this.device.assetId.split("-")[0];
		const startPhase = phases[devicePhase]?.start;
		const endPhase = phases[devicePhase]?.end;
		if (!startPhase || !endPhase) {
			this.logger.error(
				`Could not find phase for device ${this.device.assetId}`
			);
			return;
		}
		const startsIn =
			new Date(challenge.phases[startPhase]).getTime() - new Date().getTime();
		const endsIn =
			new Date(challenge.phases[endPhase]).getTime() - new Date().getTime();
		if (startsIn >= 0) {
			this.challenges[challenge.id].push(
				setTimeout(() => {
					this.updateChallengeValue(true);
				}, startsIn)
			);
		} else if (startsIn < 0 && endsIn > 0) {
			this.updateChallengeValue(true);
		}
		if (endsIn >= 0) {
			this.challenges[challenge.id].push(
				setTimeout(() => {
					this.updateChallengeValue(false);
					delete this.challenges[challenge.id];
				}, endsIn)
			);
		} else {
			this.updateChallengeValue(false);
			delete this.challenges[challenge.id];
		}
	}

	private notParticipating(challenge: Challenge) {
		if (this.challenges[challenge.id]) {
			this.challenges[challenge.id].forEach((timeout) => clearTimeout(timeout));
			delete this.challenges[challenge.id];
		}
	}
}
