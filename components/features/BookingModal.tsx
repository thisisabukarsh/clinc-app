"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  DollarSign,
  Check,
} from "lucide-react";
import { Doctor } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { generateMockTimeSlots } from "@/lib/mockData";
import Modal from "@/components/ui/Modal";
import Calendar from "@/components/ui/Calendar";
import TimeSlots from "@/components/ui/TimeSlots";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor | null;
  onBookingConfirm?: (bookingDetails: BookingDetails) => void;
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

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  doctor,
  onBookingConfirm,
}) => {
  const [step, setStep] = useState<"date" | "time" | "confirm">("date");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedDate && doctor) {
      setLoading(true);
      // Simulate API call to get available time slots
      setTimeout(() => {
        const slots = generateMockTimeSlots(selectedDate, doctor.id);
        setTimeSlots(slots);
        setLoading(false);
      }, 500);
    }
  }, [selectedDate, doctor]);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setStep("date");
      setSelectedDate(undefined);
      setSelectedTime("");
      setTimeSlots([]);
    }
  }, [isOpen]);

  if (!doctor) return null;

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(""); // Reset time when date changes
    setStep("time");
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep("confirm");
  };

  const handleConfirmBooking = () => {
    if (selectedDate && selectedTime && onBookingConfirm) {
      const selectedSlot = timeSlots.find((slot) => slot.time === selectedTime);
      const bookingDetails: BookingDetails = {
        doctorId: doctor.id,
        doctorName: doctor.name,
        date: selectedDate,
        time: selectedTime,
        price: selectedSlot?.price || doctor.price,
        clinic: doctor.clinic,
        location: doctor.location,
      };
      onBookingConfirm(bookingDetails);
    }
    onClose();
  };

  const handleBack = () => {
    if (step === "time") {
      setStep("date");
    } else if (step === "confirm") {
      setStep("time");
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case "date":
        return "اختر التاريخ";
      case "time":
        return "اختر الوقت";
      case "confirm":
        return "تأكيد الحجز";
      default:
        return "حجز موعد";
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case "date":
        return (
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            minDate={new Date()}
            maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)} // 30 days from now
          />
        );

      case "time":
        return (
          <div>
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <p className="mt-2 text-gray-600">
                  جاري تحميل المواعيد المتاحة...
                </p>
              </div>
            ) : (
              <TimeSlots
                timeSlots={timeSlots}
                selectedTime={selectedTime}
                onTimeSelect={handleTimeSelect}
              />
            )}
          </div>
        );

      case "confirm":
        const selectedSlot = timeSlots.find(
          (slot) => slot.time === selectedTime
        );
        return (
          <div className="space-y-6">
            {/* Doctor Info */}
            <Card className="p-4 bg-gray-50">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{doctor.name}</h4>
                  <p className="text-sm text-gray-600">{doctor.specialty}</p>
                </div>
              </div>
            </Card>

            {/* Booking Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center space-x-2 space-x-reverse text-gray-700">
                  <CalendarIcon className="w-5 h-5" />
                  <span>التاريخ</span>
                </div>
                <span className="font-medium">
                  {selectedDate && formatDate(selectedDate)}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center space-x-2 space-x-reverse text-gray-700">
                  <Clock className="w-5 h-5" />
                  <span>الوقت</span>
                </div>
                <span className="font-medium">{selectedTime}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center space-x-2 space-x-reverse text-gray-700">
                  <MapPin className="w-5 h-5" />
                  <span>العيادة</span>
                </div>
                <span className="font-medium">
                  {doctor.clinic} - {doctor.location}
                </span>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-2 space-x-reverse text-gray-700">
                  <DollarSign className="w-5 h-5" />
                  <span>تكلفة الكشف</span>
                </div>
                <span className="font-semibold text-primary-600">
                  {formatCurrency(
                    selectedSlot?.price || doctor.price,
                    doctor.currency
                  )}
                </span>
              </div>
            </div>

            {/* Important Notes */}
            <Card className="p-4 bg-yellow-50 border border-yellow-200">
              <div className="flex items-start space-x-2 space-x-reverse">
                <div className="text-yellow-600 mt-1">ℹ️</div>
                <div>
                  <h5 className="font-medium text-yellow-800 mb-1">
                    ملاحظات مهمة
                  </h5>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• يرجى الحضور قبل الموعد بـ 15 دقيقة</li>
                    <li>
                      • في حالة التأخير أكثر من 15 دقيقة قد يتم إلغاء الموعد
                    </li>
                    <li>• يمكن إلغاء أو تعديل الموعد قبل 24 ساعة من الموعد</li>
                    <li>
                      • يرجى إحضار الهوية الشخصية والتقارير الطبية السابقة
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`حجز موعد مع ${doctor.name}`}
      size="lg"
      className="max-h-[90vh] overflow-y-auto"
    >
      <div className="space-y-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-4 space-x-reverse">
          {["date", "time", "confirm"].map((stepName, index) => (
            <div key={stepName} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === stepName
                    ? "bg-primary-600 text-white"
                    : ["date", "time", "confirm"].indexOf(step) > index
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {["date", "time", "confirm"].indexOf(step) > index ? (
                  <Check className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              {index < 2 && (
                <div
                  className={`w-8 h-1 mx-2 ${
                    ["date", "time", "confirm"].indexOf(step) > index
                      ? "bg-green-500"
                      : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Title */}
        <h3 className="text-xl font-semibold text-center text-gray-900">
          {getStepTitle()}
        </h3>

        {/* Step Content */}
        {renderStepContent()}

        {/* Actions */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <div>
            {step !== "date" && (
              <Button variant="outline" onClick={handleBack}>
                العودة
              </Button>
            )}
          </div>

          <div className="flex space-x-3 space-x-reverse">
            <Button variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            {step === "confirm" && (
              <Button variant="primary" onClick={handleConfirmBooking}>
                تأكيد الحجز
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default BookingModal;
