import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icon URLs
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

const Ride = () => {
  const navigate = useNavigate();
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
          handleSelectLocation(
            {
              lat: place.lat,
              lon: place.lon,
              formatted: place.formatted,
            },
            'pickup'
          );
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
        const res = await axios.post(
          url,
          {
            coordinates: [
              [pickup.lng, pickup.lat],
              [drop.lng, drop.lat],
            ],
          },
          {
            headers: {
              Authorization: orsApiKey,
              'Content-Type': 'application/json',
            },
          }
        );

        const feature = res.data.features[0];
        const distanceInKm = feature.properties.summary.distance / 1000;
        setDistance(distanceInKm.toFixed(2));

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
      navigate('/driver-accept', {
        state: {
          pickup,
          drop,
          fare: Math.round(distance * 10),
          distance,
          routeCoordinates,
        },
      });
    }
  };

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Get a Ride</h5>

              <div className="mb-3 position-relative">
                <i className="bi bi-crosshair2 input-icon"></i>
                <input
                  type="text"
                  placeholder="Pickup location"
                  value={pickupQuery}
                  onFocus={() => setActiveField('pickup')}
                  onChange={(e) => {
                    setPickupQuery(e.target.value);
                    fetchSuggestions(e.target.value);
                  }}
                  className="form-control ps-5 input-hover-border"
                />
              </div>

              <div className="mb-3 position-relative">
                <i className="bi bi-geo-alt-fill input-icon"></i>
                <input
                  type="text"
                  placeholder="Dropoff location"
                  value={dropQuery}
                  onFocus={() => setActiveField('drop')}
                  onChange={(e) => {
                    setDropQuery(e.target.value);
                    fetchSuggestions(e.target.value);
                  }}
                  className="form-control ps-5 input-hover-border"
                />
              </div>

              {suggestions.length > 0 && (
                <ul className="list-group mb-3 shadow-sm rounded overflow-hidden border">
                  {activeField === 'pickup' && (
                    <li
                      className="list-group-item text-primary"
                      style={{ cursor: 'pointer' }}
                      onClick={handleUseCurrentLocation}
                    >
                      📍 Use current location
                    </li>
                  )}
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
                className="btn btn-secondary w-100"
                disabled={!pickup || !drop}
                onClick={handleSubmit}
              >
                Book Ride
              </button>

              {distance && (
                <div className="text-muted text-center mt-2">
                  🚗 Distance: <strong>{distance} km</strong><br />
                  💵 Estimated Fare: <strong>₹{Math.round(distance * 10)}</strong>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <MapContainer
            center={[17.385044, 78.486671]}
            zoom={13}
            scrollWheelZoom
            style={{ height: '850px', width: '100%' }}
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
  );
};

export default Ride;
