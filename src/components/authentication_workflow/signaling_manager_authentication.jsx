import React, { useState, useEffect } from 'react';
import SignalingManager from '../signaling_manager/signaling-manager';

const SignalingManagerAuthentication = ({ messageCallback, eventsCallback }) => {
  const [signalingManager, setSignalingManager] = useState(null);
  const [streamChannel, setStreamChannel] = useState(null);
  const [role, setRole] = useState('publisher');

  useEffect(() => {
    const initializeSignalingManager = async () => {
      const sm = await SignalingManager(messageCallback, eventsCallback);
      setSignalingManager(sm);
      const config = sm.config;
      setStreamChannel(config.streamChannel);
      // You can set role based on some conditions if needed
    };

    initializeSignalingManager();

    // Clean up function if needed
    return () => {
      // Clean up process
    };
  }, [messageCallback, eventsCallback]);

  const fetchToken = async (uid) => {
    if (signalingManager && signalingManager.config.serverUrl !== '') {
      try {
        const res = await fetch(
          signalingManager.config.proxyUrl +
            signalingManager.config.serverUrl +
            '/rtm/' +
            uid +
            '/?expiry=' +
            signalingManager.config.tokenExpiryTime,
          {
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
            },
          }
        );
        const data = await res.text();
        const json = JSON.parse(data);
        console.log('RTM token fetched from server: ', json.rtmToken);
        return json.rtmToken;
      } catch (err) {
        console.log(err);
      }
    } else {
      return signalingManager.config.token;
    }
  };

  const fetchTokenAndLogin = async (uid) => {
    const token = await fetchToken(uid);
    signalingManager.login(uid, token);
  };

  const renewToken = async (uid) => {
    const token = await fetchToken(uid);
    const result = await signalingManager.getSignalingEngine().renewToken(token);
    messageCallback('Token was about to expire so it was renewed...');
  };

  // Render nothing until signalingManager is initialized
  if (!signalingManager) return null;

  return {
    ...signalingManager,
    renewToken,
    fetchTokenAndLogin,
  };
};

export default SignalingManagerAuthentication;
