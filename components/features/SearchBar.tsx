"use client";

import React, { useState } from "react";
import { Search, MapPin, ChevronDown } from "lucide-react";
import { MEDICAL_SPECIALTIES, CITIES } from "@/lib/constants";
import Button from "@/components/ui/Button";

interface SearchBarProps {
  onSearch: (query: string, specialty: string, location: string) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, className = "" }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showSpecialtyDropdown, setShowSpecialtyDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  const handleSearch = () => {
    onSearch(searchQuery, selectedSpecialty, selectedLocation);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-soft p-4 ${className}`}>
      <div className="flex items-center space-x-4 space-x-reverse">
        {/* Specialty Filter */}
        <div className="relative">
          <button
            onClick={() => setShowSpecialtyDropdown(!showSpecialtyDropdown)}
            className="flex items-center space-x-2 space-x-reverse bg-gray-50 rounded-lg px-4 py-3 min-w-[120px] hover:bg-gray-100 transition-colors"
          >
            <span className="text-sm">🦷</span>
            <span className="text-sm font-medium text-gray-700">
              {selectedSpecialty || "اسنان"}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {showSpecialtyDropdown && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-medium border border-gray-200 z-10">
              {MEDICAL_SPECIALTIES.map((specialty) => (
                <button
                  key={specialty.id}
                  onClick={() => {
                    setSelectedSpecialty(specialty.name);
                    setShowSpecialtyDropdown(false);
                  }}
                  className="w-full text-right px-4 py-2 hover:bg-gray-50 text-sm"
                >
                  <span className="ml-2">{specialty.icon}</span>
                  {specialty.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="ابحث عن دكتور..."
            className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>

        {/* Location Filter */}
        <div className="relative">
          <button
            onClick={() => setShowLocationDropdown(!showLocationDropdown)}
            className="flex items-center space-x-2 space-x-reverse bg-gray-50 rounded-lg px-4 py-3 min-w-[100px] hover:bg-gray-100 transition-colors"
          >
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              {selectedLocation || "عمان"}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {showLocationDropdown && (
            <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-lg shadow-medium border border-gray-200 z-10">
              {CITIES.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    setSelectedLocation(city);
                    setShowLocationDropdown(false);
                  }}
                  className="w-full text-right px-4 py-2 hover:bg-gray-50 text-sm"
                >
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Button */}
        <Button onClick={handleSearch} className="px-6">
          بحث
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
