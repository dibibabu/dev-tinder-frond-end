import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: null,
  reducers: {
    addFeed: (state, action) => {
      return action.payload;
    },
    removeUserFromFeed: (state, action) => {
      return state ? state.filter((user) => user._id !== action.payload) : state;
    },
    removeFeed: () => {
      return null;
    },
  },
});

export const { addFeed, removeUserFromFeed, removeFeed } = feedSlice.actions;

export default feedSlice.reducer;
