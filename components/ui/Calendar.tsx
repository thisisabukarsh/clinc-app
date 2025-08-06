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
      days.push(<div key={`empty-${i}`} className="w-10 h-10" />);
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
            "w-10 h-10 rounded-lg text-sm font-medium transition-colors",
            "hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500",
            {
              "bg-primary-600 text-white hover:bg-primary-700": selected,
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
        "bg-white rounded-lg border border-gray-200 p-4",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-semibold text-gray-900">
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>

        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="w-10 h-10 flex items-center justify-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center space-x-4 space-x-reverse text-xs text-gray-500">
        <div className="flex items-center space-x-1 space-x-reverse">
          <div className="w-3 h-3 bg-primary-600 rounded"></div>
          <span>محدد</span>
        </div>
        <div className="flex items-center space-x-1 space-x-reverse">
          <div className="w-3 h-3 bg-gray-200 rounded"></div>
          <span>غير متاح</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
