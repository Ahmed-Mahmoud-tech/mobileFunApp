import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  menuStatus: true,
  route: "",
  backToLogin: false,
};

export const mainConfigSlice = createSlice({
  name: "mainConfig",
  initialState,
  reducers: {
    ChangeMenuStatus: (state, action) => {
      state.menuStatus = action.payload;
    },
    changeRoute: (state, action) => {
      state.route = action.payload;
    },
    backToLoginFun: (state, action) => {
      state.backToLogin = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { ChangeMenuStatus, changeRoute, backToLoginFun } =
  mainConfigSlice.actions;

export default mainConfigSlice.reducer;
