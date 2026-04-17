import * as signalR from "@microsoft/signalr";
import { negotiate, getWsAccessToken } from "./hiloApi";
import { getLogger } from "./logger";

export type SignalRDevice = {
  id: number;
  name: string;
  hiloId: string;
  type: string;
  assetId?: string;
  locationId: number;
  modelNumber?: string;
  identifier?: string;
};

let hubConnection: signalR.HubConnection | null = null;
let webSocketRetries = 0;
const MAX_RETRIES = 8;
const BASE_RETRY_DELAY = 30_000;

export async function connectToDeviceHub(
  locationId: number,
): Promise<SignalRDevice[]> {
  const logger = getLogger();

  let url: string;
  try {
    const response = await negotiate();
    url = response.url;
  } catch (error) {
    logger.error(
      "Unable to negotiate websocket connection",
      error instanceof Error ? error.message : error,
    );
    return [];
  }

  hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(url, { accessTokenFactory: () => getWsAccessToken() })
    .configureLogging(signalR.LogLevel.Warning)
    .build();

  const deviceListPromise = new Promise<SignalRDevice[]>((resolve) => {
    const timeout = setTimeout(() => {
      logger.error(
        "Timed out waiting for DeviceListInitialValuesReceived (30s)",
      );
      resolve([]);
    }, 30_000);

    hubConnection!.on(
      "DeviceListInitialValuesReceived",
      (devices: SignalRDevice[]) => {
        clearTimeout(timeout);
        logger.debug(`Received ${devices.length} devices from DeviceHub`);
        resolve(devices);
      },
    );
  });

  hubConnection.onclose((error) => {
    if (error) {
      logger.error("DeviceHub connection closed with error:", error.message);
    } else {
      logger.debug("DeviceHub connection closed");
    }
    retryConnection(locationId);
  });

  try {
    await hubConnection.start();
    webSocketRetries = 0;
    logger.info("Connected to DeviceHub");
    await hubConnection.invoke("SubscribeToLocation", locationId.toString());
    logger.debug(`Subscribed to location ${locationId}`);
  } catch (error) {
    logger.error(
      "Failed to start DeviceHub connection",
      error instanceof Error ? error.message : error,
    );
    return [];
  }

  return deviceListPromise;
}

function retryConnection(locationId: number) {
  const logger = getLogger();
  if (webSocketRetries >= MAX_RETRIES) {
    logger.error(`DeviceHub reconnection failed after ${MAX_RETRIES} attempts`);
    return;
  }
  const delay = BASE_RETRY_DELAY * Math.pow(2, webSocketRetries);
  webSocketRetries++;
  logger.info(
    `Retrying DeviceHub connection in ${delay / 1000}s (attempt ${webSocketRetries}/${MAX_RETRIES})`,
  );
  setTimeout(async () => {
    try {
      await connectToDeviceHub(locationId);
    } catch (error) {
      logger.error(
        "DeviceHub reconnection failed",
        error instanceof Error ? error.message : error,
      );
    }
  }, delay);
}

export function disconnectDeviceHub() {
  if (hubConnection) {
    hubConnection.stop().catch(() => {});
    hubConnection = null;
  }
}
