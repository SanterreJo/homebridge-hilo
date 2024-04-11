const { HomebridgePluginUiServer } = require("@homebridge/plugin-ui-utils");
const express = require("express");

const port = 8880;

class UiServer extends HomebridgePluginUiServer {
	constructor() {
		super();
		const app = express();
		app.get("/auth/external/callback", async (req, res) => {
			const state = req.query.state;
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
						grant_type: "authorization_code",
						state,
						redirect_uri: "https://my.home-assistant.io/redirect/oauth",
						scope:
							"openid https://HiloDirectoryB2C.onmicrosoft.com/hiloapis/user_impersonation offline_access",
					}),
				}
			);
			console.log(tokenResponse);
			res.sendStatus(200);
		});

		app.listen(port, () => {
			console.log(`Auth server listening on port ${port}`);
		});
		this.ready();
	}
}

(() => new UiServer())();
