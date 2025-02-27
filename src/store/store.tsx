import { create } from "zustand";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";


interface UserState {
  currentUser: any | null; // Replace 'any' with your user type if possible
  isLoading: boolean;
  fetchUserInfo: (uid: string) => Promise<void>;
}
export const useUserStore = create<UserState>((set) => ({
  currentUser: null,
  isLoading: true,
  fetchUserInfo: async (uid: string) => {
    if (!uid) {
      set({ currentUser: null, isLoading: false });
      return
    }
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        set({ currentUser: docSnap.data(), isLoading: false });
      } else {
        set({ currentUser: null, isLoading: false });
      }
    } catch (err) {
      console.log(err);
      set({ currentUser: null, isLoading: false });
    }
  }
}))













