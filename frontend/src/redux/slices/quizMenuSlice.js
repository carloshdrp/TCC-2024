import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  menuTab: "Descobrir",
};

const quizMenuSlice = createSlice({
  name: "quizMenu",
  initialState,
  reducers: {
    setMenuTab(state, action) {
      state.menuTab = action.payload;
    },
  },
});

export const { setMenuTab } = quizMenuSlice.actions;

export default quizMenuSlice.reducer;

export const getMenuTab = (state) => state.quizMenu.menuTab;
