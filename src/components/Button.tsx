import type {ButtonHTMLAttributes} from 'react'
import './Button.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'small'
  children: React.ReactNode
}

function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const classes = `btn btn-${variant} ${className}`.trim()

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}

export default Button
