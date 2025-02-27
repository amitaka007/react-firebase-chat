import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { loginAsync, signupAsync } from "../thunk/auth/authThunk";
import { fetchChatDetails, fetchChatsList, sendMessage } from "../thunk/chat/chatThunk";

 

const initialState = {
    chatsList: [],
    currentChat: null,
    messages: [],
    loading: false, 
    error: null,
};


const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setCurrentChat: (state, action) => {
            state.currentChat = action.payload;
          },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchChatsList.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(fetchChatsList.fulfilled, (state, action) => {
            state.loading = false;
            state.chatsList = action.payload;
          })
          .addCase(fetchChatsList.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })
          // Fetch Chat Details
          .addCase(fetchChatDetails.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(fetchChatDetails.fulfilled, (state, action) => {
            state.loading = false;
            state.messages = action.payload;
          })
          .addCase(fetchChatDetails.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })
          // Send Message
          .addCase(sendMessage.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(sendMessage.fulfilled, (state, action) => {
            state.loading = false;
            state.messages.push(action.payload);
          })
          .addCase(sendMessage.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          });
    },
});

// exporting reducers
export const { setCurrentChat } = authSlice.actions;

export default authSlice.reducer;
