import { createAsyncThunk } from "@reduxjs/toolkit";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../lib/firebase";



// Define TypeScript interfaces for chat and message data
interface Chat {
  id: string;
  participants: string[];
  [key: string]: any; // Allow additional fields from Firestore
}

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: string;
  [key: string]: any; // Allow additional fields from Firestore
}

// Thunk argument types
interface FetchChatsListArgs {
  userId: string;
}

interface FetchChatDetailsArgs {
  chatId: string;
}

interface SendMessageArgs {
  chatId: string;
  message: string;
  userId: string;
}


// Async Thunks
export const fetchChatsList = createAsyncThunk(
    'chat/fetchChatsList',
    async (userId, { rejectWithValue }) => {
      try {
        const chatsQuery = query(
          collection(db, 'chats'),
          where('participants', 'array-contains', userId)
        );
        const querySnapshot = await getDocs(chatsQuery);
        const chats = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        return chats;
      } catch (error: any ) {
        return rejectWithValue(error.message);
      }
    }
  );
  
  export const fetchChatDetails = createAsyncThunk(
    'chat/fetchChatDetails',
    async (chatId, { rejectWithValue }) => {
      try {
        const messagesQuery = query(collection(db, `chats/${chatId}/messages`));
        const querySnapshot = await getDocs(messagesQuery);
        const messages = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        return messages;
      } catch (error : any) {
        return rejectWithValue(error.message);
      }
    }
  );
  
  export const sendMessage = createAsyncThunk(
    'chat/sendMessage',
    async ({ chatId, message, userId }: any, { rejectWithValue }) => {
      try {
        const messageData = {
          text: message,
          senderId: userId,
          timestamp: new Date().toISOString()
        };
        const docRef = await addDoc(
          collection(db, `chats/${chatId}/messages`),
          messageData
        );
        return { id: docRef.id, ...messageData };
      } catch (error : any) {
        return rejectWithValue(error.message);
      }
    }
  );