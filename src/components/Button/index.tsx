import React, { ReactNode, FormEvent, ReactElement } from 'react'
import classNames from 'classnames/bind'
import styles from './index.module.css'

const cx = classNames.bind(styles)

export interface ButtonProps {
  children: ReactNode
  className?: any
  href?: string
  onClick?: (e: FormEvent) => void
  disabled?: boolean
  to?: string
  name?: string
  size?: 'small'
  style?: 'primary' | 'ghost' | 'text'
  type?: 'submit'
  download?: boolean
  target?: string
  rel?: string
  title?: string
}

export default function Button({
  href,
  children,
  className,
  to,
  size,
  style,
  ...props
}: ButtonProps): ReactElement {
  const styleClasses = cx({
    button: true,
    primary: style === 'primary',
    ghost: style === 'ghost',
    text: style === 'text',
    small: size === 'small',
    [className]: className
  })

  return to ? (
    <a href={to} className={styleClasses} {...props}>
      {children}
    </a>
  ) : href ? (
    <a href={href} className={styleClasses} {...props}>
      {children}
    </a>
  ) : (
    <button className={styleClasses} {...props}>
      {children}
    </button>
  )
}
