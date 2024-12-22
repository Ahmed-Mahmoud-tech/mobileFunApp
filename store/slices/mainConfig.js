import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  menuStatus: true,
  route: "",
}

export const mainConfigSlice = createSlice({
  name: "mainConfig",
  initialState,
  reducers: {
    ChangeMenuStatus: (state, action) => {
      state.menuStatus = action.payload
    },
    changeRoute: (state, action) => {
      state.route = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { ChangeMenuStatus, changeRoute } = mainConfigSlice.actions

export default mainConfigSlice.reducer
