import { configureStore } from "@reduxjs/toolkit";
import mainConfigReducer from "./slices/mainConfig";
import notificationReducer from "./slices/notification";
import userReducer from "./slices/user";

export const store = configureStore({
  reducer: {
    mainConfig: mainConfigReducer,
    user: userReducer,
    notification: notificationReducer,
  },
});
