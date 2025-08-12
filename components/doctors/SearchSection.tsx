import React from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AdvancedSearchBar } from "@/components/features/AdvancedSearchBar";

interface SearchSectionProps {
  className?: string;
  onSearch?: (specialty: string, location: string, query: string) => void;
}

export const SearchSection: React.FC<SearchSectionProps> = ({
  className = "",
  onSearch,
}) => {
  const handleSearch = (specialty: string, location: string, query: string) => {
    // console.log("Search initiated:", { specialty, location, query });
    // onSearch?.(specialty, location, query);
  };

  return (
    <section className={`pt-16 ${className}`}>
      <div className="container mx-auto px-4">
        <SectionHeader
          title="ابحث عن طبيبك المفضل"
          subtitle="اختر التخصص والمدينة للعثور على أفضل الأطباء"
          titleClassName="text-3xl font-bold text-gray-800 mb-4"
          subtitleClassName="text-lg text-gray-600 mb-8"
        />

        <div className="max-w-6xl mx-auto">
          <AdvancedSearchBar
            onSearch={handleSearch}
            initialSpecialty="اسنان"
            initialLocation="عمان"
          />
        </div>
      </div>
    </section>
  );
};
