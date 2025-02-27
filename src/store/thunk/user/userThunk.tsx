import { createAsyncThunk } from "@reduxjs/toolkit";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";

// Create async thunk for fetching user info
export const fetchUserInfo = createAsyncThunk(
  'user/fetchUserInfo',
  async (uid : string, { rejectWithValue }) => {
    try {
      if (!uid) return null;

      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      }
      return null;
    } catch (err: any) {
      console.log(err);
      return rejectWithValue(err.message);
    }
  }
);