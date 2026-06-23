import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import feedReducer from './slices/feedSlice';
import membershipReducer from './slices/membershipSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    feed: feedReducer,
    membership: membershipReducer,
  },
});

export default store;
