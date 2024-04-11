const { HomebridgePluginUiServer } = require("@homebridge/plugin-ui-utils");
const express = require("express");

const port = 8880;

class UiServer extends HomebridgePluginUiServer {
	constructor() {
		super();
		this.app = express();
		this.app.listen(port, () => {
			console.log(`Auth server listening on port ${port}`);
		});
		this.onRequest("/callback", this.handleCallback.bind(this));
		this.ready();
	}

	async handleCallback({ codeVerifier }) {
		return new Promise((resolve) => {
			this.app.get("/auth/external/callback", async (req, res) => {
				const code = req.query.code;
				const tokenResponse = await fetch(
					"https://connexion.hiloenergie.com/hilodirectoryb2c.onmicrosoft.com/oauth2/v2.0/token?p=b2c_1a_sign_in",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/x-www-form-urlencoded",
						},
						body: new URLSearchParams({
							client_id: "1ca9f585-4a55-4085-8e30-9746a65fa561",
							code,
							code_verifier: codeVerifier,
							grant_type: "authorization_code",
							redirect_uri: "https://my.home-assistant.io/redirect/oauth",
						}),
					}
				);
				const body = await tokenResponse.json();
				const accessToken = body.access_token;
				const refreshToken = body.refresh_token;
				const expiresIn = body.expires_in;
				const refreshTokenExpiresIn = body.refresh_token_expires_in;
				res.send("Success - you can now close this window");
				resolve({
					accessToken,
					refreshToken,
					expiresIn,
					refreshTokenExpiresIn,
				});
			});
		});
	}
}

(() => new UiServer())();
