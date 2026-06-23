import { createSlice } from '@reduxjs/toolkit';

const membershipSlice = createSlice({
  name: 'membership',
  initialState: {
    isPremium: false,
    membershipType: null,
    expiryDate: null,
  },
  reducers: {
    setMembership(state, action) {
      const { isPremium, membershipType, expiryDate } = action.payload || {};
      state.isPremium = !!isPremium;
      state.membershipType = membershipType || null;
      state.expiryDate = expiryDate || null;
    },
    clearMembership(state) {
      state.isPremium = false;
      state.membershipType = null;
      state.expiryDate = null;
    },
  },
});

export const { setMembership, clearMembership } = membershipSlice.actions;
export default membershipSlice.reducer;
