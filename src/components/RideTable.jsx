import { useEffect, useState } from 'react';
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
    <>
      <div className="scroll-container" style={{ overflowX: 'auto' }}>
        <table className="table align-middle table-hover mt-3" style={{ minWidth: '2000px' }}>
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
              <th className="py-3 px-3">End Date</th>
              <th className="py-3 px-3">End Time</th>
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

                const userData = isUserView
                  ? ride.assignedUsers?.find((u) => u.username === currentUser?.username)
                  : ride.assignedUsers?.find((u) => u.status === 'ongoing' || u.status === 'completed');

                const startTime = userData?.startTime ? new Date(userData.startTime) : null;
                const endTime = userData?.endTime ? new Date(userData.endTime) : null;

                const startDateStr = startTime ? startTime.toLocaleDateString() : 'None';
                const startTimeStr = startTime ? startTime.toLocaleTimeString() : 'None';
                const endDateStr = endTime ? endTime.toLocaleDateString() : 'None';
                const endTimeStr = endTime ? endTime.toLocaleTimeString() : 'None';

                const timer =
                  ride.status === 'completed' && startTime && endTime
                    ? `${Math.floor((endTime - startTime) / 60000)} mins`
                    : elapsedTimes[ride.id] || 'None';

                const assignedTo = userData?.username || 'Unassigned';

                return (
                  <tr key={ride.id} className="border-bottom">
                    <td style={stickyStyle(0)} className="py-3 px-3" title={ride.id}>
                      {ride.id}
                    </td>
                    <td
                      style={stickyStyle(150)}
                      className="py-3 px-3"
                      title={ride.pickup?.address || 'None'}
                    >
                      {ride.pickup?.address || 'None'}
                    </td>
                    <td
                      style={cellStyle}
                      className="py-3 px-3"
                      title={ride.drop?.address || 'None'}
                    >
                      {ride.drop?.address || 'None'}
                    </td>
                    <td className="py-3 px-3">{ride.distance || 'None'}</td>
                    <td className="py-3 px-3">₹{ride.fare || '0'}</td>
                    <td className="py-3 px-3">{assignedTo}</td>
                    <td className="py-3 px-3">{ride.status || 'pending'}</td>
                    <td className="py-3 px-3">{startDateStr}</td>
                    <td className="py-3 px-3">{startTimeStr}</td>
                    <td className="py-3 px-3">{endDateStr}</td>
                    <td className="py-3 px-3">{endTimeStr}</td>
                    <td className="py-3 px-3">{timer}</td>
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

      {/* Timesheet Table */}
      {!isUserView && (
        <div className="mt-5">
          <h5 className="mb-3">🧾 Timesheet (Completed Rides)</h5>
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>Ride ID</th>
                  <th>Employee</th>
                  <th>Distance (km)</th>
                  <th>Fare</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {rides
                  .filter((ride) => ride.status === 'completed')
                  .flatMap((ride) =>
                    ride.assignedUsers
                      ?.filter((u) => u.status === 'completed')
                      .map((u) => {
                        const start = u.startTime ? new Date(u.startTime) : null;
                        const end = u.endTime ? new Date(u.endTime) : null;
                        const duration = start && end ? Math.floor((end - start) / 60000) : 'N/A';

                        return (
                          <tr key={`${ride.id}-${u.username}`}>
                            <td>{ride.id}</td>
                            <td>{u.username}</td>
                            <td>{ride.distance || 'N/A'}</td>
                            <td>₹{ride.fare || '0'}</td>
                            <td>{start ? start.toLocaleString() : 'N/A'}</td>
                            <td>{end ? end.toLocaleString() : 'N/A'}</td>
                            <td>{duration} mins</td>
                          </tr>
                        );
                      }) || []
                  )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default RideTable;
