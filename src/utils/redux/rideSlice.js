import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  rides: JSON.parse(localStorage.getItem('adminRides')) || [],
  timesheets: JSON.parse(localStorage.getItem('timesheets')) || [],
};

const saveRides = (rides) => {
  localStorage.setItem('adminRides', JSON.stringify(rides));
};

const saveTimesheets = (timesheets) => {
  localStorage.setItem('timesheets', JSON.stringify(timesheets));
};

const rideSlice = createSlice({
  name: 'ride',
  initialState,
  reducers: {
    setRides: (state, action) => {
      state.rides = action.payload;
      saveRides(state.rides);
    },
    addRide: (state, action) => {
      state.rides.push(action.payload);
      saveRides(state.rides);
    },
    updateRide: (state, action) => {
      const updated = action.payload;
      state.rides = state.rides.map((ride) =>
        ride.id === updated.id ? updated : ride
      );
      saveRides(state.rides);
    },
    deleteRide: (state, action) => {
      state.rides = state.rides.filter((ride) => ride.id !== action.payload);
      saveRides(state.rides);
    },
    updateRideStatus: (state, action) => {
      const updated = action.payload;
      state.rides = state.rides.map((ride) =>
        ride.id === updated.id ? updated : ride
      );
      saveRides(state.rides);
    },
    logTimesheet: (state, action) => {
      state.timesheets.push(action.payload);
      saveTimesheets(state.timesheets);
    },

    acceptRideByUser: (state, action) => {
      const { rideId, username, startTime } = action.payload;

      state.rides = state.rides.map((ride) => {
        if (ride.id === rideId) {
          const updatedRide = {
            ...ride,
            status: 'ongoing',
            assignedTo: username,
            assignedUsers: [
              ...(ride.assignedUsers || []),
              { username, startTime, status: 'ongoing' },
            ],
          };
          return updatedRide;
        }
        return ride;
      });

      saveRides(state.rides);
    },

    completeRideByUser: (state, action) => {
      const { rideId, username } = action.payload;

      state.rides = state.rides.map((ride) => {
        if (ride.id === rideId) {
          const updatedAssignedUsers = ride.assignedUsers.map((user) =>
            user.username === username
              ? {
                  ...user,
                  status: 'completed',
                  endTime: new Date().toISOString(),
                }
              : user
          );

          return {
            ...ride,
            status: 'completed',
            assignedUsers: updatedAssignedUsers,
          };
        }
        return ride;
      });

      saveRides(state.rides);
    },

    addTimesheetEntry: (state, action) => {
      const { rideId, username, location } = action.payload;
      const ride = state.rides.find((r) => r.id === rideId);
      if (ride) {
        const user = ride.assignedUsers?.find((u) => u.username === username);
        if (user) {
          if (!user.timesheet) user.timesheet = [];
          user.timesheet.push({
            timestamp: new Date().toISOString(),
            location,
          });
          saveRides(state.rides);
        }
      }
    },
  },
});

export const {
  setRides,
  addRide,
  updateRide,
  deleteRide,
  updateRideStatus,
  logTimesheet,
  acceptRideByUser,
  completeRideByUser,
  addTimesheetEntry,
} = rideSlice.actions;

export default rideSlice.reducer;
