import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedTab: "Geral",
  search: "",
};

const forumNavigatorSlice = createSlice({
  name: "forumNavigator",
  initialState,
  reducers: {
    setSelectedTab(state, action) {
      state.selectedTab = action.payload;
    },
    setSearch(state, action) {
      state.search = action.payload;
    },
  },
});

export const { setSelectedTab, setSearch, setFilter } =
  forumNavigatorSlice.actions;

export default forumNavigatorSlice.reducer;

export const getSelectedTab = (state) => state.forumNavigator.selectedTab;
export const getSearch = (state) => state.forumNavigator.search;
