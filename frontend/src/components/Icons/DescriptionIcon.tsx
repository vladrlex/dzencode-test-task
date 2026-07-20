interface IconProps {
  size?: number;
  className?: string;
}

export default function DescriptionIcon({ size = 16, className = '' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 10H3M21 6H3M17 14H3M13 18H3" />
    </svg>
  );
}
