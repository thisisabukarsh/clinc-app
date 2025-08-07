import React from "react";

interface CarouselDotsProps {
  totalPages: number;
  currentPage: number;
  onPageChange?: (page: number) => void;
  className?: string;
  activeDotClassName?: string;
  inactiveDotClassName?: string;
}

export const CarouselDots: React.FC<CarouselDotsProps> = ({
  totalPages,
  currentPage,
  onPageChange,
  className = "",
  activeDotClassName = "bg-blue-600",
  inactiveDotClassName = "bg-gray-300",
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex justify-center items-center space-x-2 ${className}`}>
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          onClick={() => onPageChange?.(index)}
          className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-110 ${
            index === currentPage ? activeDotClassName : inactiveDotClassName
          }`}
          aria-label={`Go to page ${index + 1}`}
        />
      ))}
    </div>
  );
};
