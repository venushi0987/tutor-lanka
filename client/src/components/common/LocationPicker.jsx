import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix marker icon paths for bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return position === null ? null : (
    <Marker position={[position[0], position[1]]}>
      <Popup>Selected location</Popup>
    </Marker>
  );
};

const LocationPicker = ({ initial = [6.9, 79.86], onChange }) => {
  const [pos, setPos] = useState(initial);

  useEffect(() => {
    if (onChange) onChange([pos[1], pos[0]]); // send [lng, lat]
  }, [pos]);

  return (
    <div className="w-full h-72 rounded-xl overflow-hidden border border-slate-100">
      <MapContainer center={initial} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <LocationMarker position={pos} setPosition={setPos} />
      </MapContainer>
    </div>
  );
};

export default LocationPicker;