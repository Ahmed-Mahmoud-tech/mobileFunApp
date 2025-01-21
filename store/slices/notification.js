import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notification: null,
  unReadCount: 0,
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setStoredLastNotification: (state, action) => {
      state.notification = action.payload;
    },
    setUnReadCount: (state, action) => {
      state.unReadCount = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setStoredLastNotification, setUnReadCount } =
  notificationSlice.actions;

export default notificationSlice.reducer;
