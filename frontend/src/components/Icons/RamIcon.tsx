interface IconProps {
  size?: number;
  className?: string;
}

export default function RamIcon({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="2" y="7" width="20" height="10" rx="1" stroke="currentColor" strokeWidth="2" />
      <path d="M6 17V14M10 17V14M14 17V14M18 17V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 7H20" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}