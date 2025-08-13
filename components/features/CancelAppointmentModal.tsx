"use client";

import React, { useState } from "react";
import { AlertTriangle, X, Calendar, Clock, User } from "lucide-react";
import { Appointment } from "@/types";
import { formatDate } from "@/lib/utils";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

interface CancelAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onConfirm?: (appointmentId: string, reason: string) => void;
}

const CancelAppointmentModal: React.FC<CancelAppointmentModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onConfirm,
}) => {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!appointment) return null;

  const handleConfirm = async () => {
    if (onConfirm) {
      setIsSubmitting(true);
      try {
        await onConfirm(appointment.id, reason);
        onClose();
        setReason("");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="md"
      className="max-h-[90vh] overflow-y-auto"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">إلغاء الموعد</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        {/* Warning Message */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            هل أنت متأكد من إلغاء هذا الموعد؟
          </h3>
          <p className="text-gray-600">
            لا يمكن التراجع عن هذا الإجراء بعد التأكيد
          </p>
        </div>

        {/* Appointment Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3 space-x-reverse mb-3">
            <User className="w-5 h-5 text-gray-500" />
            <h4 className="font-semibold text-gray-900">
              {appointment.doctorName}
            </h4>
          </div>
          <div className="flex items-center space-x-3 space-x-reverse mb-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {formatDate(appointment.date)}
            </span>
          </div>
          <div className="flex items-center space-x-3 space-x-reverse">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{appointment.time}</span>
          </div>
        </div>

        {/* Reason for Cancellation */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3 text-right">
            سبب الإلغاء (اختياري)
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="اكتب سبب إلغاء الموعد..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            rows={3}
            dir="rtl"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 space-x-reverse">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-6 py-2"
          >
            إلغاء
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "جاري الإلغاء..." : "تأكيد الإلغاء"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CancelAppointmentModal;
