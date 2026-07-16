interface IconProps {
  size?: number;
  className?: string;
}

export default function CpuIcon({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M9 9H15V15H9V9Z" stroke="currentColor" strokeWidth="2" />
      <path d="M9 1V4M15 1V4M9 20V23M15 20V23M1 9H4M1 15H4M20 9H23M20 15H23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}