import React, { useEffect, useState } from 'react';
import LocationPicker from '../../components/common/LocationPicker';
import api from '../../services/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapSearch = () => {
  const [position, setPosition] = useState(null);
  const [institutes, setInstitutes] = useState([]);
  const [radius, setRadius] = useState(5);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((p) => {
        setPosition([p.coords.latitude, p.coords.longitude]);
        fetchNearby(p.coords.longitude, p.coords.latitude, radius);
      }, () => {
        setPosition([6.9, 79.86]);
      });
    }
  }, []);

  const fetchNearby = async (lng, lat, r) => {
    try {
      const res = await api.get('/institutes/nearby', { params: { lng, lat, radius: r } });
      setInstitutes(res.data.institutes || []);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 p-6 sm:p-10">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white p-4 rounded-2xl border shadow-sm flex items-center gap-4">
          <h3 className="font-black">Find Nearby Institutes</h3>
          <div className="ml-auto flex items-center gap-2">
            <input type="number" value={radius} onChange={(e)=>setRadius(e.target.value)} className="w-20 p-2 border rounded-xl" />
            <button onClick={()=>{ if(position) fetchNearby(position[1], position[0], radius); }} className="px-3 py-2 bg-[#1c0da1] text-white rounded-xl">Search</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl p-4 border shadow-sm">
            <div className="h-96 rounded-xl overflow-hidden">
              <MapContainer center={position || [6.9,79.86]} zoom={12} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {position && (
                  <Marker position={position}>
                    <Popup>Your location</Popup>
                  </Marker>
                )}
                {institutes.map((ins) => (
                  ins.locations?.map((loc, i) => (
                    <Marker key={`${ins._id}-${i}`} position={[loc.coordinates.coordinates[1], loc.coordinates.coordinates[0]]}>
                      <Popup>
                        <div className="w-48">
                          <p className="font-bold">{ins.name}</p>
                          <p className="text-xs text-slate-500">{loc.city} · {loc.address}</p>
                        </div>
                      </Popup>
                    </Marker>
                  ))
                ))}
              </MapContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border shadow-sm">
            <h4 className="font-black mb-2">Results</h4>
            <div className="space-y-3">
              {institutes.map(ins => (
                <div key={ins._id} className="p-2 border rounded-xl">
                  <p className="font-bold">{ins.name}</p>
                  <p className="text-xs text-slate-500">{ins.contact?.phone} · {ins.contact?.email}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapSearch;