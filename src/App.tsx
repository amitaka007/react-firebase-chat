
import React, { useState } from "react";
import ReactDOM from "react-dom";
import Chat from "./components/chat/Chat";
import Detail from "./components/details/Detail";
import List from "./components/list/List";
import AuthModal from "./components/modal/AuthModal";
import { Toaster } from 'react-hot-toast';


const App = () => {

  const [user, setUser] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"login" | "signup">("login");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);


  return (
    <div >

      {!user ? (
        <div className="container">
          <List />
          <Chat />
          <Detail />
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