import { useState, useEffect } from "react";
import {
  Check,
  Clock,
  Phone,
  MessageCircle,
  Star,
  ArrowLeft,
} from "lucide-react";
import { CarContext } from "../context/carContext";
import { AuthContext } from "../context/authContext";
import { supabase } from "../config/supabase";

interface Location {
  name: string;
  address: string;
}

interface Vehicle {
  name: string;
  type: string;
}

interface BookingConfirmationProps {
  pickup: Location;
  destination: Location;
  vehicle: Vehicle;
  price: number;
  distance: number;
  onCancel: () => void;
  onBack: () => void;
}

interface Driver {
  name: string;
  email: string;
  phone: string;
  plate_license: string;
}

interface BookingData {
  id: number;
  id_user: number;
  id_driver: string;
  id_type_car: number;
  location_from: string;
  location_to: string;
  location_from_name: string;
  location_to_name: string;
  distance: string;
  total_price: string;
  created_at: string;
  id_status_booking: number;
  drivers: Driver;
}

export default function BookingConfirmation({
  pickup,
  destination,
  vehicle,
  price,
  distance,
  onCancel,
  onBack,
}: BookingConfirmationProps) {
  const { bookingUser, setBookingUser, handleGetBookingUser } = CarContext();
  const { userInfo } = AuthContext();
  const [status, setStatus] = useState<
    "searching" | "found" | "arriving" | "arrived"
  >("searching");
  const [estimatedTime, setEstimatedTime] = useState(5);

  // Get current booking data
  const currentBooking: BookingData | null = bookingUser?.[0] || null;

  useEffect(() => {
    if (!userInfo?.user?.id) return;

    // Fetch initial booking data
    handleGetBookingUser(userInfo.user.id);

    // Subscribe to changes in the "booking" table
    const channel = supabase
      .channel("booking-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "booking",
          filter: `id_user=eq.${userInfo.user.id}`, // Filter for the logged-in user
        },
        (payload: any) => {
          console.log("Realtime payload:", payload);

          // Ensure we are modifying the correct state (handling INSERT, UPDATE, DELETE)
          // setBookingUser((prev: any[]) => {
          //   // Handle INSERT
          //   if (payload.eventType === "INSERT") {
          //     return [payload.new, ...prev];
          //   }

          //   // Handle UPDATE
          //   if (payload.eventType === "UPDATE") {
          //     return prev.map((b) =>
          //       b.id === payload.new.id ? payload.new : b
          //     );
          //   }

          //   // Handle DELETE
          //   if (payload.eventType === "DELETE") {
          //     return prev.filter((b) => b.id !== payload.old.id);
          //   }

          //   return prev;
          // });
          handleGetBookingUser(userInfo.user.id);
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userInfo?.user?.id]);

  // Handle status changes based on bookingUser data
  useEffect(() => {
    if (!currentBooking) {
      setStatus("searching");
      return;
    }

    // When booking data is available, transition through statuses
    const timer1 = setTimeout(() => setStatus("found"), 100); // Immediately show found
    const timer2 = setTimeout(() => setStatus("arriving"), 2000); // After 2 seconds, show arriving

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [currentBooking]);

  // Countdown timer for estimated arrival time
  useEffect(() => {
    if (status === "arriving") {
      const countdown = setInterval(() => {
        setEstimatedTime((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      // Simulate arrival after countdown
      const arrivalTimer = setTimeout(() => {
        setStatus("arrived");
      }, estimatedTime * 1000);

      return () => {
        clearInterval(countdown);
        clearTimeout(arrivalTimer);
      };
    }
  }, [status, estimatedTime]);

  console.log("bookingUser", bookingUser);
  console.log("currentBooking", currentBooking);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStatusInfo = () => {
    switch (status) {
      case "searching":
        return {
          title: "Đang tìm tài xế...",
          subtitle: "Vui lòng chờ trong giây lát",
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          icon: <Clock className="w-5 h-5 md:w-6 md:h-6 animate-spin" />,
        };
      case "found":
        return {
          title: "Đã tìm thấy tài xế!",
          subtitle: "Tài xế đang di chuyển đến điểm đón",
          color: "text-green-600",
          bgColor: "bg-green-50",
          icon: <Check className="w-5 h-5 md:w-6 md:h-6" />,
        };
      case "arriving":
        return {
          title: "Tài xế đang đến",
          subtitle: `Còn khoảng ${estimatedTime} phút nữa`,
          color: "text-amber-600",
          bgColor: "bg-amber-50",
          icon: <Clock className="w-5 h-5 md:w-6 md:h-6" />,
        };
      case "arrived":
        return {
          title: "Tài xế đã đến!",
          subtitle: "Vui lòng ra điểm đón",
          color: "text-green-600",
          bgColor: "bg-green-50",
          icon: <Check className="w-5 h-5 md:w-6 md:h-6" />,
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 md:space-x-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">
          Trạng thái chuyến đi
        </h1>
      </div>

      {/* Status */}
      <div className={`${statusInfo.bgColor} rounded-xl p-4 md:p-6`}>
        <div className="flex items-center space-x-3 md:space-x-4">
          <div className={statusInfo.color}>{statusInfo.icon}</div>
          <div>
            <h3
              className={`text-lg md:text-xl font-semibold ${statusInfo.color}`}
            >
              {statusInfo.title}
            </h3>
            <p className="text-gray-600 mt-1 text-sm md:text-base">
              {statusInfo.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Driver Info */}
      {status !== "searching" && currentBooking && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6">
          <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
            Thông tin tài xế
          </h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 md:space-x-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-200 rounded-full flex items-center justify-center text-xl md:text-2xl">
                👨‍💼
              </div>
              <div>
                <p className="text-base md:text-lg font-medium text-gray-900">
                  {currentBooking.drivers.name}
                </p>
                <div className="flex items-center space-x-2 md:space-x-3 mt-1">
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current" />
                    <span className="text-gray-600 text-sm">4.8</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600 text-sm">
                    {currentBooking.drivers.plate_license}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-2 md:space-x-3">
              <button className="p-2 md:p-3 bg-green-100 text-green-600 rounded-xl hover:bg-green-200 transition-colors">
                <Phone className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <button className="p-2 md:p-3 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors">
                <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trip Details */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 space-y-4 md:space-y-6">
        <h4 className="text-base md:text-lg font-semibold text-gray-900">
          Chi tiết chuyến đi
        </h4>

        <div className="space-y-4">
          <div className="flex items-start space-x-3 md:space-x-4">
            <div className="w-4 h-4 bg-green-500 rounded-full mt-1 md:mt-2"></div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 text-base md:text-lg">
                {currentBooking
                  ? currentBooking.location_from_name.split(",")[0]
                  : pickup.name}
              </p>
              <p className="text-gray-600 text-sm md:text-base">
                {currentBooking
                  ? currentBooking.location_from_name
                  : pickup.address}
              </p>
            </div>
          </div>

          <div className="ml-2 border-l-2 border-dashed border-gray-300 h-4 md:h-6"></div>

          <div className="flex items-start space-x-3 md:space-x-4">
            <div className="w-4 h-4 bg-red-500 rounded-full mt-1 md:mt-2"></div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 text-base md:text-lg">
                {currentBooking
                  ? currentBooking.location_to_name.split(",")[0]
                  : destination.name}
              </p>
              <p className="text-gray-600 text-sm md:text-base">
                {currentBooking
                  ? currentBooking.location_to_name
                  : destination.address}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-3 md:p-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600 text-sm md:text-base">Loại xe:</span>
            <span className="font-medium text-sm md:text-base">
              {vehicle.name}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 text-sm md:text-base">
              Quãng đường:
            </span>
            <span className="font-medium text-sm md:text-base">
              {currentBooking
                ? `${parseFloat(currentBooking.distance).toFixed(1)} km`
                : `${distance.toFixed(1)} km`}
            </span>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-3">
            <span className="text-gray-600 text-sm md:text-base">
              Tổng tiền:
            </span>
            <span className="text-lg md:text-xl font-bold text-gray-900">
              {currentBooking
                ? formatPrice(parseInt(currentBooking.total_price))
                : formatPrice(price)}
            </span>
          </div>
        </div>
      </div>

      {/* Cancel button */}
      <button
        onClick={onCancel}
        className="w-full bg-red-50 text-red-600 py-3 md:py-4 rounded-xl font-medium hover:bg-red-100 transition-colors border border-red-200"
      >
        Hủy chuyến đi
      </button>
    </div>
  );
}
