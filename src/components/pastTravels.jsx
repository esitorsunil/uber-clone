import React from 'react';

const PastTravels = () => {
  const rides = JSON.parse(localStorage.getItem('pastTravels') || '[]');

  return (
    <div className="container py-4" style={{ maxWidth: '800px' }}>
      <h3 className="mb-4 text-center">🧾 Past Trips</h3>

      {rides.length === 0 ? (
        <p className="text-center text-muted">No past rides found.</p>
      ) : (
        <div className="d-flex flex-column gap-3">
          {rides.map((ride, index) => {
            const duration =
              (new Date(ride.endedAt) - new Date(ride.startedAt)) / 60000;
            const rideDate = new Date(ride.startedAt).toLocaleDateString();
            const rideTime = new Date(ride.startedAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={index}
                className="border rounded shadow-sm p-3 d-flex justify-content-between align-items-center"
              >
                <div>
                  <div className="text-muted small">{rideDate} • {rideTime}</div>

                  <div className="mt-2">
                    <div className="d-flex align-items-start mb-1">
                      <i className="bi bi-circle-fill text-success me-2 mt-1" />
                      <div>{ride.pickup.address}</div>
                    </div>

                    <div className="d-flex align-items-start">
                      <i className="bi bi-square-fill text-danger me-2 mt-1" />
                      <div>{ride.drop.address}</div>
                    </div>
                  </div>

                  <div className="text-muted small mt-2">
                    Duration: {duration.toFixed(1)} min
                  </div>
                </div>

                <div className="text-end">
                  <div className="fs-5 fw-bold">₹{ride.fare}</div>
                  <div className="text-muted small">Fare</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PastTravels;
