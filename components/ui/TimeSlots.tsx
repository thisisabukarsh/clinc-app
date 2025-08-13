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
      <div className={cn("text-center py-6", className)}>
        <Clock className="w-10 h-10 text-gray-300 mx-auto mb-2" />
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
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2 text-right">
          {title}
        </h4>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {slots.map((slot) => (
            <button
              key={slot.time}
              onClick={() => slot.available && onTimeSelect(slot.time)}
              disabled={!slot.available}
              className={cn(
                "p-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                "border border-gray-200 hover:border-blue-300",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:border-transparent",
                {
                  "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 shadow-md":
                    selectedTime === slot.time,
                  "bg-white text-gray-700 hover:bg-blue-50":
                    slot.available && selectedTime !== slot.time,
                  "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200":
                    !slot.available,
                }
              )}
            >
              <div className="flex flex-col items-center">
                <span className="text-sm font-medium">{slot.time}</span>
                {slot.price && slot.available && (
                  <span
                    className={cn(
                      "text-xs mt-1",
                      selectedTime === slot.time
                        ? "text-blue-100"
                        : "text-gray-500"
                    )}
                  >
                    {/* {slot.price} دينار */}
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
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center space-x-2 space-x-reverse text-gray-700 mb-3">
        <Clock className="w-4 h-4" />
        <span className="font-medium text-sm">اختر الوقت المناسب</span>
      </div>

      {renderTimeSlotGroup(morningSlots, "الفترة الصباحية")}
      {renderTimeSlotGroup(afternoonSlots, "فترة بعد الظهر")}

      {/* {selectedTime && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2 space-x-reverse text-blue-700">
            <Clock className="w-4 h-4" />
            <span className="font-medium text-sm">
              الوقت المحدد: {selectedTime}
            </span>
          </div>
        </div>
      )} */}

      {/* Legend */}
      <div className="flex items-center justify-center space-x-4  text-xs text-gray-500 pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-1">
          <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
          <span>محدد</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2.5 h-2.5 bg-white border border-gray-300 rounded"></div>
          <span>متاح</span>
        </div>
        <div className="flex items-center space-x-1 ">
          <div className="w-2.5 h-2.5 bg-gray-200 rounded"></div>
          <span>محجوز</span>
        </div>
      </div>
    </div>
  );
};

export default TimeSlots;
