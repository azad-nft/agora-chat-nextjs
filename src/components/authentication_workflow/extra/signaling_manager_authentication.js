import SignalingManager from "../signaling_manager/signaling_manager";

const SignalingManagerAuthentication = async (
  messageCallback,
  eventsCallback
) => {
  let streamChannel = null;
  let role = "publisher"; // set the role to "publisher" or "subscriber" as appropriate

  // Extend the SignalingManager by importing it
  const signalingManager = await SignalingManager(
    messageCallback,
    eventsCallback
  );

  // Get the config
  const config = signalingManager.config;

  // Fetches the Signaling token
  async function fetchToken(uid) {
    if (config.serverUrl !== "") {
      try {
        const res = await fetch(
          config.proxyUrl +
            config.serverUrl +
            "/rtm/" +
            uid +
            "/?expiry=" +
            config.tokenExpiryTime,
          {
            headers: {
              "X-Requested-With": "XMLHttpRequest",
            },
          }
        );
        const data = await res.text();
        const json = await JSON.parse(data);
        console.log("RTM token fetched from server: ", json.rtmToken);
        return json.rtmToken;
      } catch (err) {
        console.log(err);
      }
    } else {
      return config.token;
    }
  }

  const fetchTokenAndLogin = async (uid) => {
    const token = await fetchToken(uid);
    signalingManager.login(uid, token);
  };


  const renewToken = async (uid) => {
    const token = await fetchToken(uid);
    const result = await signalingManager
      .getSignalingEngine()
      .renewToken(token);
    messageCallback("Token was about to expire so it was renewed...");
  };

  // Return the extended signaling manager
  return {
    ...signalingManager,
    renewToken,
    fetchTokenAndLogin,
  };
};

export default SignalingManagerAuthentication;
