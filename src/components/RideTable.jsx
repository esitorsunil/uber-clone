import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { completeRideByUser } from '../utils/redux/rideSlice';
import RideFilterControls from './RideFilterControl'; 

const RideTable = ({
  rides,
  currentUser,
  isUserView = false,
  onAccept,
  onEdit,
  onDelete,
  onView,
}) => {
  const dispatch = useDispatch();
  const [elapsedTimes, setElapsedTimes] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const ridesPerPage = 4;

  const { status: statusFilter, users: userFilter } = useSelector(
    (state) => state.rideFilter
  );

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

  const onComplete = (ride) => {
  const watchId = localStorage.getItem('watchId');
  if (watchId) {
    navigator.geolocation.clearWatch(Number(watchId));
    localStorage.removeItem('watchId');
  }

  dispatch(
    completeRideByUser({
      rideId: ride.id,
      username: currentUser.username,
    })
  );
};

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

  const filteredRides = rides.filter((ride) => {
    if (!isUserView) {
      const matchesStatus = statusFilter === 'all' || ride.status === statusFilter;
      const matchesUser =
        userFilter.length === 0 ||
        ride.assignedUsers?.some((u) => userFilter.includes(u.username));
      return matchesStatus && matchesUser;
    }

    const currentUserRide = ride.assignedUsers?.find(
      (u) => u.username === currentUser?.username
    );

    if (currentUserRide) return currentUserRide.status !== 'completed';

    const someoneAccepted = ride.assignedUsers?.some(
      (u) => u.status === 'ongoing' || u.status === 'completed'
    );
    return !someoneAccepted;
  });

  const indexOfLastRide = currentPage * ridesPerPage;
  const indexOfFirstRide = indexOfLastRide - ridesPerPage;
  const currentRides = filteredRides.slice(indexOfFirstRide, indexOfLastRide);
  const totalPages = Math.ceil(filteredRides.length / ridesPerPage);

  return (
    <>
      {!isUserView && (
        <div className="d-flex justify-content-end align-items-center mb-3">
          <RideFilterControls rides={rides} />
        </div>
      )}

      {filteredRides.length === 0 ? (
        <div className="alert alert-info text-center mt-4">
          <i className="bi bi-info-circle me-2"></i>
          No rides match the current filters.
        </div>
      ) : (
        <>
          <div className="scroll-container" style={{ overflowX: 'auto' }}>
            <table className="table align-middle table-hover mt-3" style={{ minWidth: '2000px' }}>
              <thead className="bg-light" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                <tr className="align-middle border-bottom text-secondary">
                  <th style={{ ...stickyStyle(0), width: '150px' }} className="py-3 px-3">Ride ID</th>
                  <th className="py-3 px-3">Pickup</th>
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
                {currentRides.map((ride) => {
                  const employeeStatus = ride.assignedUsers?.find(
                    (u) => u.username === currentUser?.username
                  );
                  const canAccept = !employeeStatus || employeeStatus.status === 'pending';

                  const userData = isUserView
                    ? ride.assignedUsers?.find((u) => u.username === currentUser?.username)
                    : ride.assignedUsers?.find((u) => u.status === 'ongoing' || u.status === 'completed');

                  const startTime = userData?.startTime ? new Date(userData.startTime) : null;
                  const endTime = userData?.endTime ? new Date(userData.endTime) : null;

                  const startDateStr = startTime ? startTime.toLocaleDateString() : '—';
                  const startTimeStr = startTime ? startTime.toLocaleTimeString() : '—';
                  const endDateStr = endTime ? endTime.toLocaleDateString() : '—';
                  const endTimeStr = endTime ? endTime.toLocaleTimeString() : '—';

                  const timer =
                    ride.status === 'completed' && startTime && endTime
                      ? (() => {
                          const diff = endTime - startTime;
                          const hours = Math.floor(diff / (1000 * 60 * 60));
                          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                          return `${hours}h ${minutes}m ${seconds}s`;
                        })()
                      : elapsedTimes[ride.id] || '—';

                  const assignedTo = userData?.username || 'Unassigned';

                  return (
                    <tr key={ride.id} className="border-bottom">
                      <td style={stickyStyle(0)} className="py-3 px-3" title={ride.id}>{ride.id}</td>
                      <td style={cellStyle} className="py-3 px-3" title={ride.pickup?.address || ''}>
                        {ride.pickup?.address || '—'}
                      </td>
                      <td style={cellStyle} className="py-3 px-3" title={ride.drop?.address || ''}>
                        {ride.drop?.address || '—'}
                      </td>
                      <td className="py-3 px-3 text-nowrap">{ride.distance || '—'}</td>
                      <td className="py-3 px-3 text-nowrap">₹{ride.fare || '0'}</td>
                      <td className="py-3 px-3">{assignedTo}</td>
                      <td className="py-3 px-3">
                        <span className={`badge text-capitalize ${
                          ride.status === 'pending' ? 'bg-secondary' :
                          ride.status === 'ongoing' ? 'bg-warning text-dark' :
                          'bg-success'
                        }`}>
                          {ride.status}
                        </span>
                      </td>
                      <td className="py-3 px-3">{startDateStr}</td>
                      <td className="py-3 px-3">{startTimeStr}</td>
                      <td className="py-3 px-3">{endDateStr}</td>
                      <td className="py-3 px-3">{endTimeStr}</td>
                      <td className="py-3 px-3">{timer}</td>
                      <td className="py-3 px-3">
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => onView?.(ride)}
                          aria-label="View ride on map"
                        >
                           View
                        </button>
                      </td>
                      <td className="py-3 px-3 text-end d-flex justify-content-end gap-2">
                        {!isUserView ? (
                          <>
                            <button className="btn btn-sm btn-outline-primary" onClick={() => onEdit?.(ride)}>
                             Edit
                            </button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete?.(ride.id)}>
                               Delete
                            </button>
                          </>
                        ) : (
                          <>
                            {canAccept && (
                              <button className="btn btn-sm btn-success" onClick={() => onAccept?.(ride)}>
                                <i className="bi bi-check-circle me-1"></i> Accept
                              </button>
                            )}
                            {employeeStatus?.status === 'ongoing' && (
                              <button className="btn btn-sm btn-warning" onClick={() => onComplete(ride)}>
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

          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-3">
              <nav aria-label="Ride pagination">
                <ul className="pagination pagination-sm mb-0">
                  <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
                    <button className="page-link" aria-label="Previous page" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}>
                      &laquo;
                    </button>
                  </li>
                  {[...Array(totalPages)].map((_, idx) => (
                    <li key={idx} className={`page-item ${currentPage === idx + 1 ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(idx + 1)}>
                        {idx + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages && 'disabled'}`}>
                    <button className="page-link" aria-label="Next page" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}>
                      &raquo;
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default RideTable;
