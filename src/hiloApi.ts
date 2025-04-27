import axios, { AxiosRequestConfig } from "axios";
import fs from "fs";
import { getConfig } from "./config";
import { getLogger } from "./logger";
import { getApi } from "./api";

let accessToken: string | undefined;
let refreshToken: string | undefined;

const clientId = "1ca9f585-4a55-4085-8e30-9746a65fa561";

const authServer = "https://connexion.hiloenergie.com";

const renewTokens = async ({
  newRefreshToken,
  newAccessToken,
  expiresIn,
}: {
  newRefreshToken: string;
  newAccessToken?: string;
  expiresIn?: number;
}) => {
  const configPath = getApi().user.configPath();
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  const hilo = config.platforms.find(
    (p: { platform: string }) => p.platform === "Hilo",
  );
  hilo.refreshToken = newRefreshToken;
  fs.writeFileSync(configPath, JSON.stringify(config, null, 4));

  accessToken = newAccessToken;
  refreshToken = newRefreshToken;
  await setupAutoRefreshToken(expiresIn);
};

async function login() {
  getLogger().debug("Logging in");
  const config = getConfig();
  const newRefreshToken = config.refreshToken;
  await renewTokens({
    newRefreshToken,
  });
}

type RefreshTokenResponse = {
  access_token: string;
  id_token: string;
  token_type: "Bearer";
  not_before: number;
  expires_in: number;
  resource: string;
  id_token_expires_in: number;
  profile_info: string;
  scope: string;
  refresh_token: string;
  refresh_token_expires_in: number;
};
async function refreshTokenRequest() {
  getLogger().debug("Refreshing token");
  const data = new URLSearchParams();
  data.append("grant_type", "refresh_token");
  data.append("client_id", clientId);
  data.append("refresh_token", refreshToken!);
  data.append(
    "scope",
    "openid https://HiloDirectoryB2C.onmicrosoft.com/hiloapis/user_impersonation offline_access",
  );
  data.append("redirect_uri", "https://my.home-assistant.io/redirect/oauth");
  const response = await axios.post<RefreshTokenResponse>(
    `${authServer}/HiloDirectoryB2C.onmicrosoft.com/B2C_1A_SIGN_IN/oauth2/v2.0/token?p=b2c_1a_sign_in`,
    data,
  );

  await renewTokens({
    newAccessToken: response.data.access_token,
    newRefreshToken: response.data.refresh_token,
    expiresIn: response.data.expires_in,
  });
}

export const getAccessToken = () => accessToken || "";

export async function setupAutoRefreshToken(expiresIn: number | undefined) {
  if (!expiresIn) {
    getLogger().debug("Refreshing token");
    try {
      await refreshTokenRequest();
    } catch (e) {
      unableToLogin(e);
    }
  } else {
    getLogger().debug("Setting up auto refresh token");
    setTimeout(
      async () => {
        getLogger().debug("Refreshing token automatically");
        try {
          await refreshTokenRequest();
        } catch (_e) {
          try {
            await login();
          } catch (e) {
            unableToLogin(e);
          }
        }
      },
      expiresIn * 1000 - 1000 * 60 * 5,
    ); // 5 minutes before expiration
  }
}

export const hiloApi = axios.create({
  baseURL: "https://api.hiloenergie.com",
});

export const graphqlApi = axios.create({
  baseURL: "https://platform.hiloenergie.com",
});

const authInterceptor = async (config: AxiosRequestConfig) => {
  if (!accessToken) {
    if (refreshToken) {
      try {
        await refreshTokenRequest();
      } catch (_e) {
        try {
          await login();
        } catch (e) {
          unableToLogin(e);
        }
      }
    } else {
      try {
        await login();
      } catch (e) {
        unableToLogin(e);
      }
    }
  }
  config = {
    ...config,
    headers: {
      ...config.headers,
      "Ocp-Apim-Subscription-Key": "20eeaedcb86945afa3fe792cea89b8bf",
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
  };
  return config;
};

hiloApi.interceptors.request.use(authInterceptor);
graphqlApi.interceptors.request.use(authInterceptor);

const unableToLogin = (e: unknown) => {
  const logger = getLogger();
  logger.error("Unable to login", axios.isAxiosError(e) ? e.response?.data : e);
  logger.error(
    "You can try to refresh your login credentials by using the 'Login with Hilo' button in the plugin configuration in homebridge UI",
  );
};
