# Clinec App - Medical Appointment Booking Platform

A modern medical appointment booking platform built with Next.js, TypeScript, and Tailwind CSS.

## 🏗️ Project Structure

```
clinec-app/
├── app/                    # Next.js app directory
├── components/            # Reusable React components
│   ├── features/         # Feature-specific components
│   ├── layout/           # Layout components
│   ├── sections/         # Page sections
│   ├── ui/              # UI components
│   └── svgs/            # SVG components
├── lib/                  # Utilities and hooks
├── types/               # TypeScript type definitions
└── public/              # Static assets
```

## 🎯 Key Features

### Medical Specialties Section

- **Responsive Design**: Adapts to different screen sizes
- **Pagination**: Carousel dots for navigation through specialties
- **Reusable Components**: Built with SOLID principles
- **Type Safety**: Full TypeScript support

### Components Overview

#### `MedicalSpecialtiesSection`

Main section component that displays medical specialties with pagination.

```tsx
<MedicalSpecialtiesSection
  specialties={medicalSpecialties}
  onSpecialtyClick={handleSpecialtyClick}
/>
```

#### `MedicalSpecialtyCard`

Individual specialty card component with hover effects.

```tsx
<MedicalSpecialtyCard specialty={specialty} onClick={handleClick} />
```

#### `SectionHeader`

Reusable header component for sections.

```tsx
<SectionHeader
  title="التخصصات الطبية المتوفرة"
  subtitle="نوفر مجموعة شاملة من التخصصات الطبية"
/>
```

#### `CarouselDots`

Pagination dots component.

```tsx
<CarouselDots
  totalPages={totalPages}
  currentPage={currentPage}
  onPageChange={handlePageChange}
/>
```

## 🎨 Design System

### Colors

- Primary: Blue (#3B82F6)
- Secondary: Gray (#6B7280)
- Background: White (#FFFFFF)
- Hover: Light blue (#EFF6FF)

### Typography

- Arabic text support
- Responsive font sizes
- Consistent spacing

## 🚀 Getting Started

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Run development server**:

   ```bash
   npm run dev
   ```

3. **Open browser**:
   Navigate to `http://localhost:3000`

## 📱 Responsive Design

The medical specialties section is fully responsive:

- **Mobile**: 1 column layout
- **Tablet**: 2 column layout
- **Desktop**: 5 column layout

## 🔧 Customization

### Adding New Specialties

Update the `medicalSpecialties` array in `lib/mockData.ts`:

```tsx
{
  id: 'unique-id',
  name: 'Specialty Name',
  nameAr: 'اسم التخصص',
  iconUrl: '/api/specialties/icon.png',
  slug: 'specialty-slug'
}
```

### Styling

All components use Tailwind CSS classes and can be customized via:

- `className` props
- Custom CSS classes
- Tailwind configuration

## 🏥 Medical Specialties

Currently supported specialties:

- Dermatology (عيادة جلدية)
- Dentistry (عيادة اسنان)
- Internal Medicine (عيادة باطنية)
- Cardiology (عيادة قلبية)
- ENT (عيادة أذن وحنجرة)
- Orthopedics (عيادة عظام)
- Neurology (عيادة عصبية)
- Ophthalmology (عيادة عيون)
- Pediatrics (عيادة أطفال)
- Gynecology (عيادة نسائية)

## 🔄 State Management

Uses custom hooks for clean state management:

- `useMedicalSpecialties`: Manages pagination and specialty data
- Context API for global state
- Local state for component-specific data

## 📦 Dependencies

- **Next.js 14**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **React**: UI library
- **Next/Image**: Optimized images

## 🎯 Best Practices

- ✅ SOLID principles
- ✅ TypeScript for type safety
- ✅ Responsive design
- ✅ Accessibility (ARIA labels)
- ✅ Performance optimization
- ✅ Clean component structure
- ✅ Reusable components
- ✅ Custom hooks for logic separation

## 📄 License

MIT License - see LICENSE file for details.
