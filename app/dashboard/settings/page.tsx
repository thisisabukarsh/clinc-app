"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useAuth } from "@/lib/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { DoctorDashboardLayout } from "@/components/dashboard";
import { useDoctorProfile, useDoctorClinic } from "@/lib/hooks";
import { toast } from "react-hot-toast";
import {
  Edit,
  Upload,
  Save,
  Camera,
  Building2,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  User,
  Shield,
  Bell,
  Calendar,
  Phone,
  Mail,
  Eye,
  EyeOff,
} from "lucide-react";

export default function DoctorSettingsPage() {
  const { user } = useAuth();
  const {
    profile,
    loading: profileLoading,
    updateProfile,
    updating,
  } = useDoctorProfile();
  const {
    clinicInfo,
    loading: clinicLoading,
    updateClinic,
    submitForApproval,
    updating: clinicUpdating,
    submitting: clinicSubmitting,
  } = useDoctorClinic();

  const [activeTab, setActiveTab] = useState<
    "profile" | "clinic" | "account" | "schedule"
  >("profile");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingClinic, setIsEditingClinic] = useState(false);
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [doctorPhoto, setDoctorPhoto] = useState<File | null>(null);
  const [clinicImages, setClinicImages] = useState<File[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  const doctorPhotoRef = useRef<HTMLInputElement>(null);
  const clinicImagesRef = useRef<HTMLInputElement>(null);

  const [profileFormData, setProfileFormData] = useState({
    specialty: profile?.specialty || "",
    location: profile?.location || "",
    fee: profile?.fee || 0,
  });

  const [clinicFormData, setClinicFormData] = useState({
    name: clinicInfo?.name || "",
    address: clinicInfo?.address || "",
    phone: clinicInfo?.phone || "",
    description: clinicInfo?.description || "",
  });

  const [accountFormData, setAccountFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [scheduleFormData, setScheduleFormData] = useState({
    workingDays: ["sunday", "monday", "tuesday", "wednesday", "thursday"],
    startTime: "09:00",
    endTime: "17:00",
    breakStartTime: "12:00",
    breakEndTime: "13:00",
    appointmentDuration: 30,
    maxAdvanceBookingDays: 30,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    newAppointmentAlert: true,
    cancellationAlert: true,
  });

  // Update form data when profile/clinic data loads
  React.useEffect(() => {
    if (profile) {
      setProfileFormData({
        specialty: profile.specialty || "",
        location: profile.location || "",
        fee: profile.fee || 0,
      });
    }
  }, [profile]);

  React.useEffect(() => {
    if (clinicInfo) {
      setClinicFormData({
        name: clinicInfo.name || "",
        address: clinicInfo.address || "",
        phone: clinicInfo.phone || "",
        description: clinicInfo.description || "",
      });
    }
  }, [clinicInfo]);

  const handleProfileInputChange = (
    field: keyof typeof profileFormData,
    value: string | number
  ) => {
    setProfileFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClinicInputChange = (
    field: keyof typeof clinicFormData,
    value: string
  ) => {
    setClinicFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAccountInputChange = (
    field: keyof typeof accountFormData,
    value: string
  ) => {
    setAccountFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleScheduleInputChange = (
    field: keyof typeof scheduleFormData,
    value: string | number | string[]
  ) => {
    setScheduleFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNotificationChange = (
    field: keyof typeof notificationSettings,
    value: boolean
  ) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile(profileFormData, doctorPhoto || undefined);
      setIsEditingProfile(false);
      setDoctorPhoto(null);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleSaveClinic = async () => {
    try {
      if (clinicInfo?.status === "approved") {
        await updateClinic(
          clinicFormData,
          clinicImages.length > 0 ? clinicImages : undefined
        );
      } else {
        await submitForApproval(
          clinicFormData,
          clinicImages.length > 0 ? clinicImages : undefined
        );
      }
      setIsEditingClinic(false);
      setClinicImages([]);
    } catch (error) {
      console.error("Failed to save clinic:", error);
    }
  };

  const handleSaveAccount = async () => {
    try {
      // Validate password confirmation
      if (
        accountFormData.newPassword &&
        accountFormData.newPassword !== accountFormData.confirmPassword
      ) {
        toast.error("كلمات المرور غير متطابقة");
        return;
      }

      // Validate password strength
      if (
        accountFormData.newPassword &&
        accountFormData.newPassword.length < 6
      ) {
        toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
        return;
      }

      // Here you would call an API to update account information
      // For now, we'll just show a success message
      toast.success("تم تحديث معلومات الحساب بنجاح");
      setIsEditingAccount(false);

      // Clear password fields
      setAccountFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      console.error("Failed to save account:", error);
      toast.error("فشل في تحديث معلومات الحساب");
    }
  };

  const handleSaveSchedule = async () => {
    try {
      // Here you would call an API to update schedule settings
      // For now, we'll just show a success message
      toast.success("تم تحديث إعدادات المواعيد بنجاح");
      setIsEditingSchedule(false);
    } catch (error) {
      console.error("Failed to save schedule:", error);
      toast.error("فشل في تحديث إعدادات المواعيد");
    }
  };

  const handleDoctorPhotoSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setDoctorPhoto(file);
    }
  };

  const handleClinicImagesSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setClinicImages((prev) => [...prev, ...files].slice(0, 5)); // Max 5 images
    }
  };

  const removeClinicImage = (index: number) => {
    setClinicImages((prev) => prev.filter((_, i) => i !== index));
  };

  const getClinicStatusBadge = () => {
    if (!clinicInfo?.status) return null;

    const statusConfig = {
      pending: {
        icon: Clock,
        text: "قيد المراجعة",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
        iconColor: "text-yellow-600",
      },
      approved: {
        icon: CheckCircle,
        text: "معتمدة",
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        iconColor: "text-green-600",
      },
      rejected: {
        icon: XCircle,
        text: "مرفوضة",
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        iconColor: "text-red-600",
      },
    };

    const config = statusConfig[clinicInfo.status];
    const Icon = config.icon;

    return (
      <div
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.textColor}`}
      >
        <Icon className={`w-4 h-4 mr-1 ${config.iconColor}`} />
        {config.text}
      </div>
    );
  };

  const loading = profileLoading || clinicLoading;
  const saving = updating || clinicUpdating || clinicSubmitting;

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["doctor"]}>
        <DoctorDashboardLayout>
          <div className="p-6 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </DoctorDashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <DoctorDashboardLayout>
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">الإعدادات</h1>
            <p className="text-gray-600">إدارة معلومات الطبيب والعيادة</p>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 overflow-x-auto" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("profile")}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === "profile"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center">
                  <User className="w-5 h-5 ml-2" />
                  الملف الشخصي
                </div>
              </button>
              <button
                onClick={() => setActiveTab("clinic")}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === "clinic"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center">
                  <Building2 className="w-5 h-5 ml-2" />
                  العيادة
                  {getClinicStatusBadge() && (
                    <span className="mr-2">{getClinicStatusBadge()}</span>
                  )}
                </div>
              </button>
              <button
                onClick={() => setActiveTab("schedule")}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === "schedule"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 ml-2" />
                  مواعيد العمل
                </div>
              </button>
              <button
                onClick={() => setActiveTab("account")}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === "account"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center">
                  <Shield className="w-5 h-5 ml-2" />
                  إعدادات الحساب
                </div>
              </button>
            </nav>
          </div>

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Profile Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    معلومات الطبيب
                  </h2>
                  {!isEditingProfile && (
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Edit className="w-4 h-4 ml-2" />
                      تعديل
                    </button>
                  )}
                </div>

                {/* Doctor Information Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      إسم الطبيب
                    </label>
                    <input
                      type="text"
                      value={user?.name || ""}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      يمكن تغيير الاسم من إعدادات الحساب
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الاختصاص
                    </label>
                    <input
                      type="text"
                      value={profileFormData.specialty}
                      onChange={(e) =>
                        handleProfileInputChange("specialty", e.target.value)
                      }
                      disabled={!isEditingProfile}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      placeholder="مثال: طب عام، طب أسنان، طب عيون"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الموقع
                    </label>
                    <input
                      type="text"
                      value={profileFormData.location}
                      onChange={(e) =>
                        handleProfileInputChange("location", e.target.value)
                      }
                      disabled={!isEditingProfile}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      placeholder="المدينة أو المنطقة"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      سعر الكشفية (دينار أردني)
                    </label>
                    <input
                      type="number"
                      value={profileFormData.fee}
                      onChange={(e) =>
                        handleProfileInputChange(
                          "fee",
                          parseInt(e.target.value) || 0
                        )
                      }
                      disabled={!isEditingProfile}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      min="0"
                    />
                  </div>
                </div>

                {/* Doctor Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    صورة الطبيب
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      {profile?.photo ? (
                        <Image
                          src={profile.photo}
                          alt="Doctor"
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Camera className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    {isEditingProfile && (
                      <div>
                        <input
                          ref={doctorPhotoRef}
                          type="file"
                          accept="image/*"
                          onChange={handleDoctorPhotoSelect}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => doctorPhotoRef.current?.click()}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          اختيار صورة
                        </button>
                        {doctorPhoto && (
                          <p className="text-sm text-green-600 mt-1">
                            تم اختيار: {doctorPhoto.name}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons for Profile */}
                {isEditingProfile && (
                  <div className="flex justify-end space-x-4 pt-6 border-t">
                    <button
                      onClick={() => {
                        setIsEditingProfile(false);
                        setDoctorPhoto(null);
                        // Reset form data
                        if (profile) {
                          setProfileFormData({
                            specialty: profile.specialty || "",
                            location: profile.location || "",
                            fee: profile.fee || 0,
                          });
                        }
                      }}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      disabled={saving}
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                          جاري الحفظ...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 ml-2" />
                          حفظ التعديلات
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Clinic Tab */}
          {activeTab === "clinic" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Clinic Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      معلومات العيادة
                    </h2>
                    {getClinicStatusBadge()}
                  </div>
                  {!isEditingClinic && (
                    <button
                      onClick={() => setIsEditingClinic(true)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Edit className="w-4 h-4 ml-2" />
                      {clinicInfo?.status === "approved"
                        ? "تعديل"
                        : "إضافة/تعديل"}
                    </button>
                  )}
                </div>

                {/* Clinic Status Info */}
                {clinicInfo?.status === "rejected" &&
                  clinicInfo.rejectionReason && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-600 ml-2" />
                        <h3 className="text-sm font-medium text-red-800">
                          سبب الرفض:
                        </h3>
                      </div>
                      <p className="text-sm text-red-700 mt-1">
                        {clinicInfo.rejectionReason}
                      </p>
                    </div>
                  )}

                {clinicInfo?.status === "pending" && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-yellow-600 ml-2" />
                      <h3 className="text-sm font-medium text-yellow-800">
                        العيادة قيد المراجعة
                      </h3>
                    </div>
                    <p className="text-sm text-yellow-700 mt-1">
                      تم إرسال معلومات العيادة للمراجعة. سيتم إعلامك عند
                      الموافقة أو الرفض.
                    </p>
                  </div>
                )}

                {/* Clinic Information Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      اسم العيادة
                    </label>
                    <input
                      type="text"
                      value={clinicFormData.name}
                      onChange={(e) =>
                        handleClinicInputChange("name", e.target.value)
                      }
                      disabled={!isEditingClinic}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      placeholder="اسم العيادة"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      value={clinicFormData.phone}
                      onChange={(e) =>
                        handleClinicInputChange("phone", e.target.value)
                      }
                      disabled={!isEditingClinic}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      placeholder="رقم هاتف العيادة"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      العنوان
                    </label>
                    <input
                      type="text"
                      value={clinicFormData.address}
                      onChange={(e) =>
                        handleClinicInputChange("address", e.target.value)
                      }
                      disabled={!isEditingClinic}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      placeholder="العنوان الكامل للعيادة"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      وصف العيادة
                    </label>
                    <textarea
                      value={clinicFormData.description}
                      onChange={(e) =>
                        handleClinicInputChange("description", e.target.value)
                      }
                      disabled={!isEditingClinic}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      placeholder="وصف مختصر عن العيادة والخدمات المقدمة"
                    />
                  </div>
                </div>

                {/* Clinic Images */}
                {isEditingClinic && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      صور العيادة (حد أقصى 5 صور)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {/* Existing clinic images */}
                      {clinicInfo?.images?.map((image, index) => (
                        <div key={index} className="relative">
                          <Image
                            src={image}
                            alt={`Clinic ${index + 1}`}
                            width={200}
                            height={128}
                            className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                          />
                          <div className="absolute top-2 right-2 bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                            محفوظة
                          </div>
                        </div>
                      ))}

                      {/* New selected images */}
                      {clinicImages.map((image, index) => (
                        <div key={`new-${index}`} className="relative">
                          <Image
                            src={URL.createObjectURL(image)}
                            alt={`New ${index + 1}`}
                            width={200}
                            height={128}
                            className="w-full h-32 object-cover rounded-lg border-2 border-blue-300"
                          />
                          <button
                            onClick={() => removeClinicImage(index)}
                            className="absolute top-2 right-2 bg-red-100 text-red-800 rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-200"
                          >
                            ×
                          </button>
                          <div className="absolute bottom-2 left-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            جديدة
                          </div>
                        </div>
                      ))}

                      {/* Upload new image button */}
                      {(clinicInfo?.images?.length || 0) + clinicImages.length <
                        5 && (
                        <div
                          onClick={() => clinicImagesRef.current?.click()}
                          className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                        >
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">إضافة صورة</p>
                        </div>
                      )}
                    </div>
                    <input
                      ref={clinicImagesRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleClinicImagesSelect}
                      className="hidden"
                    />
                  </div>
                )}

                {/* Existing clinic images (view mode) */}
                {!isEditingClinic &&
                  clinicInfo?.images &&
                  clinicInfo.images.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        صور العيادة
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {clinicInfo.images.map((image, index) => (
                          <Image
                            key={index}
                            src={image}
                            alt={`Clinic ${index + 1}`}
                            width={200}
                            height={128}
                            className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                {/* Action Buttons for Clinic */}
                {isEditingClinic && (
                  <div className="flex justify-end space-x-4 pt-6 border-t">
                    <button
                      onClick={() => {
                        setIsEditingClinic(false);
                        setClinicImages([]);
                        // Reset form data
                        if (clinicInfo) {
                          setClinicFormData({
                            name: clinicInfo.name || "",
                            address: clinicInfo.address || "",
                            phone: clinicInfo.phone || "",
                            description: clinicInfo.description || "",
                          });
                        }
                      }}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      disabled={saving}
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={handleSaveClinic}
                      disabled={
                        saving ||
                        !clinicFormData.name ||
                        !clinicFormData.address
                      }
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                          {clinicInfo?.status === "approved"
                            ? "جاري التحديث..."
                            : "جاري الإرسال..."}
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 ml-2" />
                          {clinicInfo?.status === "approved"
                            ? "حفظ التعديلات"
                            : "إرسال للمراجعة"}
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Schedule Tab */}
          {activeTab === "schedule" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Schedule Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    إعدادات مواعيد العمل
                  </h2>
                  {!isEditingSchedule && (
                    <button
                      onClick={() => setIsEditingSchedule(true)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Edit className="w-4 h-4 ml-2" />
                      تعديل
                    </button>
                  )}
                </div>

                {/* Working Days */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    أيام العمل
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { key: "sunday", label: "الأحد" },
                      { key: "monday", label: "الاثنين" },
                      { key: "tuesday", label: "الثلاثاء" },
                      { key: "wednesday", label: "الأربعاء" },
                      { key: "thursday", label: "الخميس" },
                      { key: "friday", label: "الجمعة" },
                      { key: "saturday", label: "السبت" },
                    ].map((day) => (
                      <label
                        key={day.key}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={scheduleFormData.workingDays.includes(
                            day.key
                          )}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleScheduleInputChange("workingDays", [
                                ...scheduleFormData.workingDays,
                                day.key,
                              ]);
                            } else {
                              handleScheduleInputChange(
                                "workingDays",
                                scheduleFormData.workingDays.filter(
                                  (d) => d !== day.key
                                )
                              );
                            }
                          }}
                          disabled={!isEditingSchedule}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50"
                        />
                        <span className="text-sm text-gray-700">
                          {day.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Working Hours */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      بداية العمل
                    </label>
                    <input
                      type="time"
                      value={scheduleFormData.startTime}
                      onChange={(e) =>
                        handleScheduleInputChange("startTime", e.target.value)
                      }
                      disabled={!isEditingSchedule}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نهاية العمل
                    </label>
                    <input
                      type="time"
                      value={scheduleFormData.endTime}
                      onChange={(e) =>
                        handleScheduleInputChange("endTime", e.target.value)
                      }
                      disabled={!isEditingSchedule}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                </div>

                {/* Break Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      بداية الاستراحة
                    </label>
                    <input
                      type="time"
                      value={scheduleFormData.breakStartTime}
                      onChange={(e) =>
                        handleScheduleInputChange(
                          "breakStartTime",
                          e.target.value
                        )
                      }
                      disabled={!isEditingSchedule}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نهاية الاستراحة
                    </label>
                    <input
                      type="time"
                      value={scheduleFormData.breakEndTime}
                      onChange={(e) =>
                        handleScheduleInputChange(
                          "breakEndTime",
                          e.target.value
                        )
                      }
                      disabled={!isEditingSchedule}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                </div>

                {/* Appointment Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      مدة الموعد (بالدقائق)
                    </label>
                    <select
                      value={scheduleFormData.appointmentDuration}
                      onChange={(e) =>
                        handleScheduleInputChange(
                          "appointmentDuration",
                          parseInt(e.target.value)
                        )
                      }
                      disabled={!isEditingSchedule}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    >
                      <option value={15}>15 دقيقة</option>
                      <option value={30}>30 دقيقة</option>
                      <option value={45}>45 دقيقة</option>
                      <option value={60}>60 دقيقة</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      أقصى مدة للحجز المسبق (بالأيام)
                    </label>
                    <input
                      type="number"
                      value={scheduleFormData.maxAdvanceBookingDays}
                      onChange={(e) =>
                        handleScheduleInputChange(
                          "maxAdvanceBookingDays",
                          parseInt(e.target.value) || 30
                        )
                      }
                      disabled={!isEditingSchedule}
                      min="1"
                      max="90"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                </div>

                {/* Action Buttons for Schedule */}
                {isEditingSchedule && (
                  <div className="flex justify-end space-x-4 pt-6 border-t">
                    <button
                      onClick={() => setIsEditingSchedule(false)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      disabled={saving}
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={handleSaveSchedule}
                      disabled={saving}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                          جاري الحفظ...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 ml-2" />
                          حفظ الإعدادات
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Account Tab */}
          {activeTab === "account" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Account Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    إعدادات الحساب
                  </h2>
                  {!isEditingAccount && (
                    <button
                      onClick={() => setIsEditingAccount(true)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Edit className="w-4 h-4 ml-2" />
                      تعديل
                    </button>
                  )}
                </div>

                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    المعلومات الشخصية
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center">
                          <User className="w-4 h-4 ml-1" />
                          الاسم الكامل
                        </div>
                      </label>
                      <input
                        type="text"
                        value={accountFormData.name}
                        onChange={(e) =>
                          handleAccountInputChange("name", e.target.value)
                        }
                        disabled={!isEditingAccount}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 ml-1" />
                          البريد الإلكتروني
                        </div>
                      </label>
                      <input
                        type="email"
                        value={accountFormData.email}
                        onChange={(e) =>
                          handleAccountInputChange("email", e.target.value)
                        }
                        disabled={!isEditingAccount}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 ml-1" />
                          رقم الهاتف
                        </div>
                      </label>
                      <input
                        type="tel"
                        value={accountFormData.phone}
                        onChange={(e) =>
                          handleAccountInputChange("phone", e.target.value)
                        }
                        disabled={!isEditingAccount}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Password Change */}
                {isEditingAccount && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      تغيير كلمة المرور
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          كلمة المرور الحالية
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={accountFormData.currentPassword}
                            onChange={(e) =>
                              handleAccountInputChange(
                                "currentPassword",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="أدخل كلمة المرور الحالية"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          كلمة المرور الجديدة
                        </label>
                        <input
                          type="password"
                          value={accountFormData.newPassword}
                          onChange={(e) =>
                            handleAccountInputChange(
                              "newPassword",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="أدخل كلمة المرور الجديدة"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          تأكيد كلمة المرور الجديدة
                        </label>
                        <input
                          type="password"
                          value={accountFormData.confirmPassword}
                          onChange={(e) =>
                            handleAccountInputChange(
                              "confirmPassword",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="أعد إدخال كلمة المرور الجديدة"
                        />
                      </div>
                      {accountFormData.newPassword &&
                        accountFormData.confirmPassword &&
                        accountFormData.newPassword !==
                          accountFormData.confirmPassword && (
                          <p className="text-sm text-red-600">
                            كلمات المرور غير متطابقة
                          </p>
                        )}
                    </div>
                  </div>
                )}

                {/* Notification Settings */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    إعدادات التنبيهات
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        key: "emailNotifications",
                        label: "تنبيهات البريد الإلكتروني",
                        icon: Mail,
                      },
                      {
                        key: "appointmentReminders",
                        label: "تذكير بالمواعيد",
                        icon: Bell,
                      },
                      {
                        key: "newAppointmentAlert",
                        label: "تنبيه عند حجز موعد جديد",
                        icon: Calendar,
                      },
                      {
                        key: "cancellationAlert",
                        label: "تنبيه عند إلغاء موعد",
                        icon: XCircle,
                      },
                    ].map((setting) => {
                      const Icon = setting.icon;
                      return (
                        <label
                          key={setting.key}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center">
                            <Icon className="w-5 h-5 text-gray-400 ml-3" />
                            <span className="text-sm font-medium text-gray-700">
                              {setting.label}
                            </span>
                          </div>
                          <input
                            type="checkbox"
                            checked={
                              notificationSettings[
                                setting.key as keyof typeof notificationSettings
                              ]
                            }
                            onChange={(e) =>
                              handleNotificationChange(
                                setting.key as keyof typeof notificationSettings,
                                e.target.checked
                              )
                            }
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Action Buttons for Account */}
                {isEditingAccount && (
                  <div className="flex justify-end space-x-4 pt-6 border-t">
                    <button
                      onClick={() => {
                        setIsEditingAccount(false);
                        // Reset form data
                        setAccountFormData({
                          name: user?.name || "",
                          email: user?.email || "",
                          phone: user?.phone || "",
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                      }}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      disabled={saving}
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={handleSaveAccount}
                      disabled={saving}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                          جاري الحفظ...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 ml-2" />
                          حفظ التعديلات
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DoctorDashboardLayout>
    </ProtectedRoute>
  );
}
