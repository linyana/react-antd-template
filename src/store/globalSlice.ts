import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface GlobalState {
  token: string;
}

const initialState: GlobalState = {
  token: window.localStorage.getItem("project-name-token") || "",
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    removeToken: (state) => {
      window.localStorage.removeItem("project-name-token");
      state.token = "";
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      window.localStorage.setItem("project-name-token", state.token);
    },
  },
});

export const { setToken, removeToken } = globalSlice.actions;

export default globalSlice.reducer;
