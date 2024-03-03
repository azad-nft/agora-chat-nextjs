import React, { useState, useEffect } from 'react';
import AgoraRTM from 'agora-rtm-sdk';
import config from './config.json';

const SignalingManager = ({ messageCallback, eventsCallback }) => {
  const [signalingEngine, setSignalingEngine] = useState(null);

  useEffect(() => {
    const setupSignalingEngine = async () => {
      try {
        const rtmConfig = {
          token: config.token,
          useStringUserId: config.useStringUserId,
          logUpload: config.logUpload,
          presenceTimeout: config.presenceTimeout,
        };
        const engine = new AgoraRTM.RTM(config.appId, config.uid, rtmConfig);
        setSignalingEngine(engine);

        // Add event listeners
        engine.addEventListener('message', eventArgs => {
          eventsCallback('message', eventArgs);
          messageCallback(
            `Received message from ${eventArgs.publisher}: ${eventArgs.message}`
          );
        });
        engine.addEventListener('status', eventArgs => {
          eventsCallback('status', eventArgs);
          messageCallback(
            `Connection state changed to: ${eventArgs.state}, Reason: ${eventArgs.reason}`
          );
        });
        engine.addEventListener('presence', eventArgs => {
          eventsCallback('presence', eventArgs);
          if (eventArgs.eventType === 'SNAPSHOT') {
            messageCallback(
              `User ${eventArgs.snapshot[0].userId} joined channel ${eventArgs.channelName}`
            );
          } else {
            messageCallback(
              `Presence event: ${eventArgs.eventType}, User: ${eventArgs.publisher}`
            );
          }
        });
        engine.addEventListener('storage', eventArgs => {
          eventsCallback('storage', eventArgs);
        });
        engine.addEventListener('topic', eventArgs => {
          eventsCallback('topic', eventArgs);
        });
        engine.addEventListener('lock', eventArgs => {
          eventsCallback('lock', eventArgs);
        });
        engine.addEventListener('TokenPrivilegeWillExpire', eventArgs => {
          eventsCallback('TokenPrivilegeWillExpire ', eventArgs);
        });
      } catch (error) {
        console.log('Error:', error);
      }
    };

    setupSignalingEngine();

    return () => {
      if (signalingEngine) {
        signalingEngine.logout();
      }
    };
  }, [messageCallback, eventsCallback]);

  const login = async (uid, token) => {
    try {
      if (uid !== undefined) config.uid = uid;
      if (token !== undefined) config.token = token;

      if (!signalingEngine) return;

      await signalingEngine.login();
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async () => {
    try {
      if (!signalingEngine) return;

      await signalingEngine.logout();
    } catch (error) {
      console.log(error);
    }
  };

  const createChannel = async (channelName) => {
    try {
      if (!signalingEngine) return;

      await signalingEngine.createStreamChannel(channelName || config.channelName);
    } catch (error) {
      console.error(error);
    }
  };

  const subscribe = async (channelName) => {
    try {
      if (!signalingEngine) return;

      const subscribeOptions = {
        withMessage: true,
        withPresence: true,
        withMetadata: true,
        withLock: true,
      };
      await signalingEngine.subscribe(channelName || config.channelName, subscribeOptions);
    } catch (error) {
      console.log(error);
    }
  };

  const unsubscribe = async (channelName) => {
    try {
      if (!signalingEngine) return;

      await signalingEngine.unsubscribe(channelName || config.channelName);
      messageCallback(`You have successfully left channel ${channelName}`);
    } catch (error) {
      console.log(error);
    }
  };

  const sendChannelMessage = async (channelName, message) => {
    try {
      if (!signalingEngine) return;

      const payload = { type: 'text', message };
      const publishMessage = JSON.stringify(payload);
      await signalingEngine.publish(channelName, publishMessage);
      messageCallback(`Message sent to channel ${channelName}: ${message}`);
    } catch (error) {
      console.log(error);
    }
  };

  const getOnlineMembersInChannel = async (channelName, channelType) => {
    try {
      if (!signalingEngine) return;

      const result = await signalingEngine.presence.getOnlineUsers(channelName, channelType);
      return result.occupants;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    config,
    login,
    logout,
    createChannel,
    subscribe,
    unsubscribe,
    sendChannelMessage,
    getOnlineMembersInChannel,
  };
};

export default SignalingManager;
