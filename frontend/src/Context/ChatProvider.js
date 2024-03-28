import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useCookies } from "react-cookie";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState();
  const [cookies, setCookie, removeCookie] = useCookies(['userInfo']);

  const history = useHistory();

  // useEffect(() => {
  //   const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  //   setUser(userInfo);

  //   if (!userInfo) history.push("/");
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   console.log(userInfo);
  // }, [history]);

  useEffect(() => {
    console.log("cookies",JSON.stringify(cookies.userInfo));


    if(cookies.userInfo){
      localStorage.setItem("userInfo", JSON.stringify(cookies.userInfo));
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      setUser(userInfo);

      history.push("/chats")
    }

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) history.push("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
    console.log(userInfo);
  }, [history]);


  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
