const { HomebridgePluginUiServer } = require("@homebridge/plugin-ui-utils");
const express = require("express");
const crypto = require("crypto");

const port = 8880;

class UiServer extends HomebridgePluginUiServer {
  constructor() {
    super();
    this.onRequest("/callback", this.handleCallback.bind(this));
    this.onRequest("/autorizationUrl", this.handleAuthorizationUrl.bind(this));
    this.ready();
  }

  async handleAuthorizationUrl() {
    try {
      this.verifier = this.base64URLEncode(crypto.randomBytes(32));
      this.app = express();
      
      // Add error handling middleware
      this.app.use((err, req, res, next) => {
        console.error('Express error:', err);
        res.status(500).send('Internal Server Error');
      });

      // Start server with error handling
      this.server = this.app.listen(port, () => {
        console.log(`Auth server listening on port ${port}`);
      }).on('error', (err) => {
        console.error('Failed to start auth server:', err);
        throw err;
      });

      const challenge = this.base64URLEncode(this.sha256(this.verifier));
      const clientId = "1ca9f585-4a55-4085-8e30-9746a65fa561";
      const redirectUri = "https://my.home-assistant.io/redirect/oauth";
      const scope = [
        "openid",
        "https://HiloDirectoryB2C.onmicrosoft.com/hiloapis/user_impersonation",
        "offline_access",
      ].join(" ");

      const state = Math.random().toString(36).substring(7);
      const authorizationURL = `https://connexion.hiloenergie.com/HiloDirectoryB2C.onmicrosoft.com/B2C_1A_SIGN_IN/oauth2/v2.0/authorize?response_type=code&code_challenge=${challenge}&code_challenge_method=S256&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
      
      console.log('Generated authorization URL');
      return {
        authorizationURL,
      };
    } catch (error) {
      console.error('Error in handleAuthorizationUrl:', error);
      throw error;
    }
  }

  base64URLEncode(str) {
    return str
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
  }

  sha256(buffer) {
    return crypto.createHash("sha256").update(buffer).digest();
  }

  async handleCallback() {
    return new Promise((resolve, reject) => {
      try {
        this.app.get("/auth/external/callback", async (req, res) => {
          try {
            console.log('Received callback request');
            const code = req.query.code;
            
            if (!code) {
              console.error('No code received in callback');
              res.status(400).send('Authorization code missing');
              return;
            }

            console.log('Exchanging code for token');
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
                  code_verifier: this.verifier,
                  grant_type: "authorization_code",
                  redirect_uri: "https://my.home-assistant.io/redirect/oauth",
                }),
              },
            );

            if (!tokenResponse.ok) {
              const errorText = await tokenResponse.text();
              console.error('Token request failed:', errorText);
              res.status(500).send('Failed to obtain token');
              return;
            }

            const body = await tokenResponse.json();
            const refreshToken = body.refresh_token;
            
            if (!refreshToken) {
              console.error('No refresh token received');
              res.status(500).send('No refresh token received');
              return;
            }

            console.log('Successfully obtained refresh token');
            res.send("Success - you can now close this window");
            resolve({
              refreshToken,
            });

            // Clean up server after successful token exchange
            if (this.server) {
              this.server.close(() => {
                console.log('Auth server closed');
              });
            }
          } catch (error) {
            console.error('Error in callback handler:', error);
            res.status(500).send('Internal Server Error');
            reject(error);
          }
        });
      } catch (error) {
        console.error('Error setting up callback route:', error);
        reject(error);
      }
    });
  }
}

(() => {
  try {
    new UiServer();
  } catch (error) {
    console.error('Failed to initialize UiServer:', error);
    process.exit(1);
  }
})();
