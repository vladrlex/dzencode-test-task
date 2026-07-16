interface IconProps {
  size?: number;
  className?: string;
}

export default function ShieldLogoIcon({ size = 32, className = '' }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" 
        fill="var(--primary-color)"
      />
      <path 
        d="M12 6V18C12 18 16.5 15.5 17.5 12V7.5L12 6Z" 
        fill="rgba(255, 255, 255, 0.3)"
      />
    </svg>
  );
}