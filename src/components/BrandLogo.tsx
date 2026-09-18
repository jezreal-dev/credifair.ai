import React from 'react';

export const BrandLogo: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 38,
}) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Custom Geometric Fintech Emblem: Credit Shield + Conformal Interval Nodes */}
      <div
        style={{ width: size, height: size }}
        className="relative rounded-xl bg-gradient-to-br from-[#210F60] via-[#2D167B] to-[#14083F] flex items-center justify-center p-2 shadow-[0_4px_16px_rgba(33,15,96,0.18)] border border-[#1DCF9F]/30 shrink-0 group overflow-hidden"
      >
        {/* Subtle radial ambient glow inside logo */}
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#1DCF9F]/30 rounded-full blur-xs" />

        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Outer Shield Path */}
          <path
            d="M16 3L6 7.2V14.8C6 21.2 10.3 27.1 16 29C21.7 27.1 26 21.2 26 14.8V7.2L16 3Z"
            stroke="#1DCF9F"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Conformal Calibration Interval Nodes (Representing lower bound, point risk, and upper bound) */}
          <line
            x1="10"
            y1="16"
            x2="22"
            y2="16"
            stroke="#1DCF9F"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="11" cy="16" r="2" fill="#FFFFFF" />
          <circle cx="16" cy="16" r="2.5" fill="#1DCF9F" />
          <circle cx="21" cy="16" r="2" fill="#FFFFFF" />
          {/* Dynamic upward trend tick */}
          <path
            d="M12 21L15 18L17.5 20.5L20 17"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1.5">
          <span className="text-[17px] font-extrabold tracking-tight text-[#210F60]">
            Credi<span className="text-[#1DCF9F]">Fair</span>
          </span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#210F60] text-[#1DCF9F] tracking-wider">
            AI
          </span>
        </div>
        <span className="text-[10px] font-semibold text-slate-500 tracking-tight mt-0.5">
          Alternative Underwriting
        </span>
      </div>
    </div>
  );
};
