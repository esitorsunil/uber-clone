import React from 'react';

const PastTravels = () => {
  const rides = JSON.parse(localStorage.getItem('pastTravels') || '[]');

  return (
    <div className="container py-4">
      <h3 className="mb-4 text-center">🧾 Past Travels</h3>

      {rides.length === 0 ? (
        <p>No past rides found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Pickup</th>
                <th>Drop</th>
                <th>Fare (₹)</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Duration (min)</th>
              </tr>
            </thead>
            <tbody>
              {rides.map((ride, index) => {
                const duration =
                  (new Date(ride.endedAt) - new Date(ride.startedAt)) / 60000;
                return (
                  <tr key={index}>
                    <td>{ride.pickup.address}</td>
                    <td>{ride.drop.address}</td>
                    <td>{ride.fare}</td>
                    <td>{new Date(ride.startedAt).toLocaleTimeString()}</td>
                    <td>{new Date(ride.endedAt).toLocaleTimeString()}</td>
                    <td>{duration.toFixed(1)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PastTravels;
