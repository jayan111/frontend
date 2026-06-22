import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import feedReducer from './slices/feedSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    feed: feedReducer,
  },
});

export default store;
