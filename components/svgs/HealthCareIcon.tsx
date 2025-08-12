import React from "react";

interface HealthCareIconProps {
  className?: string;
  width?: number;
  height?: number;
  fill?: string;
}

const HealthCareIcon: React.FC<HealthCareIconProps> = ({
  className = "",
  width = 241,
  height = 240,
  fill = "#FF6969",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 240 240"
      fill="none"
      className={className}
    >
      <path
        d="M120 100V160M90 130H150M23.51 132.14C19.98 109.16 18.21 97.68 22.56 87.49C26.9 77.31 36.54 70.34 55.81 56.41L70.21 46C94.18 28.67 106.17 20 120 20C133.83 20 145.82 28.67 169.79 46L184.19 56.41C203.46 70.34 213.09 77.31 217.44 87.49C221.78 97.68 220.02 109.16 216.49 132.13L213.48 151.73C208.48 184.29 205.97 200.57 194.29 210.29C182.61 220.01 165.54 220 131.39 220H108.6C74.45 220 57.38 220 45.7 210.29C34.02 200.57 31.52 184.29 26.51 151.72L23.51 132.14Z"
        stroke={fill}
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default HealthCareIcon;
