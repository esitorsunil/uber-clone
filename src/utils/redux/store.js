import { configureStore } from '@reduxjs/toolkit';
import rideReducer from './rideSlice';
import rideFilterReducer from './filterSlice'; 

const store = configureStore({
  reducer: {
    ride: rideReducer,
    rideFilter: rideFilterReducer, 
  },
});

export default store;
