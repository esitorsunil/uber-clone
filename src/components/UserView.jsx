import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { acceptRideByUser } from '../utils/redux/rideSlice';
import RideTable from './RideTable';

const UserView = () => {
  const rides = useSelector((state) => state.ride.rides);
  const dispatch = useDispatch();
  const currentUser = JSON.parse(localStorage.getItem('user'));

  const hasUserAccepted = (ride) => {
    const assigned = ride.assignedUsers || [];
    return assigned.some((u) => u.username === currentUser.username);
  };

  const filteredRides = rides.filter((ride) => !hasUserAccepted(ride));

  const handleAccept = (ride) => {
    dispatch(
  acceptRideByUser({
    rideId: ride.id,
    username: currentUser.username,
    startTime: new Date().toISOString(),
  })
);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
        <h3 className="text-primary fw-bold mb-0">
          <i className="bi bi-bag-check-fill me-2"></i> Available Rides for You
        </h3>
      </div>

      {filteredRides.length === 0 ? (
        <div className="alert alert-info text-center">
          <i className="bi bi-check-circle me-2"></i> No pending rides for you.
        </div>
      ) : (
        <RideTable
          rides={filteredRides}
          currentUser={currentUser}
          isUserView={true}
          onAccept={handleAccept}
        />
      )}
    </div>
  );
};

export default UserView;
