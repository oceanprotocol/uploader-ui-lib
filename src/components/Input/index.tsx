import React, { useEffect, useRef } from 'react'
import styles from './index.module.css'
import classNames from 'classnames/bind'
import { InputField } from '@components/FileUploadSingle'

const cx = classNames.bind(styles)

const DefaultInput = ({
  size,
  className,
  file,
  ...props
}: InputField) => {
  const ref = useRef() as any;

  useEffect(() => {
    if (!file) {
      ref.current.value = ''
    }
  }, [file])
  
  return (
    <input
      className={cx({ input: true, size: size, className: className })}
      disabled={props.inputDisabled}
      id={props.name}
      onChange={props.handleFileChange}
      name={props.name}
      ref={ref} 
      type='file'
    />
  )
}

export default DefaultInput
