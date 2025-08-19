import React, { useState, useEffect } from "react";
import { Doctor } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { useAppointmentBooking } from "@/lib/hooks/useAppointmentBooking";
import Calendar from "@/components/ui/Calendar";
import TimeSlots from "@/components/ui/TimeSlots";
import Button from "@/components/ui/Button";

interface AppointmentBookingProps {
  doctor: Doctor;
  onBookingConfirm?: (bookingDetails: BookingDetails) => void;
  onCancel?: () => void;
  className?: string;
  showHeader?: boolean;
  showCancelButton?: boolean;
}

interface BookingDetails {
  doctorId: string;
  doctorName: string;
  date: Date;
  time: string;
  price: number;
  clinic: string;
  location: string;
}

export const AppointmentBooking: React.FC<AppointmentBookingProps> = ({
  doctor,
  onBookingConfirm,
  onCancel,
  className = "",
  showHeader = true,
  showCancelButton = true,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");

  const {
    timeSlots,
    loading,
    error,
    fetchSchedule,
    bookAppointmentSlot,
    retryFetchSchedule,
  } = useAppointmentBooking({
    doctorId: doctor.id,
    doctorPrice: doctor.price,
    onSuccess: () => {
      if (onBookingConfirm) {
        const selectedSlot = timeSlots.find(
          (slot) => slot.time === selectedTime
        );
        const bookingDetails: BookingDetails = {
          doctorId: doctor.id,
          doctorName: doctor.name,
          date: selectedDate!,
          time: selectedTime,
          price: selectedSlot?.price || doctor.price,
          clinic: doctor.clinic,
          location: doctor.location,
        };
        onBookingConfirm(bookingDetails);
      }
    },
  });

  // Additional fees (can be made configurable)
  const additionalFees = 2;
  const totalPrice = doctor.price + additionalFees;

  useEffect(() => {
    if (selectedDate) {
      fetchSchedule(selectedDate);
    }
  }, [selectedDate, fetchSchedule]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(""); // Reset time when date changes
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedTime) return;

    try {
      await bookAppointmentSlot(selectedDate, selectedTime);
    } catch (error: unknown) {
      console.error("Failed to book appointment:", error);
      // Error handling is already done in the hook
    }
  };

  const isBookingDisabled = !selectedDate || !selectedTime;

  return (
    <div className={`bg-white rounded-2xl p-6  ${className}`}>
      {/* Header */}
      {showHeader && (
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#0C1541] mb-2">إحجز موعد</h2>
          <p className="text-gray-600">
            مع {doctor.name} - {doctor.specialty}
          </p>
        </div>
      )}

      <div className="space-y-8">
        {/* Calendar Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-right">
            اختر التاريخ
          </h3>
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            minDate={new Date()}
            maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)} // 30 days from now
          />
        </div>

        {/* Time Slots Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-right">
            اختر الوقت
          </h3>
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">
                جاري تحميل المواعيد المتاحة...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-600 mb-2">⚠️</div>
              <p className="text-red-600 mb-2">{error}</p>
              <button
                onClick={() => {
                  if (selectedDate) {
                    retryFetchSchedule(selectedDate);
                  }
                }}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                إعادة المحاولة
              </button>
            </div>
          ) : (
            <TimeSlots
              timeSlots={timeSlots}
              selectedTime={selectedTime}
              onTimeSelect={handleTimeSelect}
            />
          )}
        </div>

        {/* Cost Summary Section */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-right">
            تفاصيل التكلفة
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">رسوم الكشفية</span>
              <span className="font-medium">
                {formatCurrency(doctor.price, doctor.currency)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">رسوم إضافية</span>
              <span className="font-medium">
                {formatCurrency(additionalFees, doctor.currency)}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">المجموع</span>
                <span className="font-bold text-green-600 text-lg">
                  {formatCurrency(totalPrice, doctor.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleConfirmBooking}
            disabled={isBookingDisabled || loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
            variant="primary"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                جاري الحجز...
              </div>
            ) : (
              "حجز موعد"
            )}
          </Button>

          {showCancelButton && onCancel && (
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1 sm:flex-none"
            >
              إلغاء
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
