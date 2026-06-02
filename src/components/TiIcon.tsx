interface TiIconProps {
  name: string
  size?: number
  className?: string
}

export default function TiIcon({ name, size = 20, className = '' }: TiIconProps) {
  return (
    <i
      className={`icon-${name} ${className}`}
      style={{ fontSize: size, display: 'inline-block', lineHeight: 1, verticalAlign: 'middle' }}
      aria-hidden="true"
    />
  )
}
