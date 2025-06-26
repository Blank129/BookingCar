import { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Clock, X, Loader } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
}

interface LocationInputProps {
  value: Location | null;
  placeholder: string;
  onLocationSelect: (location: Location) => void;
  type: 'pickup' | 'destination';
}

export default function LocationInput({ value, placeholder, onLocationSelect, type }: LocationInputProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentLocations, setRecentLocations] = useState<Location[]>([]);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Fetch search results from OpenStreetMap
  useEffect(() => {
    if (query.trim() === '') {
      setSuggestions(recentLocations);
      setShowSuggestions(false);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=8&countrycodes=vn`,
          {
            headers: {
              'Accept-Language': 'vi',
              'User-Agent': 'your-app-name (your@email.com)' // Cập nhật đúng thông tin!
            },
            signal: controller.signal
          }
        );

        const data = await response.json();

        const locations: Location[] = data.map((item: any, idx: number) => ({
          id: item.place_id || `osm-${idx}`,
          name: item.display_name.split(',')[0],
          address: item.display_name,
          coordinates: [parseFloat(item.lat), parseFloat(item.lon)]
        }));

        setSuggestions(locations);
        setShowSuggestions(true);
      } catch (error) {
        if ((error as any).name !== 'AbortError') {
          console.error('Lỗi khi tìm kiếm địa điểm:', error);
        }
      }
    }, 400); // debounce

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query, recentLocations]);

  // Ẩn suggestions khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocationSelect = (location: Location) => {
    onLocationSelect(location);
    setQuery('');
    setShowSuggestions(false);

    // Lưu vào danh sách gần đây
    setRecentLocations(prev => {
      const updated = [location, ...prev.filter(l => l.id !== location.id)].slice(0, 5);
      return updated;
    });
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Trình duyệt không hỗ trợ định vị.');
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const currentLoc: Location = {
          id: 'current',
          name: 'Vị trí hiện tại',
          address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          coordinates: [latitude, longitude]
        };
        handleLocationSelect(currentLoc);
        setIsGettingLocation(false);
      },
      (error) => {
        console.error('Lỗi định vị:', error);
        let errorMessage = 'Không thể lấy vị trí hiện tại';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Vui lòng cho phép truy cập vị trí';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Không thể xác định vị trí';
            break;
          case error.TIMEOUT:
            errorMessage = 'Hết thời gian chờ định vị';
            break;
        }

        alert(errorMessage);
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const clearInput = () => {
    setQuery('');
    onLocationSelect(null as any);
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <div className="relative">
        <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full ${
          type === 'pickup' ? 'bg-green-500' : 'bg-red-500'
        }`}></div>

        <input
          ref={inputRef}
          type="text"
          value={value ? value.name : query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full pl-8 pr-20 py-3 md:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base md:text-lg"
        />

        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          {(value || query) && (
            <button
              onClick={clearInput}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
          <button
            onClick={getCurrentLocation}
            disabled={isGettingLocation}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
          >
            {isGettingLocation ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {(showSuggestions || query.length > 0) && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
        >
          {query.length === 0 && recentLocations.length > 0 && (
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">Địa điểm gần đây</span>
              </div>
            </div>
          )}

          {suggestions.map((location) => (
            <button
              key={location.id}
              onClick={() => handleLocationSelect(location)}
              className="w-full flex items-center space-x-3 p-3 md:p-4 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-b-0"
            >
              <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate text-sm md:text-base">{location.name}</p>
                <p className="text-xs md:text-sm text-gray-600 truncate">{location.address}</p>
              </div>
            </button>
          ))}

          {suggestions.length === 0 && query.length > 0 && (
            <div className="p-4 text-center text-gray-500">
              <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Không tìm thấy địa điểm phù hợp</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
