# Doctor Dashboard Components

This directory contains the components for the doctor dashboard system.

## Components

### DoctorDashboardLayout

The main layout component that provides:

- Responsive sidebar navigation
- Mobile-friendly design with hamburger menu
- Role-based access control
- User authentication status

### DashboardStats

Displays clinic statistics in card format:

- Total patients count
- Upcoming appointments
- Today's appointments

### AppointmentsSection

Shows appointments with:

- Patient information
- Date and time
- Status indicators (completed, upcoming, cancelled)
- Action buttons (view file, mark as examined)

## Usage

```tsx
import {
  DoctorDashboardLayout,
  DashboardStats,
  AppointmentsSection,
} from "@/components/dashboard";

// Wrap your dashboard content
<DoctorDashboardLayout>
  <DashboardStats />
  <AppointmentsSection
    title="Today's Appointments"
    appointments={appointments}
    type="today"
  />
</DoctorDashboardLayout>;
```

## Features

- **Responsive Design**: Works on all screen sizes
- **Arabic RTL Support**: Full right-to-left language support
- **Role-Based Access**: Only doctors can access the dashboard
- **Mock Data Ready**: Includes sample data for development
- **TypeScript**: Fully typed with proper interfaces
- **SOLID Principles**: Follows software engineering best practices

## Navigation Items

- إحصائيات (Statistics) - Dashboard overview
- المواعيد (Appointments) - Appointment management
- ملفات المرضى (Patient Files) - Patient records
- الإعدادات (Settings) - User preferences

## Status Types

- **مكتمل** (Completed) - Green badge
- **قادم** (Upcoming) - Orange badge
- **ملغي** (Cancelled) - Red badge
