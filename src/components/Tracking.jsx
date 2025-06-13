import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const bikeIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/8830/8830649.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const Tracking = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { pickup, drop } = state || {};
  const [position, setPosition] = useState(pickup);

  useEffect(() => {
    if (!pickup || !drop) return;

    const steps = 100;
    const interval = 100; // ms
    const latStep = (drop.lat - pickup.lat) / steps;
    const lngStep = (drop.lng - pickup.lng) / steps;

    let currentStep = 0;
    const startedAt = new Date().toISOString();

    const intervalId = setInterval(() => {
      if (currentStep >= steps) {
        clearInterval(intervalId);
        const endedAt = new Date().toISOString();

        // Save to past travels
        const past = JSON.parse(localStorage.getItem('pastTravels') || '[]');
        past.push({
          pickup,
          drop,
          fare: Math.floor(Math.random() * 200) + 100,
          startedAt,
          endedAt,
          status: 'completed',
        });
        localStorage.setItem('pastTravels', JSON.stringify(past));

        navigate('/past-travels');
        return;
      }

      setPosition(prev => ({
        lat: prev.lat + latStep,
        lng: prev.lng + lngStep,
      }));

      currentStep++;
    }, interval);
  }, [pickup, drop, navigate]);

  if (!pickup || !drop) return <div className="p-4 text-danger">❌ Invalid ride</div>;

  return (
    <div className="container py-4">
      <h3 className="text-center text-info">🛵 Ride in Progress...</h3>
      <MapContainer center={[pickup.lat, pickup.lng]} zoom={13} style={{ height: '400px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[pickup.lat, pickup.lng]} />
        <Marker position={[drop.lat, drop.lng]} />
        <Polyline positions={[[pickup.lat, pickup.lng], [drop.lat, drop.lng]]} color="blue" />
        <Marker position={[position.lat, position.lng]} icon={bikeIcon} />
      </MapContainer>
    </div>
  );
};

export default Tracking;
