import React from "react";
import { ChevronDown, Stethoscope, MapPin } from "lucide-react";

interface SearchFieldProps {
  type: "specialty" | "location";
  value: string;
  placeholder: string;
  onSelect: (value: string) => void;
  options: string[];
  className?: string;
}

export const SearchField: React.FC<SearchFieldProps> = ({
  type,
  value,
  placeholder,
  onSelect,
  options,
  className = "",
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const getIcon = () => {
    switch (type) {
      case "specialty":
        return <Stethoscope className="w-5 h-5 text-blue-600" />;
      case "location":
        return <MapPin className="w-5 h-5 text-blue-600" />;
      default:
        return null;
    }
  };

  const handleSelect = (option: string) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-3 bg-white border border-gray-300 rounded-lg hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      >
        {/* Left side: Chevron + Text */}
        <div className="flex items-center space-x-3 space-x-reverse">
          <ChevronDown className="w-5 h-5 text-blue-600" />
          <span className="text-gray-700 font-medium">
            {value || placeholder}
          </span>
        </div>

        {/* Right side: Icon */}
        {getIcon()}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelect(option)}
              className="w-full px-4 py-3 text-right text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
