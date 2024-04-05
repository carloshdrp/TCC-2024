import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedTab: "Geral",
  search: "",
  filter: "Todos",
};

const forumNavigatorSlice = createSlice({
  name: "forumNavigator",
  initialState,
  reducers: {
    setSelectedTab(state, action) {
      console.log("Setting selectedTab to", action.payload);

      state.selectedTab = action.payload;
    },
    setSearch(state, action) {
      state.search = action.payload;
    },
    setFilter(state, action) {
      state.filter = action.payload;
    },
  },
});

export const { setSelectedTab, setSearch, setFilter } =
  forumNavigatorSlice.actions;

export default forumNavigatorSlice.reducer;

export const getSelectedTab = (state) => state.forumNavigator.selectedTab;
export const getSearch = (state) => state.forumNavigator.search;
export const getFilter = (state) => state.forumNavigator.filter;
