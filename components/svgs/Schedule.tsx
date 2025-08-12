import React from "react";

interface ScheduleProps {
  className?: string;
  width?: number;
  height?: number;
  fill?: string;
}

const Schedule: React.FC<ScheduleProps> = ({
  className = "",
  width = 240,
  height = 240,
  fill = "#93FFA0",
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
        d="M90 200H60C49.3913 200 39.2172 195.786 31.7157 188.284C24.2143 180.783 20 170.609 20 160V70C20 59.3913 24.2143 49.2172 31.7157 41.7157C39.2172 34.2143 49.3913 30 60 30H170C180.609 30 190.783 34.2143 198.284 41.7157C205.786 49.2172 210 59.3913 210 70V100M80 20V40M150 20V40M20 80H210M185 156.43L170 171.43"
        stroke={fill}
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M170 220C197.614 220 220 197.614 220 170C220 142.386 197.614 120 170 120C142.386 120 120 142.386 120 170C120 197.614 142.386 220 170 220Z"
        stroke={fill}
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Schedule;
