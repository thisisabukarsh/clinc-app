import React, { useState, useEffect } from "react";
import { SearchField } from "./SearchField";
import { SearchInput } from "./SearchInput";

interface AdvancedSearchBarProps {
  onSearch: (specialty: string, location: string, query: string) => void;
  className?: string;
  initialSpecialty?: string;
  initialLocation?: string;
}

export const AdvancedSearchBar: React.FC<AdvancedSearchBarProps> = ({
  onSearch,
  className = "",
  initialSpecialty = "",
  initialLocation = "",
}) => {
  const [specialty, setSpecialty] = useState(initialSpecialty);
  const [location, setLocation] = useState(initialLocation);
  const [searchQuery, setSearchQuery] = useState("");

  const specialtyOptions = [
    "اسنان",
    "قلب",
    "عيون",
    "جلدية",
    "نسائية",
    "أطفال",
    "عظام",
    "أعصاب",
    "صدرية",
    "باطنية",
  ];

  const locationOptions = [
    "عمان",
    "الزرقاء",
    "إربد",
    "السلط",
    "الكرك",
    "العقبة",
    "الطفيلة",
    "معان",
    "مادبا",
    "جرش",
  ];

  // Immediate search on any change
  useEffect(() => {
    if (specialty || location || searchQuery) {
      onSearch(specialty, location, searchQuery);
    }
  }, [specialty, location, searchQuery, onSearch]);

  const handleSearch = () => {
    onSearch(specialty, location, searchQuery);
  };

  return (
    <div className={` rounded-2xl p-6 ${className}`}>
      <div className="flex flex-col lg:flex-row gap-4 items-stretch">
        {/* Specialty Selection */}
        <div className="flex-1">
          <SearchField
            type="specialty"
            value={specialty}
            placeholder="اختر التخصص"
            onSelect={setSpecialty}
            options={specialtyOptions}
          />
        </div>

        {/* Location Selection */}
        <div className="flex-1">
          <SearchField
            type="location"
            value={location}
            placeholder="اختر المدينة"
            onSelect={setLocation}
            options={locationOptions}
          />
        </div>

        {/* Search Input */}
        <div className="flex-1">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            placeholder="ابحث عن دكتور"
          />
        </div>
      </div>
    </div>
  );
};
