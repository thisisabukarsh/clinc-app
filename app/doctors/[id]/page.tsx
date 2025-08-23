"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Loader2 } from "lucide-react";
import { getDoctorDetails, APIDoctor } from "@/lib/api/services";
import { DoctorProfileHeader } from "@/components/doctor-page";
import { AppointmentBooking, ClinicImageSlider } from "@/components/features";
import MainLayout from "@/components/layout/MainLayout";
import { toast } from "react-hot-toast";

interface BookingDetails {
  doctorId: string;
  doctorName: string;
  date: Date;
  time: string;
  price: number;
  clinic: string;
  location: string;
}

// Transform API doctor data to match existing component expectations
const transformDoctorData = (apiDoctor: APIDoctor) => {
  // Handle doctor image with proper fallback
  let doctorImage = "/doctor.png"; // Default fallback

  if (apiDoctor.photo) {
    // If photo path starts with /uploads, prepend the API base URL
    if (apiDoctor.photo.startsWith("/uploads")) {
      doctorImage = `https://threeiadti-be.onrender.com${apiDoctor.photo}`;
    } else if (apiDoctor.photo.startsWith("http")) {
      // If it's already a full URL, use it as is
      doctorImage = apiDoctor.photo;
    } else {
      // Otherwise, construct the full URL
      doctorImage = `https://threeiadti-be.onrender.com/uploads/doctors/${apiDoctor.photo}`;
    }
  }

  return {
    id: apiDoctor._id,
    name: apiDoctor.userId.name,
    specialty: apiDoctor.specialty,
    location: apiDoctor.location,
    fee: apiDoctor.fee,
    price: apiDoctor.fee, // Same as fee for compatibility
    currency: "JD", // Jordanian Dinar (consistent with other pages)
    clinic: apiDoctor.clinic?.name || "العيادة",
    phone: apiDoctor.userId.phone || apiDoctor.clinic?.phone || "",
    email: apiDoctor.userId.email,
    image: doctorImage,
    rating: 4.8, // Default rating - you can add this to your backend later
    reviewsCount: 25, // Default reviews - you can add this to your backend later
    // Mock data for fields not yet in API
    about: `الدكتور ${apiDoctor.userId.name} طبيب متخصص في ${apiDoctor.specialty} مع خبرة واسعة في هذا المجال. يقدم أفضل الخدمات الطبية للمرضى في ${apiDoctor.location}.`,
    education: "بكالوريوس الطب والجراحة، دراسات عليا في التخصص",
    experience: "أكثر من 10 سنوات خبرة في المجال الطبي",
    availability: "السبت - الخميس، 9:00 ص - 9:00 م",
    consultationTime: "30 دقيقة",
    languages: ["العربية", "الإنجليزية"],
  };
};

export default function DoctorDetailPage() {
  const params = useParams();
  const doctorId = params.id as string;
  const [doctor, setDoctor] = useState<APIDoctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const doctorData = await getDoctorDetails(doctorId);
        setDoctor(doctorData);
      } catch (err) {
        console.error("Error fetching doctor details:", err);

        let errorMessage = "فشل في تحميل بيانات الطبيب";

        if (err instanceof Error) {
          if (
            err.message.includes("404") ||
            err.message.includes("Doctor not found")
          ) {
            errorMessage =
              "لم يتم العثور على الطبيب المطلوب. قد يكون معرف الطبيب غير صحيح.";
          } else if (err.message.includes("400")) {
            errorMessage = "معرف الطبيب غير صالح.";
          } else if (err.message.includes("500")) {
            errorMessage = "خطأ في الخادم. يرجى المحاولة لاحقاً.";
          } else if (
            err.message.includes("Network") ||
            err.message.includes("ECONNREFUSED")
          ) {
            errorMessage = "مشكلة في الاتصال. تأكد من الاتصال بالإنترنت.";
          } else {
            errorMessage = err.message;
          }
        }

        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchDoctorDetails();
    }
  }, [doctorId]);

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center mt-16">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              جاري تحميل بيانات الطبيب...
            </h2>
            <p className="text-gray-600">يرجى الانتظار</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !doctor) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center mt-16">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="text-6xl mb-6">👨‍⚕️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              لم يتم العثور على الطبيب
            </h1>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-gray-700 text-sm">
                {error || "الطبيب الذي تبحث عنه غير موجود."}
              </p>
            </div>
            <div className="space-y-3">
              <p className="text-gray-600 text-sm">
                يمكنك العثور على أطباء آخرين من خلال:
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/doctors"
                  className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  تصفح جميع الأطباء
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  العودة للصفحة الرئيسية
                </Link>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // const handleBookAppointment = () => {
  //   setIsBookingModalOpen(true);
  //   console.log("Booking modal open", isBookingModalOpen);
  // };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
  };

  const handleBookingConfirm = (bookingDetails: BookingDetails) => {
    console.log("Booking confirmed:", bookingDetails);
    console.log("Booking modal open", isBookingModalOpen);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 mt-16">
        {/* Hero Section with Doctor Info */}
        <div className="">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex lg:flex-row flex-col gap-16 justify-between w-full">
              <div className="flex flex-col gap-8 w-full lg:w-1/2">
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Doctor Image */}
                  <div className="lg:col-span-1 flex justify-center">
                    <div className="w-64 h-64 bg-gray-200 rounded-3xl flex items-center justify-center overflow-hidden">
                      <Image
                        src={transformDoctorData(doctor).image}
                        alt={doctor.userId.name}
                        width={256}
                        height={256}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          // Fallback to default doctor image on error
                          const target = e.target as HTMLImageElement;
                          target.src = "/doctor.png";
                        }}
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                      />
                    </div>
                  </div>
                  {/* Doctor Info */}
                  <DoctorProfileHeader doctor={transformDoctorData(doctor)} />
                </div>

                {/* Combined Doctor Information */}
                <div className=" w-full">
                  <h2 className="text-2xl font-bold text-black mb-6 flex items-center">
                    <BookOpen className="w-6 h-6 text-black ml-3 mt-1" />
                    نبذة عن الطبيب
                  </h2>

                  {/* Flowing Paragraph Style */}
                  <div className="text-gray-700 leading-relaxed text-lg space-y-4">
                    <p>
                      الدكتور {doctor.userId.name} طبيب متخصص في{" "}
                      {doctor.specialty} مع خبرة واسعة في هذا المجال. يقدم أفضل
                      الخدمات الطبية للمرضى في {doctor.location}.
                    </p>

                    <p>
                      <span className="font-semibold">التخصص:</span>{" "}
                      {doctor.specialty}
                    </p>

                    <p>
                      <span className="font-semibold">رسوم الكشف:</span>{" "}
                      {doctor.fee} دينار أردني
                    </p>

                    <p>
                      <span className="font-semibold">الموقع:</span>{" "}
                      {doctor.clinic?.name || "العيادة"} - {doctor.location}
                    </p>

                    {doctor.clinic?.address && (
                      <p>
                        <span className="font-semibold">عنوان العيادة:</span>{" "}
                        {doctor.clinic.address}
                      </p>
                    )}

                    {doctor.clinic?.description && (
                      <p>
                        <span className="font-semibold">وصف العيادة:</span>{" "}
                        {doctor.clinic.description}
                      </p>
                    )}

                    {(doctor.userId.phone || doctor.clinic?.phone) && (
                      <p>
                        <span className="font-semibold">الهاتف:</span>{" "}
                        {doctor.userId.phone || doctor.clinic?.phone}
                      </p>
                    )}

                    <p>
                      <span className="font-semibold">البريد الإلكتروني:</span>{" "}
                      {doctor.userId.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Clinic Images Slider */}
              <div className="lg:w-1/2 ">
                {/* Book Appointment Button */}
                {/* <div className="text-center mt-8">
                  <Button
                    onClick={handleBookAppointment}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold"
                    variant="primary"
                  >
                    حجز موعد
                  </Button>
                </div> */}
                <AppointmentBooking
                  doctor={transformDoctorData(doctor)}
                  onBookingConfirm={handleBookingConfirm}
                  onCancel={handleCloseBookingModal}
                  showHeader={true}
                  showCancelButton={false}
                  className="my-custom-styles"
                />
              </div>
            </div>
            {doctor.clinic?.images && doctor.clinic.images.length > 0 && (
              <div className="mt-16">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                  صور العيادة
                </h3>
                <ClinicImageSlider
                  images={doctor.clinic.images.map((imagePath, index) => ({
                    id: `clinic-image-${index}`,
                    src: imagePath.startsWith("/uploads")
                      ? `https://threeiadti-be.onrender.com${imagePath}`
                      : imagePath.startsWith("http")
                      ? imagePath
                      : `https://threeiadti-be.onrender.com/uploads/clinics/${imagePath}`,
                    alt: `صورة من عيادة ${doctor.clinic?.name || "الطبيب"}`,
                    title: `${doctor.clinic?.name || "العيادة"}`,
                    description:
                      doctor.clinic?.description ||
                      `صورة من عيادة ${doctor.clinic?.name || "الطبيب"}`,
                  }))}
                  autoPlay={true}
                  autoPlayInterval={4000}
                  showArrows={true}
                  showDots={true}
                  showCaptions={true}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </div>

        {/* Booking Modal */}
        {/* <BookingModal
          isOpen={isBookingModalOpen}
          onClose={handleCloseBookingModal}
          doctor={doctor}
        /> */}
      </div>
    </MainLayout>
  );
}
