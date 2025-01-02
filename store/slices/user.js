import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  userInfo: null,
  currentToken: "",
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setStoredUser: (state, action) => {
      state.userInfo = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setStoredUser } = userSlice.actions

export default userSlice.reducer
