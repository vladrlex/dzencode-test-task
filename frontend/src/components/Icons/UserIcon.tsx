interface IconProps {
  size?: number;
  className?: string;
}

export default function UserIcon({ size = 24, className = '' }: IconProps) {
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
        d="M20 21C20 19.6044 20 18.9067 19.7071 18.358C19.3512 17.6908 18.7773 17.1706 18.0772 16.8804C17.5022 16.6419 16.7663 16.6419 15.2941 16.6419H8.70588C7.23375 16.6419 6.49769 16.6419 5.92281 16.8804C5.22269 17.1706 4.64881 17.6908 4.29289 18.358C4 18.9067 4 19.6044 4 21" 
        stroke="currentColor" 
        strokeWidth="2.2" 
        strokeLinecap="round"
      />
      <circle 
        cx="12" 
        cy="8" 
        r="4" 
        stroke="currentColor" 
        strokeWidth="2.2"
      />
    </svg>
  );
}