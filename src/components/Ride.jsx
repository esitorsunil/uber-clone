import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to fit map bounds
const FitBounds = ({ pickup, drop }) => {
  const map = useMap();
  if (pickup && drop) {
    map.fitBounds([
      [pickup.lat, pickup.lng],
      [drop.lat, drop.lng],
    ]);
  }
  return null;
};

const Ride = () => {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState(null);
  const [drop, setDrop] = useState(null);
  const [pickupQuery, setPickupQuery] = useState('');
  const [dropQuery, setDropQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);

  const fetchSuggestions = async (query) => {
    if (!query) return;
    try {
      const res = await axios.get('https://api.geoapify.com/v1/geocode/autocomplete', {
        params: {
          text: query,
          filter: 'countrycode:in',
          format: 'json',
          apiKey: '8bcd7116590c479584b6e2d0a68c20c2', // Replace this with your key
        },
      });
      setSuggestions(res.data.results.slice(0, 5));
    } catch (err) {
      console.error('Geoapify error:', err);
    }
  };

  const handleSelectLocation = (place, type) => {
    const coords = {
      lat: place.lat,
      lng: place.lon,
      address: place.formatted,
    };
    if (type === 'pickup') {
      setPickup(coords);
      setPickupQuery(place.formatted);
    } else {
      setDrop(coords);
      setDropQuery(place.formatted);
    }
    setSuggestions([]);
    setActiveField(null);
  };

  const handleSubmit = () => {
    if (pickup && drop) {
      navigate('/driver-accept', {
        state: {
          pickup,
          drop,
          fare: Math.floor(Math.random() * 200) + 100,
        },
      });
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Book a Ride</h2>

      <div className="mb-3">
        <input
          type="text"
          placeholder="Enter Pickup Location"
          value={pickupQuery}
          onFocus={() => setActiveField('pickup')}
          onChange={(e) => {
            setPickupQuery(e.target.value);
            fetchSuggestions(e.target.value);
          }}
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <input
          type="text"
          placeholder="Enter Drop Location"
          value={dropQuery}
          onFocus={() => setActiveField('drop')}
          onChange={(e) => {
            setDropQuery(e.target.value);
            fetchSuggestions(e.target.value);
          }}
          className="form-control"
        />
      </div>

      {suggestions.length > 0 && (
        <ul className="list-group mb-3">
          {suggestions.map((s, idx) => (
            <li
              key={idx}
              className="list-group-item"
              style={{ cursor: 'pointer' }}
              onClick={() =>
                handleSelectLocation(s, activeField === 'pickup' ? 'pickup' : 'drop')
              }
            >
              {s.formatted}
            </li>
          ))}
        </ul>
      )}

      <button
        className="btn btn-primary mb-4"
        disabled={!pickup || !drop}
        onClick={handleSubmit}
      >
        Submit Ride
      </button>

      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        scrollWheelZoom
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {pickup && <Marker position={[pickup.lat, pickup.lng]} />}
        {drop && <Marker position={[drop.lat, drop.lng]} />}
        {pickup && drop && <FitBounds pickup={pickup} drop={drop} />}
      </MapContainer>
    </div>
  );
};

export default Ride;
