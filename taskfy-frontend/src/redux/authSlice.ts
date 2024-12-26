import { createSlice } from "@reduxjs/toolkit";
import { User } from "../model/user";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: <User | null>null,
    isLoggedIn: false,
    token: <string | null>null,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user as User;
      state.isLoggedIn = action.payload.isLoggedIn;
      state.token = action.payload.token;
    },
    register: (state, action) => {
      state.user = action.payload.user;
      state.isLoggedIn = false;
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.token = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
