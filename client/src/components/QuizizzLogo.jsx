import React from 'react';

/**
 * Logo chữ Q đặc trưng của Quizizz
 * @param {Object} props
 * @param {string} [props.className="w-6 h-6 text-[#d82a7a]"]
 * @param {string} [props.color] - Ghi đè mã màu nếu cần (mặc định thừa hưởng currentColor hoặc #d82a7a)
 */
export default function QuizizzLogo({ className = "w-6 h-6 text-[#d82a7a]", color, size }) {
  const style = size ? { width: size, height: size } : {};
  return (
    <svg 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      {/* Vòng tròn thân chữ Q */}
      <circle 
        cx="13.5" 
        cy="13.5" 
        r="8.5" 
        stroke={color || "currentColor"} 
        strokeWidth="3.6" 
      />
      {/* Dấu chấm đuôi chữ Q */}
      <circle 
        cx="22.5" 
        cy="22.5" 
        r="3.2" 
        fill={color || "currentColor"} 
      />
    </svg>
  );
}
