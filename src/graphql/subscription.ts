import { gql } from "graphql-tag";
import { getLogger } from "../logger";
import { getConfig } from "../config";
import { hiloApi } from "../hiloApi";
import { Device } from "./graphql";

const SUBSCRIPTION_QUERY = gql`
	subscription onAnyDeviceUpdated($locationHiloId: String!) {
		onAnyDeviceUpdated(locationHiloId: $locationHiloId) {
			deviceType
			locationHiloId
			transmissionTime
			operationId
			status
			device {
				... on Gateway {
					connectionStatus
					controllerSoftwareVersion
					lastConnectionTime
					willBeConnectedToSmartMeter
					zigBeeChannel
					zigBeePairingModeEnhanced
					smartMeterZigBeeChannel
					smartMeterPairingStatus
				}
				... on BasicSmartMeter {
					deviceType
					hiloId
					physicalAddress
					connectionStatus
					zigBeeChannel
					power {
						value
						kind
					}
				}
				... on LowVoltageThermostat {
					deviceType
					hiloId
					physicalAddress
					coolTempSetpoint {
						value
					}
					fanMode
					fanSpeed
					mode
					currentState
					power {
						value
						kind
					}
					ambientHumidity
					gDState
					ambientTemperature {
						value
						kind
					}
					ambientTempSetpoint {
						value
						kind
					}
					version
					zigbeeVersion
					connectionStatus
					maxAmbientCoolSetPoint {
						value
						kind
					}
					minAmbientCoolSetPoint {
						value
						kind
					}
					maxAmbientTempSetpoint {
						value
						kind
					}
					minAmbientTempSetpoint {
						value
						kind
					}
					allowedModes
					fanAllowedModes
				}
				... on BasicSwitch {
					deviceType
					hiloId
					physicalAddress
					connectionStatus
					state
					power {
						value
						kind
					}
				}
				... on BasicLight {
					deviceType
					hiloId
					physicalAddress
					connectionStatus
					state
					hue
					level
					saturation
					colorTemperature
					lightType
				}
				... on BasicEVCharger {
					deviceType
					hiloId
					physicalAddress
					connectionStatus
					status
					power {
						value
						kind
					}
				}
				... on BasicChargeController {
					deviceType
					hiloId
					physicalAddress
					connectionStatus
					gDState
					version
					zigbeeVersion
					state
					power {
						value
						kind
					}
					ccrMode
					ccrAllowedModes
				}
				... on HeatingFloorThermostat {
					deviceType
					hiloId
					physicalAddress
					connectionStatus
					ambientHumidity
					gDState
					version
					zigbeeVersion
					thermostatType
					physicalAddress
					floorMode
					power {
						value
						kind
					}
					ambientTemperature {
						value
						kind
					}
					ambientTempSetpoint {
						value
						kind
					}
					maxAmbientTempSetpoint {
						value
						kind
					}
					minAmbientTempSetpoint {
						value
						kind
					}
					floorLimit {
						value
					}
				}
				... on WaterHeater {
					deviceType
					hiloId
					physicalAddress
					connectionStatus
					gDState
					version
					probeTemp {
						value
						kind
					}
					zigbeeVersion
					state
					ccrType
					alerts
					power {
						value
						kind
					}
				}
				... on BasicDimmer {
					deviceType
					hiloId
					physicalAddress
					connectionStatus
					state
					level
					power {
						value
						kind
					}
				}
				... on BasicThermostat {
					deviceType
					hiloId
					physicalAddress
					connectionStatus
					ambientHumidity
					gDState
					version
					zigbeeVersion
					ambientTemperature {
						value
						kind
					}
					ambientTempSetpoint {
						value
						kind
					}
					maxAmbientTempSetpoint {
						value
						kind
					}
					minAmbientTempSetpoint {
						value
						kind
					}
					maxAmbientTempSetpointLimit {
						value
						kind
					}
					minAmbientTempSetpointLimit {
						value
						kind
					}
					heatDemand
					power {
						value
						kind
					}
					mode
					allowedModes
				}
			}
		}
	}
`;

export type SubscriptionResponse = {
	onAnyDeviceUpdated: {
		deviceType: string;
		locationHiloId: string;
		transmissionTime: string;
		operationId: string;
		status: string;
		device: Device;
	};
};

export const setupSubscription = async (
	locationHiloId: string,
	onUpdate: (device: Device) => void
) => {
	const logger = getLogger();
	const config = getConfig();

	try {
		const response = await hiloApi.post(
			"/graphql",
			{
				query: SUBSCRIPTION_QUERY,
				variables: { locationHiloId },
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		const subscription = response.data.data.onAnyDeviceUpdated;
		if (subscription) {
			onUpdate(subscription.device);
		}

		return subscription;
	} catch (error) {
		logger.error("Error setting up subscription:", error);
		throw error;
	}
};
