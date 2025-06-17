import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  status: 'all',
  users: [],
};

const filterSlice = createSlice({
  name: 'rideFilter',
  initialState,
  reducers: {
    setStatusFilter: (state, action) => {
      state.status = action.payload;
    },
    setUserFilter: (state, action) => {
      state.users = action.payload; // array of usernames
    },
    resetFilters: (state) => {
      state.status = 'all';
      state.users = [];
    },
  },
});

export const { setStatusFilter, setUserFilter, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;