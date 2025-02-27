import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { loginAsync, signupAsync } from "../thunk/auth/authThunk";

interface User {
    // Define your user properties here based on your API response
    id?: string;
    email?: string | null | undefined;
    name?: string;
    // ... other properties
}

interface AuthState {
    loading: boolean;
    userDetails: User | null;
    errors: any | null; // Consider defining a more specific error type
}

const initialState: AuthState = {
    loading: false,
    userDetails: null,
    errors: null,
};


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.userDetails = null;
            state.errors = null; // Optional: Reset errors on logout
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(signupAsync.pending, (state) => {
                state.loading = true;
                state.errors = null;
            })
            .addCase(signupAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.userDetails = action.payload.user; 
            })
            .addCase(signupAsync.rejected, (state, action) => {
                state.loading = false;
                state.errors = action.payload as any;
            })
            .addCase(loginAsync.pending, (state) => {
                state.loading = true;
                state.errors = null;
            })
            .addCase(loginAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.userDetails = action.payload.user;
            })
            .addCase(loginAsync.rejected, (state, action) => {
                state.loading = false;
                state.errors = action.payload as any;
            });
    },
});

// exporting reducers
export const { logout } = authSlice.actions;

export default authSlice.reducer;
