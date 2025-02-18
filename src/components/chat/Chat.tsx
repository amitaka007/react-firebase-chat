import  EmojiPicker from "emoji-picker-react";
import React, { useState } from "react";
import { messages } from "../../data/data";

const Chat = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [text, setText] = useState<string>("");


  const handleEmoji = (e: { emoji: string }) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

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
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`messages max-w-[70%] flex gap-5 ${msg.class || ""}`}
          >
            {/* Display bot avatar if botMessage exists */}
            {msg.img && msg.botMessage && (
              <img
                src={msg.img}
                alt="avatar"
                className="w-7 h-7 rounded-[50%] object-cover"
              />
            )}

            <div className="texts flex-1 flex flex-col gap-5">
              {/* Image Message */}
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
        ))}
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
        <button className="sendButton bg-[#5183fe] text-white px-5 py-[10px] border-none rounded-[5px] cursor-pointer">
          {" "}
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
