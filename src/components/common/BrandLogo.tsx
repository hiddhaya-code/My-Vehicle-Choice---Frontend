import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const BrandCarIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    className={className}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Aerodynamic GT Sports Coupe Silhouette */}
    {/* Roofline, Windshield & Fastback Contour */}
    <path
      d="M5.5 17.5C5.5 17.5 7.2 13.8 11 12.2L16.2 10.3C18.8 9.6 22 10.4 24.2 12.6L27.2 16.2C28.2 17.2 28.5 18.5 27.2 19.2C25.8 19.5 24.5 19.5 24.5 19.5"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Front low-slung splitter and nose */}
    <path
      d="M3.8 18.8C3.8 17.8 4.8 17.5 5.8 17.7L8 18.2H12"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
    {/* Sleek Aerodynamic Tinted Glass */}
    <path
      d="M11.5 12.7L16.5 11C18.5 10.3 20.8 10.9 22.2 12.5L24.5 15.8H11L11.5 12.7Z"
      fill="currentColor"
      fillOpacity="0.25"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    {/* Laser LED Headlight Arc */}
    <path
      d="M24.8 15L27.8 16.8"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    {/* Rear Sport Spoiler Wing */}
    <path
      d="M5 14.5L7.5 15"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    {/* Front Wheel with Alloy Center */}
    <circle
      cx="9"
      cy="19.5"
      r="2.6"
      stroke="currentColor"
      strokeWidth="1.75"
      fill="currentColor"
      fillOpacity="0.12"
    />
    <circle cx="9" cy="19.5" r="0.8" fill="currentColor" />

    {/* Rear Wheel with Alloy Center */}
    <circle
      cx="22"
      cy="19.5"
      r="2.6"
      stroke="currentColor"
      strokeWidth="1.75"
      fill="currentColor"
      fillOpacity="0.12"
    />
    <circle cx="22" cy="19.5" r="0.8" fill="currentColor" />

    {/* Low Aerodynamic Rocker Sill */}
    <path
      d="M11.6 20H19.4"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
  </svg>
);

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const sizeMap = {
    sm: {
      badge: 'w-8 h-8 p-[1.5px]',
      icon: 'w-5 h-5',
      title: 'text-base',
      subtitle: 'text-[9px]',
    },
    md: {
      badge: 'w-11 h-11 p-[2px]',
      icon: 'w-6 h-6',
      title: 'text-xl',
      subtitle: 'text-[10px]',
    },
    lg: {
      badge: 'w-14 h-14 p-[2.5px]',
      icon: 'w-8 h-8',
      title: 'text-2xl',
      subtitle: 'text-xs',
    },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center space-x-3 group ${className}`}>
      {/* Round Shape Logo Badge */}
      <div
        className={`relative ${currentSize.badge} rounded-full bg-gradient-to-tr from-rose-600 via-pink-500 to-rose-400 shadow-[0_0_18px_rgba(244,63,94,0.35)] group-hover:shadow-[0_0_28px_rgba(244,63,94,0.55)] group-hover:scale-105 transition-all duration-300 flex items-center justify-center shrink-0`}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-b from-white via-pink-50/60 to-white flex items-center justify-center text-rose-600 group-hover:bg-gradient-to-br group-hover:from-rose-600 group-hover:to-pink-500 group-hover:text-white transition-all duration-300 shadow-inner">
          <BrandCarIcon className={`${currentSize.icon} transition-transform duration-300 group-hover:scale-110`} />
        </div>
      </div>

      {showText && (
        <div>
          <span className={`${currentSize.title} font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5 leading-none`}>
            MyVehicle<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-pink-500 to-rose-500">Choice</span>
          </span>
          <p className={`${currentSize.subtitle} text-slate-500 tracking-wider uppercase font-semibold mt-1`}>
            Make Every Vehicle Decision Count
          </p>
        </div>
      )}
    </div>
  );
};
