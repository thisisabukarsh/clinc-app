"use client";

import React from "react";
import {
  Users,
  CalendarPlus,
  CalendarCheck,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { useDoctorStatistics, useDoctorAppointments } from "@/lib/hooks";

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string | number;
  className?: string;
  loading?: boolean;
  error?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  title,
  value,
  className = "",
  loading = false,
  error = false,
}) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          {loading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          ) : error ? (
            <p className="text-3xl font-bold text-red-600">--</p>
          ) : (
            <p className="text-3xl font-bold text-blue-600">{value}</p>
          )}
        </div>
        <div className="flex-shrink-0">
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              error ? "bg-red-100" : "bg-blue-100"
            }`}
          >
            <Icon
              className={`w-6 h-6 ${error ? "text-red-600" : "text-blue-600"}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardStats: React.FC = () => {
  // Get statistics for current month
  const {
    statistics,
    loading: statsLoading,
    error: statsError,
  } = useDoctorStatistics();

  // Get appointments data
  const {
    todayAppointments,
    upcomingAppointments,
    loading: appointmentsLoading,
    error: appointmentsError,
  } = useDoctorAppointments();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ar-JO", {
      style: "currency",
      currency: "JOD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const stats = [
    {
      icon: CalendarCheck,
      title: "حجوزات اليوم",
      value: todayAppointments.length,
      loading: appointmentsLoading,
      error: !!appointmentsError,
      className: "hover:shadow-md transition-shadow duration-200",
    },
    {
      icon: CalendarPlus,
      title: "الحجوزات القادمة",
      value: upcomingAppointments.length,
      loading: appointmentsLoading,
      error: !!appointmentsError,
      className: "hover:shadow-md transition-shadow duration-200",
    },
    {
      icon: TrendingUp,
      title: "إجمالي المواعيد (الشهر)",
      value: statistics?.totalAppointments || 0,
      loading: statsLoading,
      error: !!statsError,
      className: "hover:shadow-md transition-shadow duration-200",
    },
    {
      icon: Users,
      title: "المواعيد المكتملة",
      value: statistics?.completedAppointments || 0,
      loading: statsLoading,
      error: !!statsError,
      className: "hover:shadow-md transition-shadow duration-200",
    },
    {
      icon: DollarSign,
      title: "الإيرادات (الشهر)",
      value: statistics
        ? formatCurrency(statistics.totalRevenue)
        : formatCurrency(0),
      loading: statsLoading,
      error: !!statsError,
      className: "hover:shadow-md transition-shadow duration-200",
    },
  ];

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        إحصائيات العيادة
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            icon={stat.icon}
            title={stat.title}
            value={stat.value}
            loading={stat.loading}
            error={stat.error}
            className={stat.className}
          />
        ))}
      </div>
    </section>
  );
};

export default DashboardStats;
