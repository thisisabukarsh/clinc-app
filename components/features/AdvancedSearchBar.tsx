import React, { useState, useCallback, useRef } from "react";
import { SearchField } from "./SearchField";
import { SearchInput } from "./SearchInput";

interface AdvancedSearchBarProps {
  onSearch: (query: string, specialty: string, location: string) => void;
  className?: string;
  initialSpecialty?: string;
  initialLocation?: string;
}

// Arabic to English mapping for specialties
const specialtyMapping: Record<string, string> = {
  اسنان: "Dentistry",
  قلب: "Cardiology",
  عيون: "Ophthalmology",
  جلدية: "Dermatology",
  نسائية: "Gynecology",
  أطفال: "Pediatrics",
  عظام: "Orthopedics",
  أعصاب: "Neurology",
  صدرية: "Pulmonology",
  باطنية: "Internal Medicine",
};

// Arabic to English mapping for locations
const locationMapping: Record<string, string> = {
  عمان: "Amman",
  الزرقاء: "Zarqa",
  إربد: "Irbid",
  السلط: "Salt",
  الكرك: "Karak",
  العقبة: "Aqaba",
  الطفيلة: "Tafilah",
  معان: "Maan",
  مادبا: "Madaba",
  جرش: "Jerash",
};

// Convert Arabic values to English for API calls
const convertToEnglish = (
  query: string,
  specialty: string,
  location: string
) => {
  // Treat "عرض الكل" as empty for API calls (clear filters)
  const englishSpecialty =
    specialty === "عرض الكل" ? "" : specialtyMapping[specialty] || specialty;
  const englishLocation =
    location === "عرض الكل" ? "" : locationMapping[location] || location;

  return {
    query,
    specialty: englishSpecialty, // Empty string = no specialty filter
    location: englishLocation, // Empty string = no location filter
  };
};

export const AdvancedSearchBar: React.FC<AdvancedSearchBarProps> = ({
  onSearch,
  className = "",
  initialSpecialty = "",
  initialLocation = "",
}) => {
  const [specialty, setSpecialty] = useState(initialSpecialty);
  const [location, setLocation] = useState(initialLocation);
  const [searchQuery, setSearchQuery] = useState("");

  // Use ref to store the latest onSearch function to avoid infinite loops
  const onSearchRef = useRef(onSearch);
  onSearchRef.current = onSearch;

  // Use ref to store timeout ID
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const specialtyOptions = [
    "",
    "عرض الكل",
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
    "",
    "عرض الكل",
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

  // Debounced search function
  const debouncedSearch = useCallback(
    (query: string, specialty: string, location: string) => {
      // Clear previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        // Always search when any option is selected (including "عرض الكل")
        // Empty values will clear filters and return all doctors
        const englishParams = convertToEnglish(query, specialty, location);
        onSearchRef.current(
          englishParams.query,
          englishParams.specialty,
          englishParams.location
        );
      }, 500); // 500ms delay
    },
    []
  );

  // Handle specialty change
  const handleSpecialtyChange = useCallback(
    (newSpecialty: string) => {
      setSpecialty(newSpecialty);
      debouncedSearch(searchQuery, newSpecialty, location);
    },
    [searchQuery, location, debouncedSearch]
  );

  // Handle location change
  const handleLocationChange = useCallback(
    (newLocation: string) => {
      setLocation(newLocation);
      debouncedSearch(searchQuery, specialty, newLocation);
    },
    [searchQuery, specialty, debouncedSearch]
  );

  // Handle search query change
  const handleSearchQueryChange = useCallback(
    (newQuery: string) => {
      setSearchQuery(newQuery);
      debouncedSearch(newQuery, specialty, location);
    },
    [specialty, location, debouncedSearch]
  );

  // Manual search button
  const handleSearch = useCallback(() => {
    // Always send search request (including when "عرض الكل" is selected)
    const englishParams = convertToEnglish(searchQuery, specialty, location);
    onSearchRef.current(
      englishParams.query,
      englishParams.specialty,
      englishParams.location
    );
  }, [searchQuery, specialty, location]);

  return (
    <div className={` rounded-2xl p-6 ${className}`}>
      <div className="flex flex-col lg:flex-row gap-4 items-stretch">
        {/* Specialty Selection */}
        <div className="flex-1">
          <SearchField
            type="specialty"
            value={specialty}
            placeholder={
              specialty === "عرض الكل" ? "عرض الكل" : specialty || "اختر التخصص"
            }
            onSelect={handleSpecialtyChange}
            options={specialtyOptions}
          />
        </div>

        {/* Location Selection */}
        <div className="flex-1">
          <SearchField
            type="location"
            value={location}
            placeholder={
              location === "عرض الكل" ? "عرض الكل" : location || "اختر المدينة"
            }
            onSelect={handleLocationChange}
            options={locationOptions}
          />
        </div>

        {/* Search Input */}
        <div className="flex-1">
          <SearchInput
            value={searchQuery}
            onChange={handleSearchQueryChange}
            onSearch={handleSearch}
            placeholder="ابحث عن دكتور"
          />
        </div>
      </div>
    </div>
  );
};
