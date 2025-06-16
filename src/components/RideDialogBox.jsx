import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const FitBounds = ({ pickup, drop }) => {
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

const RideDialog = ({ onClose, onSave }) => {
  const [pickup, setPickup] = useState(null);
  const [drop, setDrop] = useState(null);
  const [pickupQuery, setPickupQuery] = useState('');
  const [dropQuery, setDropQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const [distance, setDistance] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  const geoapifyKey = '8bcd7116590c479584b6e2d0a68c20c2';
  const orsApiKey = '5b3ce3597851110001cf6248d316723f3f6540ec9d3b4e341a5f563f';

  const fetchSuggestions = async (query) => {
    if (!query) return;
    try {
      const res = await axios.get('https://api.geoapify.com/v1/geocode/autocomplete', {
        params: {
          text: query,
          filter: 'countrycode:in',
          format: 'json',
          apiKey: geoapifyKey,
        },
      });
      setSuggestions(res.data.results.slice(0, 5));
    } catch (err) {
      console.error('Geoapify autocomplete error:', err);
    }
  };

  const handleSelectLocation = (place, type) => {
    const coords = { lat: place.lat, lng: place.lon, address: place.formatted };
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

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await axios.get('https://api.geoapify.com/v1/geocode/reverse', {
            params: {
              lat: latitude,
              lon: longitude,
              format: 'json',
              apiKey: geoapifyKey,
            },
          });
          const place = res.data.results[0];
          handleSelectLocation({
            lat: place.lat,
            lon: place.lon,
            formatted: place.formatted,
          }, 'pickup');
        } catch (err) {
          console.error('Reverse geocoding error:', err);
        }
      });
    }
  };

  useEffect(() => {
    if (!pickup || !drop) return;
    const fetchORSRoute = async () => {
      const url = 'https://api.openrouteservice.org/v2/directions/driving-car/geojson';
      try {
        const res = await axios.post(url, {
          coordinates: [
            [pickup.lng, pickup.lat],
            [drop.lng, drop.lat],
          ],
        }, {
          headers: {
            Authorization: orsApiKey,
            'Content-Type': 'application/json',
          },
        });
        const feature = res.data.features[0];
        setDistance((feature.properties.summary.distance / 1000).toFixed(2));
        const coords = feature.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
        setRouteCoordinates(coords);
      } catch (err) {
        console.error('ORS Routing API error:', err);
      }
    };
    fetchORSRoute();
  }, [pickup, drop]);

  const handleSubmit = () => {
    if (pickup && drop) {
      const rideData = {
        pickup,
        drop,
        distance,
        fare: Math.round(distance * 10),
        routeCoordinates,
      };
      onSave(rideData);
      onClose();
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Assign Ride</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Pickup location"
                  value={pickupQuery}
                  onFocus={() => setActiveField('pickup')}
                  onChange={(e) => {
                    setPickupQuery(e.target.value);
                    fetchSuggestions(e.target.value);
                  }}
                />
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Dropoff location"
                  value={dropQuery}
                  onFocus={() => setActiveField('drop')}
                  onChange={(e) => {
                    setDropQuery(e.target.value);
                    fetchSuggestions(e.target.value);
                  }}
                />
                {suggestions.length > 0 && (
                  <ul className="list-group">
                    {activeField === 'pickup' && (
                      <li className="list-group-item text-primary" onClick={handleUseCurrentLocation} style={{ cursor: 'pointer' }}>
                        📍 Use current location
                      </li>
                    )}
                    {suggestions.map((s, idx) => (
                      <li
                        key={idx}
                        className="list-group-item"
                        onClick={() => handleSelectLocation(s, activeField)}
                        style={{ cursor: 'pointer' }}
                      >
                        {s.formatted}
                      </li>
                    ))}
                  </ul>
                )}
                {distance && (
                  <div className="text-muted mt-2">
                    🚗 Distance: <strong>{distance} km</strong><br />
                    💵 Fare: <strong>₹{Math.round(distance * 10)}</strong>
                  </div>
                )}
              </div>
              <div className="col-md-6">
                <MapContainer
                  center={[17.385044, 78.486671]}
                  zoom={13}
                  scrollWheelZoom
                  style={{ height: '300px', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  />
                  {pickup && <Marker position={[pickup.lat, pickup.lng]} />}
                  {drop && <Marker position={[drop.lat, drop.lng]} />}
                  {pickup && drop && <FitBounds pickup={pickup} drop={drop} />}
                  {routeCoordinates.length > 0 && (
                    <Polyline positions={routeCoordinates} color="blue" />
                  )}
                </MapContainer>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={!pickup || !drop}>Assign Ride</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideDialog;