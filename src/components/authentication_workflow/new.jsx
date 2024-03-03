"use client";
import React, { useState, useEffect } from "react";
import SignalingManagerAuthentication from './signaling_manager_authentication'

const ChatApp = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [uid, setUid] = useState("");
  const [channelName, setChannelName] = useState("");
  const [logMessages, setLogMessages] = useState([]);

  useEffect(() => {
    const handleSignalingEvents = (event, eventArgs) => {
      switch (event) {
        case "TokenPrivilegeWillExpire":
          renewToken(uid);
          break;
        default:
          break;
      }
    };

    const initializeSignalingManager = async () => {
      const {
        logout,
        subscribe,
        unsubscribe,
        sendChannelMessage,
        renewToken,
        fetchTokenAndLogin,
      } = await SignalingManagerAuthentication(
        showMessage,
        handleSignalingEvents
      );

      return {
        logout,
        subscribe,
        unsubscribe,
        sendChannelMessage,
        renewToken,
        fetchTokenAndLogin,
      };
    };

    initializeSignalingManager();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showMessage = (message) => {
    const currentTime = new Date().toLocaleTimeString();
    const messageWithTime = `${currentTime}: ${message}`;
    setLogMessages([messageWithTime, ...logMessages]);
  };

  const handleLogin = async () => {
    if (!isLoggedIn) {
      if (uid === "") {
        showMessage("Please enter a User ID.");
        return;
      }

      await fetchTokenAndLogin(uid);

      setIsLoggedIn(true);
    } else {
      await logout();
      setIsLoggedIn(false);
    }
  };

  const handleJoinChannel = async () => {
    await subscribe(channelName);
  };

  const handleLeaveChannel = async () => {
    await unsubscribe(channelName);
  };

  const handleSendChannelMessage = async () => {
    await sendChannelMessage(channelName, channelMessage);
  };

  return (
    <div>
      <h1>Authentication workflow</h1>
      <div className="outer-horizontal">
        <div className="inner-horizontal">
          <div>
            <label>User ID: </label>
            <input
              type="text"
              placeholder="User id"
              value={uid}
              onChange={(e) => setUid(e.target.value)}
            />
            <button className="button" type="button" onClick={handleLogin}>
              {isLoggedIn ? "LOGOUT" : "LOGIN"}
            </button>
          </div>
          <div>
            <label>Join any pub-sub channel: </label>
            <input
              type="text"
              placeholder="Channel Name"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
            />
            <button
              className="button"
              type="button"
              onClick={handleJoinChannel}
            >
              Subscribe
            </button>
            <button
              className="button"
              type="button"
              onClick={handleLeaveChannel}
            >
              Unsubscribe
            </button>
          </div>
          <div>
            <label>Send a message to pub-sub channel: </label>
            <input
              type="text"
              placeholder="Message"
              id="channelMessage"
              onChange={(e) => setChannelMessage(e.target.value)}
            />
            <button
              className="button"
              type="button"
              onClick={handleSendChannelMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
      <p />
      <hr />
      <div id="log">
        {logMessages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
    </div>
  );
};

export default ChatApp;
