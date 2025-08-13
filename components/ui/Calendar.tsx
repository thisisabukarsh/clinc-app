"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarProps {
  selectedDate?: Date;
  onDateSelect: (date: Date) => void;
  disabledDates?: Date[];
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  onDateSelect,
  disabledDates = [],
  minDate = new Date(),
  maxDate,
  className = "",
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysOfWeek = ["ح", "ن", "ث", "ر", "خ", "ج", "س"];
  const months = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateDisabled = (date: Date) => {
    // Check if date is before minDate
    if (minDate && date < minDate) return true;

    // Check if date is after maxDate
    if (maxDate && date > maxDate) return true;

    // Check if date is in disabled dates
    return disabledDates.some(
      (disabledDate) => date.toDateString() === disabledDate.toDateString()
    );
  };

  const isDateSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const handleDateClick = (day: number) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    if (!isDateDisabled(date)) {
      onDateSelect(date);
    }
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const disabled = isDateDisabled(date);
      const selected = isDateSelected(date);

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          disabled={disabled}
          className={cn(
            "w-8 h-8 rounded-full text-sm font-medium transition-all duration-200",
            "hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            {
              "bg-blue-600 text-white hover:bg-blue-700 shadow-md": selected,
              "text-gray-400 cursor-not-allowed": disabled,
              "text-gray-900 hover:bg-gray-100": !selected && !disabled,
            }
          )}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div
      className={cn(
        "bg-white rounded-lg border border-gray-200 p-3",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={handlePrevMonth}
          className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <h3 className="text-base font-semibold text-gray-900">
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>

        <button
          onClick={handleNextMonth}
          className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="w-8 h-8 flex items-center justify-center text-xs font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1 mb-3">{renderCalendarDays()}</div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-3 text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
          <span>محدد</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2.5 h-2.5 bg-gray-200 rounded"></div>
          <span>غير متاح</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
