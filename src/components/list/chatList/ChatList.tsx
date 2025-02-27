import React, { useEffect, useState } from "react";
import AddUser from "./AddUser/AddUser";
import { useUserStore } from "../../../store/store";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../store/useChatStore";

interface Chat {
  chatId: string;
  receiverId: string;
  user: any;
  updateAt: number;
  images: string;
  name: string;
  message: string;
}




const ChatList = () => {
  const [addMode, setAddMode] = useState<boolean>(false);
  const [chats, setChats] = useState<Chat[]>([]);

  const { currentUser }: any = useUserStore()
  const { changeChat, chatId }: any = useChatStore()

  useEffect(() => {
    const unSub = onSnapshot(doc(db, 'userchats', currentUser.id), async (res) => {
      const items = res.data()?.chats || []; // Handle case if chats are undefined

      const promise = items.map(async (id: any) => {

        if (!id?.receiver) {
          console.warn("Invalid chat id:", id); // log invalid chat data for debugging
          return null; // skip invalid chat
        }
        const userDocRef = doc(db, 'users', id.receiver); // Assuming id has receiverId
        const userDocSnap = await getDoc(userDocRef);
        const user = userDocSnap.data(); // Fixed typo: `.data()` instead of `.date()`
        return { ...id, user };
      });

      const chatData = (await Promise.all(promise)).filter((chat) => chat !== null);
      // Remove duplicates by chatId
      const uniqueChats = Array.from(
        new Map(chatData.map((chat) => [chat.chatId, chat])).values()
      );
      setChats(uniqueChats.sort((a, b) => b.updateAt - a.updateAt));

    });

    return () => unSub();
  }, [currentUser.id]);

  console.log(chats, "chats")



  const handleSelect = async (chat: Chat) => {
    changeChat(chat.chatId, chat.user);
  };

  return (
    <>
      <div className="chatList ">
        <div className="search">
          <div className="flex justify-center sm:justify-start">
            <input
              className="  text-md py-1 px-2 bg-[#11192880] dark:bg-gray-900 text-white rounded-lg dark:text-gray-100  font-semibold  "
              type="search"
              name="q"
              placeholder="Search"
            />
          </div>
          <img
            src={addMode ? "./minus.png" : "./plus.png"}
            alt="add"
            className="add"
            onClick={() => setAddMode((prev) => !prev)}
          />
        </div>




        {chats.map((chat, index) => (
          <div
            key={`${chat.chatId}-${chat.receiverId}-${index}`} // Unique key
            className="item flex items-center  gap-5 p-5 cursor-pointer border-b-[1px] border-[#dddddd35]"
            onClick={() => handleSelect(chat)}
          >
            <img
              src={chat.user?.profilePic || './default-avatar.png'}
              className="avatar w-[50px] h-[50px]  rounded-[50%] object-cover"
            />
            <div className="texts flex flex-col gap-[10px]">
              <span className="font-medium">{chat?.user?.username}</span>
              <p className="text-sm font-light">{chat?.user?.lastMessage}</p>
            </div>
          </div>
        ))}



        {addMode && (
          <AddUser />
        )}

      </div>
    </>
  );
};

export default ChatList;
