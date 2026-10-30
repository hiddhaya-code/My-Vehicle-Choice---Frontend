import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'light' | 'dark';
  className?: string;
}

export const BrandMIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    className={className}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Geometric Outer Shield / Precision Medallion */}
    <circle
      cx="24"
      cy="24"
      r="22"
      fill="#171717"
      stroke="#B9975B"
      strokeWidth="1.75"
    />
    
    {/* Geometric M Architecture + Ascending Road Horizon */}
    {/* Left Vertical Pillar & Apex Descent */}
    <path
      d="M13 35V14.5L20.5 28"
      stroke="#B9975B"
      strokeWidth="2.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    
    {/* Right Vertical Pillar & Apex Descent */}
    <path
      d="M35 35V14.5L27.5 28"
      stroke="#B9975B"
      strokeWidth="2.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Forward Ascending Perspective Road Bed */}
    <path
      d="M17.5 35L22.8 24.5H25.2L30.5 35Z"
      fill="#B9975B"
      fillOpacity="0.2"
      stroke="#B9975B"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />

    {/* Highway Center Median Marker Dashes */}
    <line
      x1="24"
      y1="33"
      x2="24"
      y2="30"
      stroke="#B9975B"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
    <line
      x1="24"
      y1="28"
      x2="24"
      y2="26"
      stroke="#B9975B"
      strokeWidth="1.5"
      strokeLinecap="round"
    />

    {/* Horizon Apex Guide Star */}
    <circle cx="24" cy="18.5" r="1.5" fill="#B9975B" />
  </svg>
);

// Backward compatibility alias for legacy imports
export const BrandCarIcon = BrandMIcon;

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  variant = 'light',
  className = '',
}) => {
  const sizeMap = {
    sm: {
      badge: 'w-8 h-8',
      icon: 'w-8 h-8',
      title: 'text-base',
      subtitle: 'text-[9px]',
    },
    md: {
      badge: 'w-10 h-10',
      icon: 'w-10 h-10',
      title: 'text-xl',
      subtitle: 'text-[10px]',
    },
    lg: {
      badge: 'w-13 h-13',
      icon: 'w-13 h-13',
      title: 'text-2xl',
      subtitle: 'text-xs',
    },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center space-x-3 group ${className}`}>
      {/* Approved Geometric M and Road Medallion */}
      <div
        className={`relative ${currentSize.badge} shrink-0 transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_2px_8px_rgba(185,151,91,0.25)]`}
      >
        <BrandMIcon className={currentSize.icon} />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`${currentSize.title} font-extrabold tracking-tight flex items-center leading-none font-heading ${
              variant === 'dark' ? 'text-white' : 'text-[#171717]'
            }`}
          >
            MyVehicle
            <span className="text-[#B9975B] ml-0.5">Choice</span>
          </span>
          <p
            className={`${currentSize.subtitle} tracking-wider uppercase font-semibold mt-1 font-body ${
              variant === 'dark' ? 'text-stone-400' : 'text-stone-600'
            }`}
          >
            Make Every Vehicle Decision Count.
          </p>
        </div>
      )}
    </div>
  );
};
