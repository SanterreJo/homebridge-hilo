import { getLogger } from "./logger";
import { getAccessToken } from "./hiloApi";
import { Device } from "./graphql/graphql";
import { createClient } from "graphql-ws";
import { SUPPORTED_DEVICES } from "./devices/types";
import { graphql } from "./graphql/gql";

const SUBSCRIPTION_QUERY = graphql(/* GraphQL */ `
  subscription onAnyDeviceUpdated($locationHiloId: String!) {
    onAnyDeviceUpdated(locationHiloId: $locationHiloId) {
      deviceType
      locationHiloId
      transmissionTime
      operationId
      status
      device {
        __typename
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
`);

export const setupSubscription = async (
  locationHiloId: string,
  onUpdate: (device: Device) => void,
) => {
  const logger = getLogger();

  try {
    logger.debug("Setting up subscription");
    const client = createClient({
      url: `wss://platform.hiloenergie.com/api/digital-twin/v3/graphql?access_token=${getAccessToken()}`,
      retryAttempts: Infinity,
    });

    const subscription = client.iterate<{
      onAnyDeviceUpdated: { device: Device };
    }>({
      query: SUBSCRIPTION_QUERY as unknown as string,
      variables: { locationHiloId },
    });

    for await (const event of subscription) {
      logger.debug("GraphQL subscription event: ", event);
      if (event.data?.onAnyDeviceUpdated) {
        if (
          SUPPORTED_DEVICES.includes(
            event.data.onAnyDeviceUpdated.device.__typename!,
          )
        ) {
          onUpdate(event.data.onAnyDeviceUpdated.device);
        }
      }
    }

    return subscription;
  } catch (error) {
    logger.error("Error setting up subscription:", error);
  }
};
