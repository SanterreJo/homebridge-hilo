import { getLogger } from "./logger";
import { execute } from "./hiloApi";
import { Device } from "./graphql/graphql";
import { graphql } from "./graphql/gql";

const LOCATION_QUERY = graphql(/* GraphQL */ `
  query getLocation($locationHiloId: String!) {
    getLocation(id: $locationHiloId) {
      hiloId
      lastUpdate
      lastUpdateVersion
      devices {
        __typename
        deviceType
        hiloId
        physicalAddress
        connectionStatus
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

export const fetchDevicesForLocation = async (
  locationHiloId: string,
): Promise<Device[]> => {
  const logger = getLogger();

  try {
    const response = await execute(LOCATION_QUERY, { locationHiloId });
    return (response.data.data.getLocation?.devices || []) as Device[];
  } catch (error) {
    logger.error("Error fetching devices for location:", error);
    return [];
  }
};
