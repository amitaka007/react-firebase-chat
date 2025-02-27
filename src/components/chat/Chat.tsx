import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useState } from "react";
import { messages } from "../../data/data";
import { arrayUnion, doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../store/useChatStore";
import { useUserStore } from "../../store/store";


// Define the expected chat data type (adjust according to your actual data structure)
interface ChatData {
  messages?: any[]; // Replace 'any' with your actual message type
  [key: string]: any; // For other potential properties
}const Chat = () => {
  const { chatId, user }: any = useChatStore()
  const { currentUser } = useUserStore()

  const [open, setOpen] = useState<boolean>(false);
  const [chats, setChats] = useState<ChatData | null>(null);
  const [text, setText] = useState<string>("");
  const endRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 0) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      // Check if document exists and handle the data
      if (res.exists()) {
        setChats(res.data() as ChatData);
      } else {
        // Handle case where document doesn't exist
        setChats(null);
      }
    })

    return () => {
      unSub()
    }
  }, [chatId])

  console.log(chats, "chatfile")


  const handleEmoji = (e: { emoji: string }) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleSend = async () => {
    if (text.trim() === "") {
      return;
    }

    try {
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date()
        })
      })

      const userIDs = [currentUser.id, user.id]

      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "userChats", id)
        const userChatsSnapshot = await getDoc(userChatsRef)

        if (userChatsSnapshot.exists()) {
          const userchatsData = userChatsSnapshot.data();
          const chatIndex: number = userchatsData.chats.findIndex((c: any) => c.chatId === chatId);

          userchatsData[chatIndex].lastMessage = text;
          userchatsData[chatIndex].isSeen = id === currentUser.id ? true : false;
          userchatsData[chatIndex].updatedAt = Date.now()


          await updateDoc(userChatsRef, {
            chats: userchatsData.chats,
            lastMessage: text,
            isSeen: true,
            updatedAt: Date.now()
          })
        }
      })

    } catch (err) {
      console.error("Error sending message:", err);
    }

    // Scroll to the bottom of the chat
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  console.log(chats, "=========>>>>>")

  return (
    <div className="chat">
      <div className="top p-5 flex items-center justify-between border-b">
        <div className="user flex items-center gap-5">
          <img
            src="./avatar.png"
            alt="avatar"
            className=" w-[60px] h-[60px] rounded-[50%] object-cover"
          />
          <div className="texts flex flex-col gap-5">
            <span className="text-[18px] font-bold">John Doe</span>
            <p className="text-sm font-light text-[#a5a5a5]">
              Lorem ipusm dolar sit
            </p>
          </div>
        </div>
        <div className="icons flex gap-5">
          <img
            src="./phone.png"
            alt="phone"
            className="w-5 h-5 cursor-pointer "
          />
          <img
            src="./camera.png"
            alt="camera"
            className="w-5 h-5 cursor-pointer "
          />
          <img src="./mic.png" alt="mic" className="w-5 h-5 cursor-pointer " />
        </div>
      </div>

      <div className="center p-5 flex-1 flex flex-col gap-5 overflow-y-scroll">
        {/* {messages.map((msg, index) => (
          <div
            key={index}
            className={`messages max-w-[70%] flex gap-5 ${msg.class || ""}`}
          >
            Display bot avatar if botMessage exists
            {msg.img && msg.botMessage && (
              <img
                src={msg.img}
                alt="avatar"
                className="w-7 h-7 rounded-[50%] object-cover"
              />
            )}

            <div className="texts flex-1 flex flex-col gap-5">
              Image Message
              {msg.imageMessage ? (
                <img
                  src={msg.img}
                  alt="avatar"
                  className="w-full h-[300px] rounded-[10px] object-cover"
                />
              ) : (
                <p
                  className={`p-5 rounded-[10px] ${msg.botMessage ? "bg-[#11192880]" : "bg-[#5183fe] text-white"
                    }`}
                >
                  {msg.botMessage || msg.userMessage}
                </p>
              )}
              <span className="text-sm">{msg.time}</span>
            </div>
          </div>
        ))} */}


        {chats?.messages?.map((message, index) => (
          <div
            key={index}
            className={`message max-w-[70%] flex gap-5 ${message.class || ""}`}
          >
            
            <div className="texts flex-1 flex flex-col gap-5 ">
              <p
                className={`p-5 rounded-[10px] ${message.senderId === "VHBsAfbX7yWncHsE8W7he8DzDtx2"
                    ? "bg-[#5183fe] text-white"
                    : "bg-[#11192880]"
                  }`}
              >
                {message.text}
              </p>
              {/* Convert timestamp to readable format */}
              <span className="text-sm">
                {new Date(message.createdAt.seconds * 1000).toLocaleTimeString()}
              </span>
            </div>
           </div>
        ))}
        <div ref={endRef}></div>
      </div>


      <div className="bottom p-5 gap-5 flex items-center justify-between border-t border-[#dddddd35]">
        <div className="icons flex gap-5">
          <img
            src="./phone.png"
            alt="phone"
            className="w-5 h-5 cursor-pointer "
          />
          <img
            src="./camera.png"
            alt="camera"
            className="w-5 h-5 cursor-pointer "
          />
          <img src="./mic.png" alt="mic" className="w-5 h-5 cursor-pointer " />
        </div>
        <input
          type="text"
          placeholder="Type a message"
          onChange={(e) => setText(e.target.value)}
          value={text}
          className="input border-none   outline-none bg-[#11192880] text-white p-5 rounded-[10px] text-base"
        />
        <div className="emoji relative">
          <img
            src="./emoji.png"
            alt="emoji"
            className="w-5 h-5  cursor-pointer "
            onClick={() => setOpen((prev) => !prev)}
          />
          <div className="picker absolute bottom-[50px] left-0">
            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button className="sendButton bg-[#5183fe] text-white px-5 py-[10px] border-none rounded-[5px] cursor-pointer" onClick={handleSend}>
          {" "}
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
