import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const bikeIcon = new L.Icon({
  iconUrl: 'https://img.icons8.com/ios/50/marker--v1.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const icon = new L.DivIcon({
  html: '<i class="bi bi-geo-alt-fill text-dark fs-3"></i>',
  iconSize: [30, 42],
  className: 'd-flex justify-content-center align-items-center',
});

const FitMapBounds = ({ pickup, drop }) => {
  const map = useMap();
  useEffect(() => {
    if (pickup && drop) {
      map.fitBounds([
        [pickup.lat, pickup.lng],
        [drop.lat, drop.lng],
      ]);
    }
  }, [pickup, drop, map]);

  return null;
};

const Tracking = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { pickup, drop, routeCoordinates, fare } = state || {};

  const [currentIndex, setCurrentIndex] = useState(0);
  const hasSavedRide = useRef(false); // ✅ Add this at the top inside Tracking component


useEffect(() => {
  if (!pickup || !drop || !routeCoordinates?.length || hasSavedRide.current) return;

  const startedAt = new Date().toISOString();

  const interval = setInterval(() => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;

      if (nextIndex >= routeCoordinates.length) {
        clearInterval(interval);

        if (!hasSavedRide.current) {
          const endedAt = new Date().toISOString();
          const past = JSON.parse(localStorage.getItem('pastTravels') || '[]');

          past.push({
            pickup,
            drop,
            fare,
            startedAt,
            endedAt,
            status: 'completed',
          });

          localStorage.setItem('pastTravels', JSON.stringify(past));
          hasSavedRide.current = true; // ✅ mark as saved
          navigate('/past-travels');
        }

        return prevIndex;
      }

      return nextIndex;
    });
  }, 100);

  return () => clearInterval(interval);
}, [pickup, drop, routeCoordinates, navigate, fare]);


  if (!pickup || !drop || !routeCoordinates?.length) {
    return <div className="p-4 text-danger">❌ Invalid tracking data</div>;
  }

  const currentPosition = routeCoordinates[currentIndex] || routeCoordinates[0];

  return (
    <div className="container py-4">
      <h3 className="text-center text-primary">🛵 Ride in Progress</h3>
      <MapContainer
        center={[pickup.lat, pickup.lng]}
        zoom={13}
        style={{ height: '400px', width: '100%' }}
        className="rounded shadow-sm border"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[pickup.lat, pickup.lng]} icon={icon} />
        <Marker position={[drop.lat, drop.lng]} icon={icon} />
        <Polyline positions={routeCoordinates} color="blue" />
        <Marker position={currentPosition} icon={bikeIcon} />
        <FitMapBounds pickup={pickup} drop={drop} />
      </MapContainer>
    </div>
  );
};

export default Tracking;
