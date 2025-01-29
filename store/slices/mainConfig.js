import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  menuStatus: true,
  route: "",
  backToLogin: false,
  preloader: false,
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
    changePreloader: (state, action) => {
      state.preloader = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  ChangeMenuStatus,
  changeRoute,
  backToLoginFun,
  changePreloader,
} = mainConfigSlice.actions;

export default mainConfigSlice.reducer;
