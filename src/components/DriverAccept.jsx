import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// 🚴 Custom bike icon
const bikeIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1147/1147935.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const DriverAccept = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { pickup, drop, fare } = state || {};

  const handleConfirmRide = () => {
    navigate('/tracking', {
      state: { pickup, drop },
    });
  };

  if (!pickup || !drop) {
    return <div className="p-5 text-danger">❌ Invalid Ride Request</div>;
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center text-primary">New Ride Request</h2>

      <div className="row">
        {/* Ride Details Card */}
        <div className="col-md-5 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title mb-4">📍 Ride Details</h5>

              <p className="mb-3">
                <i className="bi bi-geo-alt-fill text-success me-2"></i>
                <strong>Pickup:</strong>
                <br />
                <span className="text-muted">{pickup.address}</span>
              </p>

              <p className="mb-3">
                <i className="bi bi-flag-fill text-danger me-2"></i>
                <strong>Drop:</strong>
                <br />
                <span className="text-muted">{drop.address}</span>
              </p>

              <p className="mb-3">
                <i className="bi bi-cash-coin text-warning me-2"></i>
                <strong>Fare:</strong> ₹{fare}
              </p>

              <button className="btn btn-success w-100 mt-3" onClick={handleConfirmRide}>
                <i className="bi bi-check-circle-fill me-2"></i>
                Confirm Ride
              </button>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="col-md-7">
          <div className="rounded shadow-sm overflow-hidden" style={{ height: '400px' }}>
            <MapContainer
              center={[pickup.lat, pickup.lng]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[pickup.lat, pickup.lng]} icon={bikeIcon} />
              <Marker position={[drop.lat, drop.lng]} />
              <Polyline positions={[[pickup.lat, pickup.lng], [drop.lat, drop.lng]]} color="blue" />
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverAccept;
