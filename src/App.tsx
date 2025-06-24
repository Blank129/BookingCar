import React, { useState } from 'react';
import { Car, Menu, User, ArrowLeft } from 'lucide-react';
import LocationInput from './components/LocationInput';
import VehicleSelector, { vehicleTypes, Vehicle } from './components/VehicleSelector';
import MapView from './components/MapView';
import BookingConfirmation from './components/BookingConfirmation';

interface Location {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
}

type AppState = 'location' | 'vehicle' | 'booking';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('location');
  const [pickup, setPickup] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [distance, setDistance] = useState(0);
  const [showMobileMap, setShowMobileMap] = useState(false);

  // Calculate distance between two coordinates (simplified)
  const calculateDistance = (coord1: [number, number], coord2: [number, number]) => {
    const [lat1, lon1] = coord1;
    const [lat2, lon2] = coord2;
    
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return Math.max(distance, 1); // Minimum 1km for pricing
  };

  const handlePickupSelect = (location: Location) => {
    setPickup(location);
    if (destination) {
      const dist = calculateDistance(location.coordinates, destination.coordinates);
      setDistance(dist);
    }
  };

  const handleDestinationSelect = (location: Location) => {
    setDestination(location);
    if (pickup) {
      const dist = calculateDistance(pickup.coordinates, location.coordinates);
      setDistance(dist);
    }
  };

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleBookRide = () => {
    if (pickup && destination && selectedVehicle) {
      setCurrentState('booking');
    }
  };

  const handleCancelBooking = () => {
    setCurrentState('location');
    setPickup(null);
    setDestination(null);
    setSelectedVehicle(null);
    setDistance(0);
  };

  const handleBackToVehicleSelection = () => {
    setCurrentState('vehicle');
  };

  const canProceedToVehicleSelection = pickup && destination && distance > 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Map Toggle */}
      <div className="md:hidden">
        {showMobileMap ? (
          <div className="fixed inset-0 z-50 bg-white">
            <div className="flex items-center justify-between p-4 bg-white border-b">
              <button
                onClick={() => setShowMobileMap(false)}
                className="flex items-center space-x-2 text-blue-600"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Quay lại</span>
              </button>
              <h2 className="font-semibold text-gray-900">Bản đồ</h2>
              <div className="w-16"></div>
            </div>
            <MapView
              pickup={pickup}
              destination={destination}
              className="w-full h-full"
            />
          </div>
        ) : null}
      </div>

      {/* Sidebar */}
      <div className="w-full md:w-96 bg-white shadow-lg flex flex-col order-2 md:order-1">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Car className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-gray-900">RideBook</h1>
                <p className="text-xs md:text-sm text-gray-600">Đặt xe nhanh chóng</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* Mobile Map Button */}
              <button
                onClick={() => setShowMobileMap(true)}
                className="md:hidden p-2 bg-blue-50 text-blue-600 rounded-lg transition-colors"
              >
                <span className="text-sm font-medium">Bản đồ</span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Menu className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <User className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {currentState === 'location' && (
            <div className="space-y-4 md:space-y-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Đặt chuyến đi</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Điểm đón
                    </label>
                    <LocationInput
                      value={pickup}
                      placeholder="Nhập điểm đón..."
                      onLocationSelect={handlePickupSelect}
                      type="pickup"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Điểm đến
                    </label>
                    <LocationInput
                      value={destination}
                      placeholder="Nhập điểm đến..."
                      onLocationSelect={handleDestinationSelect}
                      type="destination"
                    />
                  </div>
                </div>

                {canProceedToVehicleSelection && (
                  <div className="mt-4 md:mt-6 p-4 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-gray-600">Quãng đường dự kiến:</span>
                      <span className="font-semibold text-gray-900">{distance.toFixed(1)} km</span>
                    </div>
                    <button
                      onClick={() => setCurrentState('vehicle')}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Chọn loại xe
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentState === 'vehicle' && pickup && destination && (
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Chọn loại xe</h2>
                <button
                  onClick={() => setCurrentState('location')}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm md:text-base"
                >
                  Chỉnh sửa
                </button>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 md:p-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900 truncate">{pickup.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900 truncate">{destination.name}</span>
                </div>
              </div>

              <VehicleSelector
                vehicles={vehicleTypes}
                selectedVehicle={selectedVehicle}
                onVehicleSelect={handleVehicleSelect}
                distance={distance}
              />

              {selectedVehicle && (
                <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-gray-600 text-sm">Tổng chi phí</p>
                      <p className="text-2xl md:text-3xl font-bold text-gray-900">
                        {formatPrice(Math.ceil(distance * selectedVehicle.pricePerKm))}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleBookRide}
                    className="w-full bg-blue-600 text-white py-3 md:py-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-base md:text-lg"
                  >
                    Đặt xe ngay
                  </button>
                </div>
              )}
            </div>
          )}

          {currentState === 'booking' && pickup && destination && selectedVehicle && (
            <BookingConfirmation
              pickup={pickup}
              destination={destination}
              vehicle={selectedVehicle}
              price={Math.ceil(distance * selectedVehicle.pricePerKm)}
              distance={distance}
              onCancel={handleCancelBooking}
              onBack={handleBackToVehicleSelection}
            />
          )}
        </div>
      </div>

      {/* Map Area - Hidden on mobile, shown on desktop */}
      <div className="hidden md:block flex-1 order-1 md:order-2">
        <MapView
          pickup={pickup}
          destination={destination}
          className="w-full h-full"
        />
      </div>
    </div>
  );
}

export default App;