import { createSlice } from '@reduxjs/toolkit';

const feedSlice = createSlice({
  name: 'feed',
  initialState: {
    users: [],
  },
  reducers: {
    setFeed(state, action) {
      state.users = action.payload;
    },
    removeUserFromFeed(state, action) {
      state.users = state.users.filter((u) => u._id !== action.payload);
    },
  },
});

export const { setFeed, removeUserFromFeed } = feedSlice.actions;
export default feedSlice.reducer;
