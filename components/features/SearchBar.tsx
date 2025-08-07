import React, { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { MEDICAL_SPECIALTIES } from "@/lib/constants";
import DeviceMockup from "../ui/DeviceMockup";

interface SearchBarProps {
  onSearch?: (query: string, specialty: string, location: string) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, className = "" }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Call the onSearch prop if provided
    if (onSearch) {
      onSearch(searchQuery, "", location);
    } else {
      // Default behavior - navigate to doctors page
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (location) params.set("location", location);
      router.push(`/doctors?${params.toString()}`);
    }
  };

  const handleSpecialtyClick = (specialtyId: string) => {
    if (onSearch) {
      onSearch("", specialtyId, location);
    } else {
      router.push(`/doctors?specialty=${specialtyId}`);
    }
  };

  return (
    <>
      {/* Device Mockup - Hidden on mobile, adjusted position for different screens */}
      <div
        className="absolute z-0 -top-[120px] left-[25%] w-[180px] -translate-x-1/2
            2xs:-top-[140px] 2xs:left-[26%] 2xs:w-[200px]
            xs:-top-[160px] xs:left-[27%] xs:w-[220px]
            sm:-top-[200px] sm:left-[28%] sm:w-[300px]
            md:-top-[246px] md:left-[26%] md:w-[400px]
            lg:-top-[307px] lg:left-[25%] lg:w-[500px]
            xl:-top-[307px] xl:left-[23%] xl:w-[500px]"
      >
        <DeviceMockup priority className="w-full opacity-90" />
      </div>
      <div
        className={`bg-white rounded-3xl shadow-xl absolute z-30 bottom-0 -translate-x-1/2 left-1/2 translate-y-full w-full max-w-5xl ${className}`}
        dir="rtl"
      >
        {/* Search Container */}
        <div className="p-4 sm:p-6 relative">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch relative z-40">
            {/* Search Icon Box */}
            <div className="flex items-center justify-center bg-blue-600 rounded-2xl w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0">
              <Search className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>

            {/* Search Form */}
            <form
              onSubmit={handleSearch}
              className="flex-1 flex flex-col sm:flex-row gap-4"
            >
              {/* Location Input */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="حدد موقعك"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full h-12 sm:h-full pr-12 pl-12 text-right rounded-2xl bg-gray-50 border-none text-gray-700 placeholder-gray-400 text-sm sm:text-base"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <MapPin className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Doctor Search Input */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="ابحث عن دكتور"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 sm:h-full pr-12 pl-12 text-right rounded-2xl bg-gray-50 border-none text-gray-700 placeholder-gray-400 text-sm sm:text-base"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </form>
          </div>

          {/* Specialties Section */}
          <div className="mt-6 sm:mt-8">
            <h2 className="text-right text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
              ربما تكون تبحث عن
            </h2>
            <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 hide-scrollbar">
              {MEDICAL_SPECIALTIES.map((specialty) => (
                <button
                  key={specialty.id}
                  onClick={() => handleSpecialtyClick(specialty.id)}
                  className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-colors duration-200"
                >
                  {specialty.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchBar;
