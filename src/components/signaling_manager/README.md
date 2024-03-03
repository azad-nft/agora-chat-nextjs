# Config

This README provides information about the configuration file [`config.json`](config.json) used in the project. The file contains the following structure:

```json
{
  "uid": "1",
  "appId": "",
  "channelName": "",
  "rtcToken": "",
  "proxyUrl": "http://localhost:8080/",
  "serverUrl": "",
  "tokenExpiryTime": "600",
  "token": "",
  "encryptionMode": 7,
  "salt": "",
  "cipherKey": "",
  "presenceTimeout": 300,
  "logUpload": false,
  "logLevel": "debug",
  "cloudProxy": true,
  "useStringUserId": false
}
```

## DocsAppConfig Struct

The `rmtConfig` struct represents the configuration for the application and provides a shared instance of the configuration data. It conforms to the `Codable` protocol for easy serialization and deserialization of JSON data.

### Properties

- `uid`: The user ID associated with the application.
- `appId`: The unique ID for the application obtained from https://console.agora.io.
- `channelName`: The pre-filled text for the channel to join.
- `rtcToken`: The RTC (Real-Time Communication) token generated for authentication.
- `proxyUrl`: The URL of the proxy server to be used.
- `serverUrl`: The URL for the token generator (no trailing slash).
- `tokenExpiryTime`: The expiry time (in seconds) for token generated from the token generator.
- `token`: The signaling token generated for authentication.
- `encryptionMode`: The mode for encryption, ranging from 1 to 8.
- `salt`: The salt used for RTC encryption.
- `cipherKey`: The encryption key used for RTC encryption.
- `presenceTimeout`: Timeout before presence is removed. The unit is seconds, and the value range is [10,300].
- `logLevel`: Filters for different log levels: error, warn, info, track and debug.
- `cloudProxy`: Whether to enable cloud proxy.
- `useStringUserId`: Whether to use string type user ID. Recommended setting is false.

The configuration data is loaded from the config.json file located in the project bundle.

```js
// Get the config from config.json
const config = await fetch("/signaling_manager/config.json").then((res) =>
  res.json()
);

// Accessing the configuration properties
let uid = config.uid;
let appId = config.appId;
let channel = config.channel;
// ... and so on
```

Please ensure that the [`config.json`](config.json) file is correctly populated with the required values before running the application.

# Run tests

The project is e2e tested using cypress testing. To start tests:
- Install `pnpm` using `npm install -g pnpm`.
- Install dependencies using `pnpm install`.
- Run the project using `pnpm run dev`.
- Run `npx cypress open` in the root directory of the project in another terminal.
- Select `E2E Testing` in the dialog box that opens.
- Choose any browser from the options shown.
- Click on the test you want to run, for example, `sdk_quickstart.cy.js` tests the `sdk_quickstart` project, and so on.
