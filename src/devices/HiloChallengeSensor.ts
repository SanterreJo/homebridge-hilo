import subHours from "date-fns/subHours";
import {
	API,
	CharacteristicValue,
	Logging,
	PlatformAccessory,
	Service,
} from "homebridge";
import { getConfig, HiloConfig } from "../config";
import { Challenge } from "./types";
import { getLogger } from "../logger";

const phases: (
	challenge: Challenge,
	config: HiloConfig
) => Record<string, { start: Date; end: Date } | undefined> = (
	challenge,
	config
) => ({
	inProgress: {
		start: new Date(challenge.phases.preheatStartDateUTC),
		end: new Date(challenge.phases.recoveryEndDateUTC),
	},
	preheat: {
		start: new Date(challenge.phases.preheatStartDateUTC),
		end: new Date(challenge.phases.preheatEndDateUTC),
	},
	reduction: {
		start: new Date(challenge.phases.reductionStartDateUTC),
		end: new Date(challenge.phases.reductionEndDateUTC),
	},
	recovery: {
		start: new Date(challenge.phases.recoveryStartDateUTC),
		end: new Date(challenge.phases.recoveryEndDateUTC),
	},
	plannedAM:
		challenge.period === "am"
			? {
					start: subHours(
						new Date(challenge.phases.preheatStartDateUTC),
						config.plannedHours
					),
					end: new Date(challenge.phases.preheatStartDateUTC),
			  }
			: undefined,
	plannedPM:
		challenge.period === "pm"
			? {
					start: subHours(
						new Date(challenge.phases.preheatStartDateUTC),
						config.plannedHours
					),
					end: new Date(challenge.phases.preheatStartDateUTC),
			  }
			: undefined,
});

export class HiloChallengeSensor {
	private challenges: Record<number, NodeJS.Timeout[]> = {};
	protected service: Service | null = null;

	constructor(
		protected readonly accessory: PlatformAccessory<{
			value: boolean;
			phase: string;
			locationHiloId: string;
		}>,
		protected readonly api: API,
		protected readonly logger: Logging = getLogger()
	) {
		accessory
			.getService(this.api.hap.Service.AccessoryInformation)!
			.setCharacteristic(this.api.hap.Characteristic.Manufacturer, "Hilo")
			.setCharacteristic(this.api.hap.Characteristic.Model, "Challenge")
			.setCharacteristic(
				this.api.hap.Characteristic.SerialNumber,
				this.accessory.context.locationHiloId +
					"-" +
					this.accessory.context.phase
			);
		this.service =
			accessory.getService(this.api.hap.Service.ContactSensor) ||
			accessory.addService(this.api.hap.Service.ContactSensor);
		this.service.setCharacteristic(
			this.api.hap.Characteristic.Name,
			this.accessory.context.phase + "Hilo Challenge"
		);
		this.service
			.getCharacteristic(this.api.hap.Characteristic.ContactSensorState)
			.onGet(this.getContactSensorState.bind(this));
	}

	updateChallenge(value: boolean) {
		this.accessory.context.value = value;
		this.service
			?.getCharacteristic(this.api.hap.Characteristic.ContactSensorState)
			?.updateValue(value);
	}

	private async getContactSensorState(): Promise<CharacteristicValue> {
		const activeChallenge = this.accessory.context.value ?? false;
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
		this.updateChallenge(active);
	}

	private participating(challenge: Challenge) {
		if (this.challenges[challenge.id]) {
			return;
		}
		this.challenges[challenge.id] = [];
		const devicePhase = this.accessory.context.phase;
		const phase = phases(challenge, getConfig())[devicePhase];
		const startPhase = phase?.start;
		const endPhase = phase?.end;
		if (!startPhase || !endPhase) {
			this.logger.debug(
				`Could not find phase or period does not match device for device ${this.accessory.context.locationHiloId} - ${this.accessory.context.phase}`
			);
			return;
		}
		const startsIn = startPhase.getTime() - new Date().getTime();
		const endsIn = endPhase.getTime() - new Date().getTime();
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
