interface IconProps {
  size?: number;
  className?: string;
}

export default function HryvniaIcon({ size = 16, className = '' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <text
        x="12"
        y="17"
        textAnchor="middle"
        fontSize="18"
        fontWeight="700"
        fill="currentColor"
        fontFamily="inherit"
      >
        ₴
      </text>
    </svg>
  );
}
