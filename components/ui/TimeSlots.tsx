"use client";

import React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeSlot {
  time: string;
  available: boolean;
  price?: number;
}

interface TimeSlotsProps {
  timeSlots: TimeSlot[];
  selectedTime?: string;
  onTimeSelect: (time: string) => void;
  className?: string;
}

const TimeSlots: React.FC<TimeSlotsProps> = ({
  timeSlots,
  selectedTime,
  onTimeSelect,
  className = "",
}) => {
  if (timeSlots.length === 0) {
    return (
      <div className={cn("text-center py-8", className)}>
        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">لا توجد مواعيد متاحة في هذا التاريخ</p>
        <p className="text-sm text-gray-400 mt-1">
          يرجى اختيار تاريخ آخر أو التواصل مع العيادة
        </p>
      </div>
    );
  }

  const morningSlots = timeSlots.filter((slot) => {
    const hour = parseInt(slot.time.split(":")[0]);
    return hour < 12;
  });

  const afternoonSlots = timeSlots.filter((slot) => {
    const hour = parseInt(slot.time.split(":")[0]);
    return hour >= 12;
  });

  const renderTimeSlotGroup = (slots: TimeSlot[], title: string) => {
    if (slots.length === 0) return null;

    return (
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">{title}</h4>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {slots.map((slot) => (
            <button
              key={slot.time}
              onClick={() => slot.available && onTimeSelect(slot.time)}
              disabled={!slot.available}
              className={cn(
                "p-3 rounded-lg text-sm font-medium transition-all duration-200",
                "border border-gray-200 hover:border-primary-300",
                "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                {
                  "bg-primary-600 text-white border-primary-600 hover:bg-primary-700":
                    selectedTime === slot.time,
                  "bg-white text-gray-700 hover:bg-primary-50":
                    slot.available && selectedTime !== slot.time,
                  "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200":
                    !slot.available,
                }
              )}
            >
              <div className="flex flex-col items-center">
                <span className="text-base">{slot.time}</span>
                {slot.price && slot.available && (
                  <span
                    className={cn(
                      "text-xs mt-1",
                      selectedTime === slot.time
                        ? "text-primary-100"
                        : "text-gray-500"
                    )}
                  >
                    {slot.price} دينار
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center space-x-2 space-x-reverse text-gray-700 mb-4">
        <Clock className="w-5 h-5" />
        <span className="font-medium">اختر الوقت المناسب</span>
      </div>

      {renderTimeSlotGroup(morningSlots, "الفترة الصباحية")}
      {renderTimeSlotGroup(afternoonSlots, "فترة بعد الظهر")}

      {selectedTime && (
        <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
          <div className="flex items-center space-x-2 space-x-reverse text-primary-700">
            <Clock className="w-5 h-5" />
            <span className="font-medium">الوقت المحدد: {selectedTime}</span>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 space-x-reverse text-xs text-gray-500 pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-1 space-x-reverse">
          <div className="w-3 h-3 bg-primary-600 rounded"></div>
          <span>محدد</span>
        </div>
        <div className="flex items-center space-x-1 space-x-reverse">
          <div className="w-3 h-3 bg-white border border-gray-300 rounded"></div>
          <span>متاح</span>
        </div>
        <div className="flex items-center space-x-1 space-x-reverse">
          <div className="w-3 h-3 bg-gray-200 rounded"></div>
          <span>محجوز</span>
        </div>
      </div>
    </div>
  );
};

export default TimeSlots;
