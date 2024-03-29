import React, { useContext, useEffect, useState } from "react";

import "../../../styles/chatApp/controller.css";

import OnlineUsers from "./OnlineUsers";
import SearchBar from "./SearchBar";
import Chats from "./Chats";

import { ChatStateContext } from "../../../pages/ChatApp";
import socket from "../../../socket";
import { CheckTokenEx } from "../../../utils/checkTockenExpiration";

const Controller = () => {
  const { chatState, setChatState, setChatLoading, setChatList, authUser } =
    useContext(ChatStateContext);

  const [toggled, setToggled] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [resultUsers, setResultUsers] = useState([]);
  //chat-app-backend-althaf.herokuapp.com/

  const FetchALLChats = async () => {
    const accessToken = await CheckTokenEx(authUser?.access_token);
    fetch("/api/getAllUserChats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: accessToken,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setChatList(res.msg);
      });
  };

  useEffect(() => {
    if (!searchInput) return;
    fetch(
      `/api/searchUser?username=${searchInput}&currentUser=${authUser?.user?.username}`
    )
      .then((res) => res.json())
      .then((res) => {
        setResultUsers(res.msg);
      });
  }, [searchInput, authUser?.user?.username]);
  async function selectChat(opponent) {
    setChatLoading(true);
    const accessToken = await CheckTokenEx(authUser?.access_token);
    fetch("/api/specificChat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: accessToken,
      },
      body: JSON.stringify({ opponent }),
    })
      .then((res) => res.json())
      .then((res) => {
        setChatState(res.msg);
        setChatLoading(false);
        FetchALLChats();

        if (res?.msg?.newChat === true) {
          console.log("done");
          socket.connect();
        }

        if (chatState) {
          socket.emit("leaveRoom", chatState._id);
        }
        socket.emit("join__room", res.msg._id);

        setSearchInput("");
      });
  }

  return (
    <section className="controller">
      <div className="controller__heading">Chat</div>
      <SearchBar setSearchInput={setSearchInput} searchInput={searchInput} />
      <div
        style={{
          height: `${searchInput ? "0" : "100%"}`,
          overflow: "hidden",
          transition: "all 500ms ease-in-out",
        }}
      >
        <OnlineUsers
          toggled={toggled}
          setToggled={setToggled}
          FetchALLChats={FetchALLChats}
        />
        <Chats toggled={toggled} FetchALLChats={FetchALLChats} />
      </div>

      <div style={{ marginTop: "10px" }}>
        <h2 style={{ textAlign: "center", margin: 0, marginBottom: "10px" }}>
          Users
        </h2>
        {resultUsers.map((user) => {
          return (
            <div
              className="controller__singleChat"
              key={user._id}
              onClick={() => {
                selectChat(user.username);
              }}
            >
              <div className="controller__singleChatProfile">
                <img src={user.avatar} alt="userProfile" />
              </div>
              <div className="controller__singleChatName">
                <h3>{user.username}</h3>
                <div>
                  <span className="controller__lastChat">
                    {user.online[0] === "true" ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Controller;
