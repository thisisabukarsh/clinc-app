"use client";

import React from "react";
import { Users, CalendarPlus, CalendarCheck } from "lucide-react";

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string | number;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  title,
  value,
  className = "",
}) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-blue-600">{value}</p>
        </div>
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardStats: React.FC = () => {
  const stats = [
    {
      icon: Users,
      title: "إجمالي عدد المرضى",
      value: "72",
      className: "hover:shadow-md transition-shadow duration-200",
    },
    {
      icon: CalendarPlus,
      title: "الحجوزات القادمة",
      value: "41",
      className: "hover:shadow-md transition-shadow duration-200",
    },
    {
      icon: CalendarCheck,
      title: "حجوزات اليوم",
      value: "10",
      className: "hover:shadow-md transition-shadow duration-200",
    },
  ];

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        إحصائيات العيادة
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            icon={stat.icon}
            title={stat.title}
            value={stat.value}
            className={stat.className}
          />
        ))}
      </div>
    </section>
  );
};

export default DashboardStats;
