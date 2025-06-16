// RideMapView.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const RideMapView = ({ ride }) => {
  const { pickup, drop, distance, fare, routeCoordinates = [] } = ride;

  const bounds = pickup && drop ? [
    [pickup.lat, pickup.lng],
    [drop.lat, drop.lng],
  ] : null;

  return (
    <div>
      <div className="mb-3">
        <strong>Pickup:</strong> {pickup?.address} <br />
        <strong>Drop:</strong> {drop?.address} <br />
        <strong>Distance:</strong> {distance} km <br />
        <strong>Fare:</strong> ₹{fare}
      </div>

      <MapContainer
        bounds={bounds}
        scrollWheelZoom
        style={{ height: '300px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {pickup && <Marker position={[pickup.lat, pickup.lng]} />}
        {drop && <Marker position={[drop.lat, drop.lng]} />}
        {routeCoordinates?.length > 0 && (
          <Polyline positions={routeCoordinates} color="blue" />
        )}
      </MapContainer>
    </div>
  );
};

export default RideMapView;
