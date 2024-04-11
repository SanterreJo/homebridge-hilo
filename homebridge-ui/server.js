const { HomebridgePluginUiServer } = require("@homebridge/plugin-ui-utils");

class UiServer extends HomebridgePluginUiServer {
	constructor() {
		super();
		this.onRequest("/callback", this.handleCallback.bind(this));
		this.ready();
	}

	async handleCallback(payload) {
		console.log(payload);
		return { hello: "world" };
	}
}

(() => new UiServer())();
