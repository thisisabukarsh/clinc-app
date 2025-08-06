"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Star, MapPin, Clock, Phone, Mail } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import BookingModal from "@/components/features/BookingModal";
import { mockDoctors } from "@/lib/mockData";
import { Doctor } from "@/types";
import { formatCurrency } from "@/lib/utils";

export default function DoctorProfilePage() {
  const params = useParams();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundDoctor = mockDoctors.find((d) => d.id === params.id);
      setDoctor(foundDoctor || null);
      setLoading(false);
    }, 500);
  }, [params.id]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const handleBookingConfirm = (bookingDetails: any) => {
    console.log("Booking confirmed:", bookingDetails);
    // TODO: Implement actual booking logic
    alert(
      `تم حجز موعد مع ${
        bookingDetails.doctorName
      } في ${bookingDetails.date.toLocaleDateString("ar")} الساعة ${
        bookingDetails.time
      }`
    );
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (!doctor) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            لم يتم العثور على الطبيب
          </h1>
          <p className="text-gray-600">الطبيب المطلوب غير موجود</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* Doctor Profile Header */}
        <section className="bg-white shadow-soft">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Doctor Image */}
              <div className="lg:col-span-1">
                <div className="w-48 h-48 bg-gray-200 rounded-full mx-auto flex items-center justify-center">
                  <span className="text-6xl">👨‍⚕️</span>
                </div>
              </div>

              {/* Doctor Info */}
              <div className="lg:col-span-2">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {doctor.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  {renderStars(doctor.rating)}
                  <span className="text-lg text-gray-600 mr-2">
                    {doctor.rating}
                  </span>
                </div>

                {/* Specialty and Price */}
                <div className="flex items-center space-x-4 space-x-reverse mb-6">
                  <span className="text-lg text-gray-700">
                    {doctor.specialty}
                  </span>
                  <span className="text-lg font-semibold text-primary-600">
                    {formatCurrency(doctor.price, doctor.currency)}
                  </span>
                </div>

                {/* Clinic Info */}
                <div className="flex items-center space-x-4 space-x-reverse mb-6">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>
                      {doctor.clinic} - {doctor.location}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 space-x-reverse">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => setIsBookingModalOpen(true)}
                  >
                    حجز موعد
                  </Button>
                  <Button variant="outline" size="lg">
                    موقع العيادة
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Doctor Biography */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              نبذة عن الطبيب
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              {doctor.biography}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">الخبرة</h3>
                <p className="text-gray-600">{doctor.experience}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">التعليم</h3>
                <p className="text-gray-600">{doctor.education}</p>
              </div>
            </div>
          </Card>
        </section>

        {/* Clinic Photos */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            صور العيادة
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-4xl">🏥</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">
                    صورة العيادة {i}
                  </h3>
                  <p className="text-sm text-gray-600">
                    منطقة الاستقبال والانتظار
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Information */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              معلومات التواصل
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3 space-x-reverse">
                <Phone className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="font-semibold text-gray-900">رقم الهاتف</p>
                  <p className="text-gray-600">+962 79 123 4567</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <Mail className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="font-semibold text-gray-900">
                    البريد الإلكتروني
                  </p>
                  <p className="text-gray-600">info@clinic.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <Clock className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="font-semibold text-gray-900">ساعات العمل</p>
                  <p className="text-gray-600">
                    الأحد - الخميس: 9:00 ص - 6:00 م
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <MapPin className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="font-semibold text-gray-900">العنوان</p>
                  <p className="text-gray-600">
                    {doctor.clinic} - {doctor.location}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Booking Modal */}
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          doctor={doctor}
          onBookingConfirm={handleBookingConfirm}
        />
      </div>
    </MainLayout>
  );
}
