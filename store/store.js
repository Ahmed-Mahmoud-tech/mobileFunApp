import { configureStore } from "@reduxjs/toolkit"
import mainConfigReducer from "./slices/mainConfig"
import userReducer from "./slices/user"

export const store = configureStore({
  reducer: {
    mainConfig: mainConfigReducer,
    user: userReducer,
  },
})
