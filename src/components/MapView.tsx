import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const pickupIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.596 19.404 0 12.5 0z" fill="#10B981"/>
      <circle cx="12.5" cy="12.5" r="6" fill="white"/>
    </svg>
  `),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const destinationIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.596 19.404 0 12.5 0z" fill="#EF4444"/>
      <circle cx="12.5" cy="12.5" r="6" fill="white"/>
    </svg>
  `),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface Location {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
}

interface MapViewProps {
  pickup: Location | null;
  destination: Location | null;
  className?: string;
}

export default function MapView({ pickup, destination, className = '' }: MapViewProps) {
  const mapRef = useRef<L.Map>(null);

  // Default center (Ho Chi Minh City)
  const defaultCenter: [number, number] = [10.7769, 106.7009];
  const defaultZoom = 13;

  useEffect(() => {
    if (mapRef.current && pickup && destination) {
      const bounds = L.latLngBounds([pickup.coordinates, destination.coordinates]);
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    } else if (mapRef.current && (pickup || destination)) {
      const location = pickup || destination;
      if (location) {
        mapRef.current.setView(location.coordinates, 15);
      }
    }
  }, [pickup, destination]);

  const routeCoordinates: [number, number][] = pickup && destination 
    ? [pickup.coordinates, destination.coordinates]
    : [];

  return (
    <div className={`relative ${className}`}>
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        className="w-full h-full rounded-lg"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {pickup && (
          <Marker position={pickup.coordinates} icon={pickupIcon}>
            <Popup>
              <div className="text-center">
                <p className="font-semibold text-green-700">Điểm đón</p>
                <p className="text-sm">{pickup.name}</p>
                <p className="text-xs text-gray-600">{pickup.address}</p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {destination && (
          <Marker position={destination.coordinates} icon={destinationIcon}>
            <Popup>
              <div className="text-center">
                <p className="font-semibold text-red-700">Điểm đến</p>
                <p className="text-sm">{destination.name}</p>
                <p className="text-xs text-gray-600">{destination.address}</p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {routeCoordinates.length === 2 && (
          <Polyline
            positions={routeCoordinates}
            color="#3B82F6"
            weight={4}
            opacity={0.8}
            dashArray="10, 10"
          />
        )}
      </MapContainer>
    </div>
  );
}