import { createAsyncThunk } from "@reduxjs/toolkit"; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, User } from "firebase/auth";
import { auth, db } from "../../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
 


interface LoginCredentails {
  email: string;
  password: string;
}

interface SignupCredentials {
  email: string;
  password: string;
  username: string;
  avatarFile?: File | null;
}

interface UserResponse {
  user: User;
  username?: string;
  profilePic?: string;
}

// Thunk for login
export const loginAsync = createAsyncThunk <UserResponse, LoginCredentails>(
  'auth/loginAsync',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user };
    } catch (error : any) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk for signup
export const signupAsync = createAsyncThunk<UserResponse, SignupCredentials>(
  'auth/signupAsync',
  async ({ email, password, username, avatarFile }, { rejectWithValue }) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      let imageUrl = '';

      if (avatarFile && avatarFile.size > 0) {
        const uploadData = new FormData();
        uploadData.append('file', avatarFile);
        uploadData.append('upload_preset', 'Chatbot');

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/duafpzkdx/image/upload`,
          { method: 'POST', body: uploadData }
        );
        if (!response.ok) throw new Error('Failed to upload avatar');
        const data = await response.json();
        imageUrl = data.secure_url;
      }

      await setDoc(doc(db, 'users', res.user.uid), {
        username,
        email,
        id: res.user.uid,
        profilePic: imageUrl || './default_profilepic.jpg',
        blocked: [],
      }, { merge: true });

      await setDoc(doc(db, 'userchats', res.user.uid), { chats: [] });

      return { user: res.user, username, profilePic: imageUrl || './default_profilepic.jpg' };
    } catch (error : any) {
      return rejectWithValue(error.message);
    }
  }
);
  
