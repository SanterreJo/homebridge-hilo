const { HomebridgePluginUiServer } = require("@homebridge/plugin-ui-utils");
const express = require("express");

const port = 8880;

class UiServer extends HomebridgePluginUiServer {
	constructor() {
		super();
		const app = express();
		app.get("/", (req, res) => {
			console.log(req.params);
			res.sendStatus(200);
		});

		app.listen(port, () => {
			console.log(`Auth server listening on port ${port}`);
		});
		this.ready();
	}
}

(() => new UiServer())();
