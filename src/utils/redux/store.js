import { configureStore } from '@reduxjs/toolkit';
import rideReducer from './rideSlice';

const store = configureStore({
  reducer: {
    ride: rideReducer,
  
  },
});

export default store;
