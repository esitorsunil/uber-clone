import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const icon = new L.DivIcon({
  html: '<i class="bi bi-geo-alt-fill text-dark fs-3"></i>',
  iconSize: [30, 42],
  className: 'd-flex justify-content-center align-items-center',
});

const FitMapBounds = ({ pickup, drop }) => {
  const map = useMap();
  if (pickup && drop) {
    map.fitBounds([
      [pickup.lat, pickup.lng],
      [drop.lat, drop.lng],
    ]);
  }
  return null;
};

const DriverAccept = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { pickup, drop, distance, routeCoordinates, fare } = state || {};

  // ✅ Generate fare only once


  const handleConfirmRide = () => {
    navigate('/tracking', {
      state: { pickup, drop, fare, routeCoordinates, },
    });
  };

  if (!pickup || !drop) {
    return <div className="p-5 text-danger">❌ Invalid Ride Request</div>;
  }

  return (
    <div className="d-flex justify-content-center align-items-center bg-light" style={{ minHeight: '100vh' }}>
      <div className="card shadow-lg p-4" style={{ maxWidth: '750px', width: '100%' }}>
        <div className="rounded mb-4 overflow-hidden border" style={{ height: '250px' }}>
          <MapContainer center={[pickup.lat, pickup.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[pickup.lat, pickup.lng]} icon={icon} />
            <Marker position={[drop.lat, drop.lng]} icon={icon} />
            {routeCoordinates?.length > 0 && <Polyline positions={routeCoordinates} color="blue" />}
            <FitMapBounds pickup={pickup} drop={drop} />
          </MapContainer>
        </div>

        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 className="mb-1 fw-semibold">
                <i className="bi bi-person-fill me-2" /> Uber Moto
              </h5>
              <small className="text-muted">Confirm ride details</small>
            </div>
            <div className="text-end">
              <h4 className="fw-bold text-success mb-1">₹{fare}</h4>
              <small className="text-muted">{distance} km</small>
            </div>
          </div>

          <div className="mb-3">
            <div className="d-flex align-items-start mb-3">
              <i className="bi bi-geo-alt-fill me-2"></i>
              <div>
                <small className="text-muted">Pickup</small>
                <div className="fw-medium">{pickup.address}</div>
              </div>
            </div>
            <div className="d-flex align-items-start">
              <i className="bi bi-geo-alt-fill me-2"></i>
              <div>
                <small className="text-muted">Drop</small>
                <div className="fw-medium">{drop.address}</div>
              </div>
            </div>
          </div>

          <button className="btn btn-secondary w-100 rounded-pill py-2" onClick={handleConfirmRide}>
            Confirm Ride
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverAccept;
