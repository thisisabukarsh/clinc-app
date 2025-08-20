"use client";

import React, { useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { DoctorDashboardLayout } from "@/components/dashboard";
import {
  updateDoctorSchedule,
  ScheduleSlot,
  UpdateScheduleRequest,
} from "@/lib/api/services/doctors";
import {
  Clock,
  Plus,
  Trash2,
  Save,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

interface DaySchedule {
  dayOfWeek: number;
  dayName: string;
  isAvailable: boolean;
  slots: ScheduleSlot[];
}

export default function DoctorSchedulePage() {
  const [saving, setSaving] = useState(false);
  const [editingDay, setEditingDay] = useState<number | null>(null);

  const [weekSchedule, setWeekSchedule] = useState<DaySchedule[]>([
    { dayOfWeek: 0, dayName: "الأحد", isAvailable: false, slots: [] },
    {
      dayOfWeek: 1,
      dayName: "الإثنين",
      isAvailable: true,
      slots: [
        { startTime: "09:00", endTime: "12:00", isAvailable: true },
        { startTime: "14:00", endTime: "17:00", isAvailable: true },
      ],
    },
    {
      dayOfWeek: 2,
      dayName: "الثلاثاء",
      isAvailable: true,
      slots: [
        { startTime: "09:00", endTime: "12:00", isAvailable: true },
        { startTime: "14:00", endTime: "17:00", isAvailable: true },
      ],
    },
    {
      dayOfWeek: 3,
      dayName: "الأربعاء",
      isAvailable: true,
      slots: [
        { startTime: "09:00", endTime: "12:00", isAvailable: true },
        { startTime: "14:00", endTime: "17:00", isAvailable: true },
      ],
    },
    {
      dayOfWeek: 4,
      dayName: "الخميس",
      isAvailable: true,
      slots: [
        { startTime: "09:00", endTime: "12:00", isAvailable: true },
        { startTime: "14:00", endTime: "17:00", isAvailable: true },
      ],
    },
    { dayOfWeek: 5, dayName: "الجمعة", isAvailable: false, slots: [] },
    {
      dayOfWeek: 6,
      dayName: "السبت",
      isAvailable: true,
      slots: [{ startTime: "09:00", endTime: "12:00", isAvailable: true }],
    },
  ]);

  const toggleDayAvailability = (dayIndex: number) => {
    setWeekSchedule((prev) =>
      prev.map((day, index) =>
        index === dayIndex
          ? {
              ...day,
              isAvailable: !day.isAvailable,
              slots: !day.isAvailable ? day.slots : [],
            }
          : day
      )
    );
  };

  const addTimeSlot = (dayIndex: number) => {
    const newSlot: ScheduleSlot = {
      startTime: "09:00",
      endTime: "10:00",
      isAvailable: true,
    };

    setWeekSchedule((prev) =>
      prev.map((day, index) =>
        index === dayIndex ? { ...day, slots: [...day.slots, newSlot] } : day
      )
    );
  };

  const updateTimeSlot = (
    dayIndex: number,
    slotIndex: number,
    field: keyof ScheduleSlot,
    value: string | boolean
  ) => {
    setWeekSchedule((prev) =>
      prev.map((day, index) =>
        index === dayIndex
          ? {
              ...day,
              slots: day.slots.map((slot, sIndex) =>
                sIndex === slotIndex ? { ...slot, [field]: value } : slot
              ),
            }
          : day
      )
    );
  };

  const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
    setWeekSchedule((prev) =>
      prev.map((day, index) =>
        index === dayIndex
          ? {
              ...day,
              slots: day.slots.filter((_, sIndex) => sIndex !== slotIndex),
            }
          : day
      )
    );
  };

  const saveSchedule = async (daySchedule: DaySchedule) => {
    try {
      setSaving(true);

      const scheduleData: UpdateScheduleRequest = {
        dayOfWeek: daySchedule.dayOfWeek,
        slots: daySchedule.slots,
        isAvailable: daySchedule.isAvailable,
      };

      await updateDoctorSchedule(scheduleData);
      toast.success(`تم حفظ جدول ${daySchedule.dayName} بنجاح`);
      setEditingDay(null);
    } catch (error) {
      console.error("Failed to save schedule:", error);
      toast.error(`فشل في حفظ جدول ${daySchedule.dayName}`);
    } finally {
      setSaving(false);
    }
  };

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0");
    return `${hour}:00`;
  });

  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <DoctorDashboardLayout>
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              إدارة الجدول الأسبوعي
            </h1>
            <p className="text-gray-600">
              قم بتحديد أوقات العمل والفترات المتاحة للحجز في عيادتك
            </p>
          </div>

          {/* Schedule Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center mb-4">
              <Calendar className="w-6 h-6 text-blue-600 ml-2" />
              <h2 className="text-xl font-semibold text-gray-900">
                نظرة عامة على الأسبوع
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {weekSchedule.map((day) => (
                <div
                  key={day.dayOfWeek}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    day.isAvailable
                      ? "border-green-200 bg-green-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="text-center">
                    <h3 className="font-medium text-gray-900 mb-2">
                      {day.dayName}
                    </h3>
                    <div className="flex items-center justify-center mb-2">
                      {day.isAvailable ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {day.isAvailable ? `${day.slots.length} فترات` : "مغلق"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Schedule Management */}
          <div className="space-y-6">
            {weekSchedule.map((day, dayIndex) => (
              <div
                key={day.dayOfWeek}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-blue-600 ml-2" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {day.dayName}
                    </h3>
                    <div className="mr-4">
                      {day.isAvailable ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 ml-1" />
                          متاح
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <XCircle className="w-3 h-3 ml-1" />
                          مغلق
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleDayAvailability(dayIndex)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        day.isAvailable
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      {day.isAvailable ? "إغلاق اليوم" : "فتح اليوم"}
                    </button>

                    {editingDay === dayIndex ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingDay(null)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                          إلغاء
                        </button>
                        <button
                          onClick={() => saveSchedule(day)}
                          disabled={saving}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                        >
                          {saving ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                              جاري الحفظ...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 ml-2" />
                              حفظ
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingDay(dayIndex)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        تعديل
                      </button>
                    )}
                  </div>
                </div>

                {day.isAvailable && (
                  <div className="space-y-4">
                    {day.slots.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p>لا توجد فترات محددة لهذا اليوم</p>
                        {editingDay === dayIndex && (
                          <button
                            onClick={() => addTimeSlot(dayIndex)}
                            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            <Plus className="w-4 h-4 ml-2" />
                            إضافة فترة
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {day.slots.map((slot, slotIndex) => (
                          <div
                            key={slotIndex}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <label className="text-sm font-medium text-gray-700">
                                  من:
                                </label>
                                <select
                                  value={slot.startTime}
                                  onChange={(e) =>
                                    updateTimeSlot(
                                      dayIndex,
                                      slotIndex,
                                      "startTime",
                                      e.target.value
                                    )
                                  }
                                  disabled={editingDay !== dayIndex}
                                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-100"
                                >
                                  {timeOptions.map((time) => (
                                    <option key={time} value={time}>
                                      {time}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div className="flex items-center space-x-2">
                                <label className="text-sm font-medium text-gray-700">
                                  إلى:
                                </label>
                                <select
                                  value={slot.endTime}
                                  onChange={(e) =>
                                    updateTimeSlot(
                                      dayIndex,
                                      slotIndex,
                                      "endTime",
                                      e.target.value
                                    )
                                  }
                                  disabled={editingDay !== dayIndex}
                                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-100"
                                >
                                  {timeOptions.map((time) => (
                                    <option key={time} value={time}>
                                      {time}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={slot.isAvailable}
                                  onChange={(e) =>
                                    updateTimeSlot(
                                      dayIndex,
                                      slotIndex,
                                      "isAvailable",
                                      e.target.checked
                                    )
                                  }
                                  disabled={editingDay !== dayIndex}
                                  className="ml-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                                />
                                <span className="text-sm text-gray-700">
                                  متاح للحجز
                                </span>
                              </label>
                            </div>

                            {editingDay === dayIndex && (
                              <button
                                onClick={() =>
                                  removeTimeSlot(dayIndex, slotIndex)
                                }
                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}

                        {editingDay === dayIndex && (
                          <button
                            onClick={() => addTimeSlot(dayIndex)}
                            className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors"
                          >
                            <Plus className="w-5 h-5 mx-auto mb-1" />
                            إضافة فترة جديدة
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </DoctorDashboardLayout>
    </ProtectedRoute>
  );
}
