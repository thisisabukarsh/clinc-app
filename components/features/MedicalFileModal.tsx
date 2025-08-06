"use client";

import React from "react";
import { Calendar, User, FileText, Pill } from "lucide-react";
import { Appointment, MedicalFile, Prescription } from "@/types";
import { formatDate } from "@/lib/utils";
import Modal from "@/components/ui/Modal";
import Card from "@/components/ui/Card";

interface MedicalFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
}

const MedicalFileModal: React.FC<MedicalFileModalProps> = ({
  isOpen,
  onClose,
  appointment,
}) => {
  if (!appointment || !appointment.medicalFile) return null;

  const { medicalFile } = appointment;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="الملف الطبي"
      size="lg"
      className="max-h-[90vh] overflow-y-auto"
    >
      <div className="space-y-6">
        {/* Appointment Info */}
        <Card className="p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900">معلومات الموعد</h4>
            <span className="text-sm text-gray-500">
              {formatDate(medicalFile.createdAt)}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2 space-x-reverse">
              <User className="w-4 h-4 text-gray-500" />
              <span>{appointment.doctorName}</span>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>
                {formatDate(appointment.date)} - {appointment.time}
              </span>
            </div>
          </div>
        </Card>

        {/* Diagnosis */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <FileText className="w-5 h-5 ml-2" />
            التشخيص
          </h4>
          <Card className="p-4">
            <p className="text-gray-700 leading-relaxed">
              {medicalFile.diagnosis}
            </p>
          </Card>
        </div>

        {/* Doctor Notes */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">ملاحظات الطبيب</h4>
          <Card className="p-4">
            <p className="text-gray-700 leading-relaxed">{medicalFile.notes}</p>
          </Card>
        </div>

        {/* Prescription */}
        {medicalFile.prescription && medicalFile.prescription.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Pill className="w-5 h-5 ml-2" />
              الوصفة الطبية
            </h4>
            <div className="space-y-3">
              {medicalFile.prescription.map((prescription, index) => (
                <Card key={prescription.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-gray-900">
                      {index + 1}. {prescription.name}
                    </h5>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">الجرعة:</span>{" "}
                      {prescription.dosage}
                    </div>
                    <div>
                      <span className="font-medium">التكرار:</span>{" "}
                      {prescription.frequency}
                    </div>
                    <div>
                      <span className="font-medium">المدة:</span>{" "}
                      {prescription.duration}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Important Notes */}
        <Card className="p-4 bg-yellow-50 border border-yellow-200">
          <div className="flex items-start space-x-2 space-x-reverse">
            <div className="text-yellow-600 mt-1">⚠️</div>
            <div>
              <h5 className="font-medium text-yellow-800 mb-1">تعليمات مهمة</h5>
              <p className="text-sm text-yellow-700">
                يرجى اتباع تعليمات الطبيب بدقة وعدم التوقف عن تناول الأدوية دون
                استشارة طبية. في حالة ظهور أي أعراض جانبية، يرجى التواصل مع
                الطبيب فوراً.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Modal>
  );
};

export default MedicalFileModal;
