import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateRide } from '../utils/redux/rideSlice';
import RideTable from './RideTable';
import RideMapView from './RideMapView';

const UserView = () => {
  const dispatch = useDispatch();
  const rides = useSelector((state) => state.ride.rides);
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [viewRide, setViewRide] = useState(null);

  const handleAccept = (ride) => {
    const updatedRide = {
      ...ride,
      assignedUsers: [
        ...(ride.assignedUsers || []),
        {
          username: currentUser.username,
          status: 'ongoing',
          startTime: new Date().toISOString(),
        },
      ],
      status: 'ongoing',
    };
    dispatch(updateRide(updatedRide));
  };

  const handleComplete = (ride) => {
    const updatedAssignedUsers = ride.assignedUsers.map((user) => {
      if (user.username === currentUser.username && user.status === 'ongoing') {
        return {
          ...user,
          status: 'completed',
          endTime: new Date().toISOString(),
        };
      }
      return user;
    });

    const updatedRide = {
      ...ride,
      assignedUsers: updatedAssignedUsers,
      status: 'completed',
    };

    dispatch(updateRide(updatedRide));
  };

  useEffect(() => {
    if (!viewRide) {
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) backdrop.remove();
      document.body.classList.remove('modal-open');
    } else {
      document.body.classList.add('modal-open');
    }
  }, [viewRide]);

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
        <h3 className="text-success fw-bold mb-0">
          <i className="bi bi-truck-front-fill me-2"></i> My Assigned Rides
        </h3>
      </div>

      {rides.length === 0 ? (
        <div className="alert alert-info text-center">
          <i className="bi bi-info-circle me-2"></i> No rides available.
        </div>
      ) : (
        <RideTable
          rides={rides}
          currentUser={currentUser}
          isUserView={true}
          onAccept={handleAccept}
          onComplete={handleComplete}
          onView={(ride) => setViewRide(ride)}
        />
      )}

      {viewRide && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="bi bi-geo-alt-fill me-2"></i> Ride Map View
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setViewRide(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <RideMapView ride={viewRide} />
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
};

export default UserView;
