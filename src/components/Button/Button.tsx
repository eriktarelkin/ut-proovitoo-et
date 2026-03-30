import "./Button.css"

type ButtonVariant = "primary" | "secondary" | "danger" | "icon"

type Props = {
  label: string
  onClick?: () => void
  disabled?: boolean
  variant?: ButtonVariant
  active?: boolean
  tooltip?: string
}

export const Button = ({
  label,
  onClick,
  disabled,
  variant = "primary",
  active = false,
  tooltip,
}: Props) => (
  <button
    className={`btn btn--${variant}${active ? " btn--active" : ""}`}
    onClick={onClick}
    disabled={disabled}
    title={tooltip}
  >
    {label}
  </button>
)