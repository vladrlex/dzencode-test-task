interface IconProps {
  size?: number;
  className?: string;
}

export default function GpuIcon({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="2" y="5" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="8" cy="11" r="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="16" cy="11" r="3" stroke="currentColor" strokeWidth="2" />
      <path d="M6 17V19M18 17V19M2 9H4M2 13H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}