import "./Skeleton.css"

type Shape = "rect" | "circle" | "text" | "rounded"

type SkeletonProps = {
  width?: string
  height?: string
  shape?: Shape
  className?: string
  style?: React.CSSProperties
}

export const Skeleton = ({
  width = "100%",
  height,
  shape = "rect",
  className = "",
  style,
}: SkeletonProps) => {
  const shapeClass =
    shape === "circle"  ? "skeleton--circle"  :
    shape === "text"    ? "skeleton--text"     :
    shape === "rounded" ? "skeleton--rounded"  :
    ""

  return (
    <span
      className={`skeleton ${shapeClass} ${className}`.trim()}
      aria-hidden="true"
      style={{ width, height, ...style }}
    />
  )
}

type SkeletonGroupProps = {
  children: React.ReactNode
  gap?: string
  className?: string
  style?: React.CSSProperties
}

export const SkeletonGroup = ({
  children,
  gap = "8px",
  className = "",
  style,
}: SkeletonGroupProps) => (
  <div
    className={`skeleton-group ${className}`.trim()}
    style={{ gap, ...style }}
  >
    {children}
  </div>
)