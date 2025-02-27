import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchUserInfo } from "../thunk/user/userThunk";

// Define types
interface User {
  // Define your user properties here
  id?: string;
  name?: string;
  email?: string;
  // ... other properties
}

interface UserState {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  isLoading: true,
  error: null,
};

// Create slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Example synchronous reducer
    clearUser: (state) => {
      state.currentUser = null;
      state.error = null;
      state.isLoading = false;
    },
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.currentUser = null;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { clearUser } = userSlice.actions;

// Export reducer
export default userSlice.reducer;