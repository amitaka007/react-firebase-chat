
import React, { useEffect, useState } from "react"; 
import Chat from "./components/chat/Chat";
import Detail from "./components/details/Detail";
import List from "./components/list/List";
import AuthModal from "./components/modal/AuthModal";
import { Toaster } from 'react-hot-toast'; 
import { onAuthStateChanged } from "firebase/auth"; 
import { useUserStore } from "./store/store";
import { auth } from "./lib/firebase";
import Loader from "./components/loader/Loader";
import { useChatStore } from "./store/useChatStore";


const App = () => { 
  const [modalType, setModalType] = useState<"login" | "signup">("login");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);

  const { currentUser, isLoading, fetchUserInfo} : any = useUserStore() 
    const {chatId} : any = useChatStore()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user)  => {  
        // console.log("User is authenticated:", user);
        fetchUserInfo(user?.uid);
    }); 
    return () => unsubscribe();
  }, [fetchUserInfo])
 
  // console.log(currentUser, "curentuser")


  if (isLoading) return <div className="text-7xl "> <Loader /> </div>
  return (
    <div >

      {currentUser ? (
        <div className="container">
          <List />
          {chatId&& <Chat />}
         { chatId&& <Detail />}
        </div>
      ) : (<AuthModal
        type={modalType}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />)}
      <Toaster position="top-right" />

    </div>
  );
};

export default App;