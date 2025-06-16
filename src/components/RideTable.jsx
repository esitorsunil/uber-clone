import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { completeRideByUser } from '../utils/redux/rideSlice'; 

const RideTable = ({
  rides,
  currentUser,
  isUserView = false,
  onAccept,
  onEdit,
  onDelete,
  onView, 
}) => {
  const [elapsedTimes, setElapsedTimes] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedElapsed = {};
      rides.forEach((ride) => {
        const assigned = ride.assignedUsers?.find((u) => u.status === 'ongoing');
        if (assigned?.startTime) {
          const diff = Date.now() - new Date(assigned.startTime).getTime();
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          updatedElapsed[ride.id] = `${hours}h ${minutes}m ${seconds}s`;
        }
      });
      setElapsedTimes(updatedElapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [rides]);

  const cellStyle = {
    maxWidth: '250px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const stickyStyle = (left) => ({
    ...cellStyle,
    position: 'sticky',
    left,
    backgroundColor: '#fff',
    zIndex: 1,
  });

  const onComplete = (ride) => {
    dispatch(
      completeRideByUser({
        rideId: ride.id,
        username: currentUser.username,
      })
    );
  };

  return (
    <div className="scroll-container" style={{ overflowX: 'auto' }}>
      <table className="table align-middle table-hover mt-3" style={{ minWidth: '1800px' }}>
        <thead className="bg-light">
          <tr className="align-middle border-bottom text-secondary">
            <th style={{ ...stickyStyle(0), width: '150px' }} className="py-3 px-3">Ride ID</th>
            <th style={{ ...stickyStyle(150), width: '300px' }} className="py-3 px-3">Pickup</th>
            <th className="py-3 px-3">Drop</th>
            <th className="py-3 px-3">Distance (km)</th>
            <th className="py-3 px-3">Fare</th>
            <th className="py-3 px-3">Assigned To</th>
            <th className="py-3 px-3">Status</th>
            <th className="py-3 px-3">Start Date</th>
            <th className="py-3 px-3">Start Time</th>
            <th className="py-3 px-3">Timer</th>
            <th className="py-3 px-3">View</th>
            <th className="py-3 px-3 text-end">{isUserView ? 'Action' : 'Actions'}</th>
          </tr>
        </thead>
        <tbody>
          {rides
            .filter((ride) => {
              if (!isUserView) return true;
              const acceptedUser = ride.assignedUsers?.find((u) => u.status === 'ongoing');
              return !acceptedUser || acceptedUser.username === currentUser?.username;
            })
            .map((ride) => {
              const employeeStatus = ride.assignedUsers?.find(
                (u) => u.username === currentUser?.username
              );
              const canAccept = !employeeStatus || employeeStatus.status === 'pending';

              const ongoingUser = ride.assignedUsers?.find((u) => u.status === 'ongoing');
              const startTime = ongoingUser?.startTime ? new Date(ongoingUser.startTime) : null;
              const startDateStr = startTime ? startTime.toLocaleDateString() : 'N/A';
              const startTimeStr = startTime ? startTime.toLocaleTimeString() : 'N/A';

              return (
                <tr key={ride.id} className="border-bottom">
                  <td style={stickyStyle(0)} className="py-3 px-3" title={ride.id}>
                    {ride.id}
                  </td>
                  <td
                    style={stickyStyle(150)}
                    className="py-3 px-3"
                    title={ride.pickup?.address || 'N/A'}
                  >
                    {ride.pickup?.address || 'N/A'}
                  </td>
                  <td
                    style={cellStyle}
                    className="py-3 px-3"
                    title={ride.drop?.address || 'N/A'}
                  >
                    {ride.drop?.address || 'N/A'}
                  </td>
                  <td className="py-3 px-3">{ride.distance || 'N/A'}</td>
                  <td className="py-3 px-3">₹{ride.fare || '0'}</td>
                  <td className="py-3 px-3">
                    {ongoingUser?.username || 'Unassigned'}
                  </td>
                  <td className="py-3 px-3">{ride.status || 'pending'}</td>
                  <td className="py-3 px-3">{startDateStr}</td>
                  <td className="py-3 px-3">{startTimeStr}</td>
                  <td className="py-3 px-3">
                    {elapsedTimes[ride.id] || 'N/A'}
                  </td>
                  <td className="py-3 px-3">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => onView?.(ride)}
                    >
                      <i className="bi bi-geo-alt-fill"></i> View
                    </button>
                  </td>
                  <td className="py-3 px-3 text-end">
                    {!isUserView ? (
                      <>
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => onEdit?.(ride)}
                        >
                          <i className="bi bi-pencil-square"></i> Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => onDelete?.(ride.id)}
                        >
                          <i className="bi bi-trash"></i> Delete
                        </button>
                      </>
                    ) : (
                      <>
                        {canAccept && (
                          <button
                            className="btn btn-sm btn-success me-2"
                            onClick={() => onAccept?.(ride)}
                          >
                            <i className="bi bi-check-circle me-1"></i> Accept
                          </button>
                        )}
                        {employeeStatus?.status === 'ongoing' && (
                          <button
                            className="btn btn-sm btn-warning"
                            onClick={() => onComplete(ride)}
                          >
                            <i className="bi bi-flag-fill me-1"></i> Complete
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default RideTable;
