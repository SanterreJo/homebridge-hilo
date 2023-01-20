import axios, { AxiosRequestConfig } from "axios";
import { setupCache } from "axios-cache-interceptor";
import { decode } from "jsonwebtoken";
import { getConfig, Vendor } from "./config";
import { getLogger } from "./logger";

let accessToken: string | undefined;
let wsAccessToken: string | undefined;
let refreshToken: string | undefined;

const clientIds: Record<Vendor, string> = {
	hilo: "9870f087-25f8-43b6-9cad-d4b74ce512e1",
	allia: "a00802c5-2c33-4a90-a3ce-90b9ad14fccd",
};

const authServers: Record<Vendor, string> = {
	hilo: "https://hilodirectoryb2c.b2clogin.com/hilodirectoryb2c.onmicrosoft.com",
	allia: "https://Stelproprod01.b2clogin.com/Stelproprod01.onmicrosoft.com",
};

const renewTokens = ({
	newRefreshToken,
	newAccessToken,
	expiresIn,
}: {
	newRefreshToken: string;
	newAccessToken: string;
	expiresIn: number;
}) => {
	accessToken = newAccessToken;
	refreshToken = newRefreshToken;
	setupAutoRefreshToken(expiresIn);
};

type TokenResponse = {
	access_token: string;
	token_type: "Bearer";
	expires_in: number;
	refresh_token: string;
	id_token: string;
};

async function login() {
	getLogger().debug("Logging in");
	const config = getConfig();
	const clientId = clientIds[config.vendor];
	const authServer = authServers[config.vendor];
	const logger = getLogger();
	const data = new URLSearchParams();
	data.append("grant_type", "password");
	data.append("username", config.username);
	data.append("password", config.password);
	data.append("client_id", clientId);
	data.append("scope", `openid ${clientId} offline_access`);
	data.append("response_type", "token");
	const response = await axios.post<TokenResponse>(
		`${authServer}/oauth2/v2.0/token`,
		data,
		{
			params: { p: "B2C_1A_B2C_1_PasswordFlow" },
		}
	);
	if (response.status !== 200) {
		const message = `Could not login. Status: ${response.status} ${
			response.statusText
		}. Data: ${JSON.stringify(response.data)}`;
		logger(message);
		throw new Error(message);
	}

	renewTokens({
		newAccessToken: response.data.access_token,
		newRefreshToken: response.data.refresh_token,
		expiresIn: response.data.expires_in,
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
	const config = getConfig();
	const clientId = clientIds[config.vendor];
	const authServer = authServers[config.vendor];
	const data = new URLSearchParams();
	data.append("grant_type", "refresh_token");
	data.append("client_id", clientId);
	data.append("response_type", "token");
	data.append("refresh_token", refreshToken!);
	const response = await axios.post<RefreshTokenResponse>(
		`${authServer}/oauth2/v2.0/token`,
		data,
		{
			params: { p: "B2C_1A_B2C_1_PasswordFlow" },
		}
	);

	renewTokens({
		newAccessToken: response.data.access_token,
		newRefreshToken: response.data.refresh_token,
		expiresIn: response.data.expires_in,
	});
}

type NegotiateResponse = {
	accessToken: string;
	url: string;
	negociateVersion: number;
};
export async function negotiate() {
	getLogger().debug("Negotiating websocket connection");
	const response = await hubApi.post<NegotiateResponse>(
		"/DeviceHub/negotiate",
		{},
		{
			params: {
				negociateVersion: 1,
			},
		}
	);
	wsAccessToken = response.data.accessToken;
	const decoded = decode(wsAccessToken) as any;
	setTimeout(async () => {
		getLogger().debug("Refreshing websocket token");
		const response = await negotiate();
		wsAccessToken = response.accessToken;
	}, decoded.exp * 1000 - Date.now() - 1000 * 60 * 5); // 5 minutes before expiration
	return { accessToken: response.data.accessToken, url: response.data.url };
}

export const getWsAccessToken = () => wsAccessToken || "";

export function setupAutoRefreshToken(expiresIn: number) {
	getLogger().debug("Setting up auto refresh token");
	setTimeout(async () => {
		getLogger().debug("Refreshing token automatically");
		try {
			await refreshTokenRequest();
		} catch (e) {
			try {
				await login();
			} catch (e) {
				unableToLogin(e);
			}
		}
	}, expiresIn * 1000 - 1000 * 60 * 5); // 5 minutes before expiration
}

export const automationApi = axios.create({
	baseURL: "https://apim.hiloenergie.com/Automation/v1/api",
});
export const eventsApi = axios.create({
	baseURL: "https://apim.hiloenergie.com/GDService/v1/api",
});
export const hubApi = axios.create({
	baseURL: "https://automation.hiloenergie.com",
});

setupCache(eventsApi);

const authInterceptor = async (config: AxiosRequestConfig) => {
	if (!accessToken) {
		if (refreshToken) {
			try {
				await refreshTokenRequest();
			} catch (e) {
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
	config.headers.set(
		"Ocp-Apim-Subscription-Key",
		"20eeaedcb86945afa3fe792cea89b8bf"
	);
	config.headers.set(
		"Authorization",
		accessToken ? `Bearer ${accessToken}` : ""
	);
	return config;
};

automationApi.interceptors.request.use(authInterceptor);
eventsApi.interceptors.request.use(authInterceptor);
hubApi.interceptors.request.use(authInterceptor);

const unableToLogin = (e: unknown) =>
	getLogger().error(
		"Unable to login",
		axios.isAxiosError(e) ? e.response?.data : e
	);
