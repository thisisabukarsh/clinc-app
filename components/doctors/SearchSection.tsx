import React from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AdvancedSearchBar } from "@/components/features/AdvancedSearchBar";

interface SearchSectionProps {
  className?: string;
  onSearch: (query: string, specialty: string, location: string) => void;
}

export const SearchSection: React.FC<SearchSectionProps> = ({
  className = "",
  onSearch,
}) => {
  const handleSearch = (query: string, specialty: string, location: string) => {
    // Pass through to parent's onSearch function
    onSearch(query, specialty, location);
  };

  return (
    <section className={`pt-16 ${className}`}>
      <div className="container mx-auto px-4">
        <SectionHeader
          title="ابحث عن طبيبك المفضل"
          subtitle="اختر التخصص والمدينة للعثور على أفضل الأطباء، أو اختر 'عرض الكل' لعرض جميع الأطباء"
          titleClassName="text-3xl font-bold text-gray-800 mb-4"
          subtitleClassName="text-lg text-gray-600 mb-8"
        />

        <div className="max-w-6xl mx-auto">
          <AdvancedSearchBar
            onSearch={handleSearch}
            initialSpecialty=""
            initialLocation=""
          />
        </div>
      </div>
    </section>
  );
};
