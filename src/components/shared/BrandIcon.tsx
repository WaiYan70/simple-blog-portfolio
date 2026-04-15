type BrandIconProps = {
  path: string;
  title: string;
  size?: number;
  className?: string;
};

export function BrandIcon({
  path,
  title,
  size = 16,
  className,
}: BrandIconProps) {
  return (
    <svg
      role="img"
      aria-label={title}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
    >
      <path d={path} />
    </svg>
  );
}
