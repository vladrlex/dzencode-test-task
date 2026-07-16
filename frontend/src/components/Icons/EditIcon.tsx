interface IconProps {
  size?: number;
  className?: string;
}

export default function EditIcon({ size = 16, className = '' }: IconProps) {
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
        d="M11 4H4C2.89543 4 2 4.89543 2 6V20C2 21.1046 2.89543 22 4 22H18C19.1046 22 20 21.1046 20 20V13M18.5858 2.58579C19.3668 1.80474 20.6332 1.80474 21.4142 2.58579C22.1953 3.36684 22.1953 4.63316 21.4142 5.41421L11.8284 15H9V12.1716L18.5858 2.58579Z" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
}