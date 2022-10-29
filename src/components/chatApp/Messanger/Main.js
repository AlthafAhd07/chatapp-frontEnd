import React, { useContext, useRef } from "react";
import "../../../styles/chatApp/main.css";
import Header from "./Header";
import Messages from "./Messages";
import UserInput from "./UserInput";

import { ChatStateContext } from "../../../pages/ChatApp";

const Main = () => {
  const { chatState } = useContext(ChatStateContext);
  const GlobalFocusRefCount = useRef(true);
  return (
    <>
      {chatState ? (
        <main className="main">
          <Header />
          <Messages GlobalFocusRefCount={GlobalFocusRefCount} />
          <UserInput />
        </main>
      ) : (
        <main
          className="main"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgb(219,212,224)",
            background:
              "linear-gradient(14deg, rgba(219,212,224,1) 0%, rgba(191,219,226,1) 100%)",
            width: "100%",
            height: "100%",
          }}
        >
          <p
            style={{
              textAlign: "center",
              fontSize: "1.5rem",
              color: "#4d3434a6",
            }}
          >
            Select a chat to start messaging
          </p>
        </main>
      )}
    </>
  );
};

export default Main;
