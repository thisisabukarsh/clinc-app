"use client";

import React, { useState, useRef } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { DoctorDashboardLayout } from "@/components/dashboard";
import {
  uploadPatientReport,
  ReportUploadRequest,
} from "@/lib/api/services/doctors";
import { useDoctorAppointments } from "@/lib/hooks";
import {
  Upload,
  FileText,
  Search,
  Save,
  User,
  X,
  AlertCircle,
  Download,
  Eye,
} from "lucide-react";
import { toast } from "react-hot-toast";

interface UploadedReport {
  id: string;
  patientName: string;
  reportType: string;
  description: string;
  uploadDate: string;
  fileUrl: string;
}

export default function ReportsPage() {
  const { appointments, loading: appointmentsLoading } =
    useDoctorAppointments();
  const [searchQuery, setSearchQuery] = useState("");
  const [, setSelectedPatient] = useState<string | null>(null);
  const [isUploadingReport, setIsUploadingReport] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [reportForm, setReportForm] = useState({
    patientId: "",
    appointmentId: "",
    reportType: "",
    description: "",
  });

  // Mock uploaded reports for demo
  const [uploadedReports] = useState<UploadedReport[]>([
    {
      id: "1",
      patientName: "محمد جمال",
      reportType: "فحص دم",
      description: "تحليل دم شامل - النتائج طبيعية",
      uploadDate: "2025-01-18",
      fileUrl: "/uploads/reports/blood-test-1.pdf",
    },
    {
      id: "2",
      patientName: "فاطمة أحمد",
      reportType: "أشعة سينية",
      description: "أشعة على الصدر - لا توجد مشاكل",
      uploadDate: "2025-01-17",
      fileUrl: "/uploads/reports/xray-2.pdf",
    },
  ]);

  // Get unique patients from appointments
  interface PatientData {
    id: string;
    name: string;
    email: string;
    appointment: (typeof appointments)[0];
  }

  const uniquePatients: PatientData[] = appointments.reduce(
    (acc: PatientData[], appointment) => {
      const patientId = appointment.patientId.userId.email;
      if (!acc.some((p) => p.id === patientId)) {
        acc.push({
          id: patientId,
          name: appointment.patientId.userId.name,
          email: appointment.patientId.userId.email,
          appointment: appointment,
        });
      }
      return acc;
    },
    []
  );

  const filteredPatients = uniquePatients.filter((patient) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      patient.name.toLowerCase().includes(query) ||
      patient.email.toLowerCase().includes(query)
    );
  });

  const filteredReports = uploadedReports.filter((report) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      report.patientName.toLowerCase().includes(query) ||
      report.reportType.toLowerCase().includes(query) ||
      report.description.toLowerCase().includes(query)
    );
  });

  const handleUploadReport = (patientId: string, appointmentId?: string) => {
    const patient = uniquePatients.find((p) => p.id === patientId);
    if (!patient) return;

    setReportForm({
      patientId: patient.appointment.patientId.userId.email,
      appointmentId: appointmentId || "",
      reportType: "",
      description: "",
    });
    setSelectedPatient(patientId);
    setIsUploadingReport(true);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("حجم الملف كبير جداً. الحد الأقصى 10 ميجابايت");
        return;
      }

      // Check file type
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error(
          "نوع الملف غير مدعوم. يرجى اختيار PDF أو صورة أو مستند Word"
        );
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleSaveReport = async () => {
    if (!reportForm.reportType.trim() || !reportForm.description.trim()) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    if (!selectedFile) {
      toast.error("يرجى اختيار ملف للرفع");
      return;
    }

    try {
      setUploading(true);
      const reportData: ReportUploadRequest = {
        patientId: reportForm.patientId,
        appointmentId: reportForm.appointmentId || undefined,
        reportType: reportForm.reportType,
        description: reportForm.description,
      };

      await uploadPatientReport(reportData, selectedFile);
      toast.success("تم رفع التقرير بنجاح");

      // Reset form
      setReportForm({
        patientId: "",
        appointmentId: "",
        reportType: "",
        description: "",
      });
      setSelectedFile(null);
      setIsUploadingReport(false);
      setSelectedPatient(null);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "فشل في رفع التقرير";
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const reportTypes = [
    "فحص دم",
    "أشعة سينية",
    "أشعة مقطعية",
    "رنين مغناطيسي",
    "تخطيط قلب",
    "موجات صوتية",
    "فحص بول",
    "خزعة",
    "تقرير جراحة",
    "أخرى",
  ];

  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <DoctorDashboardLayout>
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              تقارير المرضى
            </h1>
            <p className="text-gray-600">
              رفع وإدارة التقارير الطبية والفحوصات للمرضى
            </p>
          </div>

          {/* Search */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="البحث عن مريض أو تقرير..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Upload Report Modal */}
          {isUploadingReport && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Upload className="w-5 h-5 ml-2" />
                      رفع تقرير طبي
                    </h3>
                    <button
                      onClick={() => {
                        setIsUploadingReport(false);
                        setSelectedPatient(null);
                        setSelectedFile(null);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Report Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نوع التقرير *
                    </label>
                    <select
                      value={reportForm.reportType}
                      onChange={(e) =>
                        setReportForm({
                          ...reportForm,
                          reportType: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">اختر نوع التقرير</option>
                      {reportTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      وصف التقرير *
                    </label>
                    <textarea
                      value={reportForm.description}
                      onChange={(e) =>
                        setReportForm({
                          ...reportForm,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="أدخل وصف مختصر للتقرير..."
                    />
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ملف التقرير *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      {selectedFile ? (
                        <div className="flex items-center justify-center space-x-2">
                          <FileText className="w-8 h-8 text-green-600" />
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {selectedFile.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)}{" "}
                              ميجابايت
                            </p>
                          </div>
                          <button
                            onClick={() => setSelectedFile(null)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            انقر لاختيار ملف
                          </button>
                          <p className="text-xs text-gray-500 mt-2">
                            PDF, صور, مستندات Word (حد أقصى 10 ميجابايت)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
                  <button
                    onClick={() => {
                      setIsUploadingReport(false);
                      setSelectedPatient(null);
                      setSelectedFile(null);
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    disabled={uploading}
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleSaveReport}
                    disabled={
                      uploading ||
                      !reportForm.reportType.trim() ||
                      !reportForm.description.trim() ||
                      !selectedFile
                    }
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                        جاري الرفع...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 ml-2" />
                        رفع التقرير
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Patients List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Patients for Upload */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  رفع تقرير جديد
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  اختر مريض لرفع تقرير طبي له
                </p>
              </div>

              <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {appointmentsLoading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <span className="text-gray-600">جاري تحميل المرضى...</span>
                  </div>
                ) : filteredPatients.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <User className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>لا توجد مرضى</p>
                  </div>
                ) : (
                  filteredPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">
                              {patient.name}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {patient.email}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleUploadReport(patient.id)}
                          className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                        >
                          <Upload className="w-3 h-3 ml-1" />
                          رفع تقرير
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Uploaded Reports */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  التقارير المرفوعة
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  التقارير الطبية المرفوعة مؤخراً
                </p>
              </div>

              <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {filteredReports.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>لا توجد تقارير مرفوعة</p>
                  </div>
                ) : (
                  filteredReports.map((report) => (
                    <div
                      key={report.id}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <FileText className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-sm font-medium text-gray-900">
                                {report.patientName}
                              </h3>
                              <p className="text-xs text-gray-600">
                                {report.reportType} - {report.description}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(report.uploadDate).toLocaleDateString(
                                  "ar-SA"
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-800">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-blue-400" />
              </div>
              <div className="mr-3">
                <h3 className="text-sm font-medium text-blue-800">
                  إرشادات رفع التقارير
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>الملفات المدعومة: PDF، صور (JPG, PNG)، مستندات Word</li>
                    <li>الحد الأقصى لحجم الملف: 10 ميجابايت</li>
                    <li>تأكد من وضوح التقرير وجودته قبل الرفع</li>
                    <li>أضف وصفاً مفصلاً للتقرير لسهولة البحث لاحقاً</li>
                    <li>جميع التقارير محفوظة بشكل آمن ومشفر</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DoctorDashboardLayout>
    </ProtectedRoute>
  );
}
