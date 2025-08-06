import React from "react";
import { CardProps } from "@/types";
import { cn } from "@/lib/utils";

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  onClick,
  ...props
}) => {
  const baseClasses =
    "bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden";

  const classes = cn(
    baseClasses,
    onClick &&
      "cursor-pointer hover:shadow-medium transition-shadow duration-200",
    className
  );

  return (
    <div className={classes} onClick={onClick} {...props}>
      {children}
    </div>
  );
};

export default Card;
