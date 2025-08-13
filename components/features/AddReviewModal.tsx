"use client";

import React, { useState } from "react";
import { Star, X } from "lucide-react";
import { Appointment } from "@/types";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onSubmit?: (review: ReviewData) => void;
}

interface ReviewData {
  appointmentId: string;
  rating: number;
  comment: string;
}

const AddReviewModal: React.FC<AddReviewModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onSubmit,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);

  if (!appointment) return null;

  const handleSubmit = () => {
    if (rating > 0 && onSubmit) {
      const reviewData: ReviewData = {
        appointmentId: appointment.id,
        rating,
        comment,
      };
      onSubmit(reviewData);
      onClose();
      // Reset form
      setRating(0);
      setComment("");
    }
  };

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  const handleStarHover = (starRating: number) => {
    setHoveredRating(starRating);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starNumber = index + 1;
      const isFilled = starNumber <= (hoveredRating || rating);

      return (
        <button
          key={starNumber}
          onClick={() => handleStarClick(starNumber)}
          onMouseEnter={() => handleStarHover(starNumber)}
          onMouseLeave={handleStarLeave}
          className="p-1 transition-colors duration-200"
        >
          <Star
            className={`w-8 h-8 ${
              isFilled ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            } hover:scale-110 transition-transform duration-200`}
          />
        </button>
      );
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      className="max-h-[90vh] overflow-y-auto"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">تقييم الطبيب</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Doctor Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">
            {appointment.doctorName}
          </h3>
          <p className="text-sm text-gray-600">طبيب متخصص</p>
          <p className="text-sm text-gray-500">
            {appointment.date} - {appointment.time}
          </p>
        </div>

        {/* Rating Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3 text-right">
            تقييمك للطبيب
          </label>
          <div className="flex justify-center space-x-1 space-x-reverse">
            {renderStars()}
          </div>
          <p className="text-center text-sm text-gray-500 mt-2">
            {rating > 0 ? `تقييمك: ${rating} نجوم` : "اضغط على النجوم للتقييم"}
          </p>
        </div>

        {/* Comment Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3 text-right">
            تعليقك (اختياري)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="اكتب تجربتك مع الطبيب..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
            dir="rtl"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 space-x-reverse">
          <Button variant="outline" onClick={onClose} className="px-6 py-2">
            إلغاء
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={rating === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            إرسال التقييم
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddReviewModal;
