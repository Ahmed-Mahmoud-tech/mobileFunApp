import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notification: [],
  unReadCount: 0,
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setStoredNotification: (state, action) => {
      const newObject = JSON.parse(JSON.stringify(state.notification));
      console.log(newObject, "4444444444111");
      state.notification = [...newObject, action.payload];
    },
    setUnReadCount: (state, action) => {
      state.unReadCount = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setStoredNotification, setUnReadCount } =
  notificationSlice.actions;

export default notificationSlice.reducer;
