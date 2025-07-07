import React from "react";
import { Car, Bike, Crown, Users } from "lucide-react";
import { CarContext } from "../context/carContext";

export interface Vehicle {
  id: string;
  name: string;
  type: "bike" | "car" | "premium";
  icon: React.ReactNode;
  capacity: number;
  pricePerKm: number;
  estimatedTime: string;
  description: string;
}

interface VehicleSelectorProps {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  onVehicleSelect: (vehicle: Vehicle) => void;
  distance: number;
}

export const vehicleTypes: Vehicle[] = [
  {
    id: "bike",
    name: "FastBike",
    type: "bike",
    icon: <Bike className="w-5 h-5 md:w-6 md:h-6" />,
    capacity: 1,
    pricePerKm: 8000,
    estimatedTime: "5-10 phút",
    description: "Nhanh chóng, tiết kiệm",
  },
  {
    id: "car",
    name: "FastCar",
    type: "car",
    icon: <Car className="w-5 h-5 md:w-6 md:h-6" />,
    capacity: 4,
    pricePerKm: 12000,
    estimatedTime: "8-15 phút",
    description: "Thoải mái, an toàn",
  },
  {
    id: "premium",
    name: "FastPremium",
    type: "premium",
    icon: <Crown className="w-5 h-5 md:w-6 md:h-6" />,
    capacity: 4,
    pricePerKm: 18000,
    estimatedTime: "10-12 phút",
    description: "Sang trọng, dịch vụ cao cấp",
  },
];

export default function VehicleSelector({
  vehicles,
  selectedVehicle,
  onVehicleSelect,
  distance,
}: VehicleSelectorProps) {
  const { cars } = CarContext();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="space-y-3 md:space-y-4">
      <h2 className="text-lg md:text-xl font-semibold text-gray-900">
        Chọn loại xe
      </h2>
      <div className="space-y-3">
        {cars
        .sort((a, b) => a.id - b.id)
        .map((vehicle) => {
          const totalPrice = Math.ceil(distance * vehicle.pricePerKm);
          const isSelected = selectedVehicle?.id === vehicle.id;

          return (
            <button
              key={vehicle.id}
              onClick={() => onVehicleSelect(vehicle)}
              className={`w-full p-3 md:p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div
                    className={`p-2 md:p-3 rounded-lg ${
                      vehicle.id === 1
                        ? "bg-green-100 text-green-600"
                        : vehicle.id === 2
                        ? "bg-blue-100 text-blue-600"
                        : "bg-purple-100 text-purple-600"
                    }`}
                  >
                    {vehicle.id === 1 && (
                      <Bike className="w-5 h-5 md:w-6 md:h-6" />
                    )}
                    {vehicle.id === 2 && (
                      <Car className="w-5 h-5 md:w-6 md:h-6" />
                    )}
                    {vehicle.id === 3 && (
                      <Car className="w-5 h-5 md:w-6 md:h-6" />
                    )}
                  </div>

                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 text-base md:text-lg">
                      {vehicle.type_car}
                    </h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      {vehicle.description}
                    </p>

                    <div className="flex items-center space-x-3 md:space-x-4 mt-1 md:mt-2">
                      <div className="flex items-center space-x-1 text-xs md:text-sm text-gray-500">
                        <Users className="w-3 h-3 md:w-4 md:h-4" />
                        <span>{vehicle.capacity} chỗ</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg md:text-xl font-bold text-gray-900">
                    {formatPrice(totalPrice)}
                  </p>
                  <p className="text-xs md:text-sm text-gray-500">
                    {formatPrice(vehicle.pricePerKm)}/km
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {distance > 0 && (
        <div className="bg-gray-50 rounded-lg p-3 md:p-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Quãng đường:</span>
            <span className="font-medium">{distance.toFixed(1)} km</span>
          </div>
        </div>
      )}
    </div>
  );
}
