import React, { useState } from 'react';
import { MapPin, Navigation, Clock } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
}

interface LocationPickerProps {
  onLocationSelect: (pickup: Location, destination: Location) => void;
}

const popularLocations: Location[] = [
  { id: '1', name: 'Sân bay Tân Sơn Nhất', address: 'Tân Bình, TP.HCM', coordinates: [10.8181, 106.6517] },
  { id: '2', name: 'Chợ Bến Thành', address: 'Quận 1, TP.HCM', coordinates: [10.7720, 106.6980] },
  { id: '3', name: 'Landmark 81', address: 'Bình Thạnh, TP.HCM', coordinates: [10.7953, 106.7212] },
  { id: '4', name: 'Nhà hát Thành phố', address: 'Quận 1, TP.HCM', coordinates: [10.7769, 106.7009] },
  { id: '5', name: 'Công viên Tao Đàn', address: 'Quận 1, TP.HCM', coordinates: [10.7756, 106.6917] },
  { id: '6', name: 'Bệnh viện Chợ Rẫy', address: 'Quận 5, TP.HCM', coordinates: [10.7546, 106.6677] },
];

export default function LocationPicker({ onLocationSelect }: LocationPickerProps) {
  const [pickup, setPickup] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [currentInput, setCurrentInput] = useState<'pickup' | 'destination'>('pickup');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLocations = popularLocations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLocationSelect = (location: Location) => {
    if (currentInput === 'pickup') {
      setPickup(location);
      setCurrentInput('destination');
    } else {
      setDestination(location);
    }
    setSearchQuery('');
  };

  const handleConfirm = () => {
    if (pickup && destination) {
      onLocationSelect(pickup, destination);
    }
  };

  const getCurrentLocation = () => {
    const currentLoc: Location = {
      id: 'current',
      name: 'Vị trí hiện tại',
      address: 'Đang xác định...',
      coordinates: [10.7769, 106.7009]
    };
    handleLocationSelect(currentLoc);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Chọn địa điểm</h2>
        <button
          onClick={getCurrentLocation}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
        >
          <Navigation className="w-4 h-4" />
          <span className="text-sm">Vị trí hiện tại</span>
        </button>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border-2 border-green-200">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-green-700 font-medium">Điểm đón</p>
              <p className="text-gray-900">{pickup?.name || 'Chọn điểm đón'}</p>
              {pickup && <p className="text-sm text-gray-600">{pickup.address}</p>}
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border-2 border-red-200">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-red-700 font-medium">Điểm đến</p>
              <p className="text-gray-900">{destination?.name || 'Chọn điểm đến'}</p>
              {destination && <p className="text-sm text-gray-600">{destination.address}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentInput('pickup')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentInput === 'pickup'
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Chọn điểm đón
          </button>
          <button
            onClick={() => setCurrentInput('destination')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentInput === 'destination'
                ? 'bg-red-100 text-red-700 border border-red-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Chọn điểm đến
          </button>
        </div>

        <input
          type="text"
          placeholder="Tìm kiếm địa điểm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {filteredLocations.map((location) => (
          <button
            key={location.id}
            onClick={() => handleLocationSelect(location)}
            className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
          >
            <MapPin className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <p className="font-medium text-gray-900">{location.name}</p>
              <p className="text-sm text-gray-600">{location.address}</p>
            </div>
          </button>
        ))}
      </div>

      {pickup && destination && (
        <button
          onClick={handleConfirm}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Xác nhận địa điểm
        </button>
      )}
    </div>
  );
}