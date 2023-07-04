import React, { ReactElement, ReactNode } from 'react'
import styles from './index.module.css'
import classNames from 'classnames/bind'
import { InputField } from '@components/FileUploadSingle'

const cx = classNames.bind(styles)

const DefaultInput = ({
  size,
  className,
  file,
  ...props
}: InputField) => (
  <>
    <input
      className={cx({ input: true, size: size, className: className })}
      id={props.name}
      {...props}
      type='file'
    />
  </>
)

export default DefaultInput
