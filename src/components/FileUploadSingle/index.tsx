import React, { ReactNode }  from 'react';
import { ChangeEvent, useState } from 'react';
import InputGroup from '../Input/InputGroup';
import DefaultInput from '../Input';
import Button from '../Button';
import Loader from '../Loader';
import styles from './index.module.css'

export interface InputField {
  name?: string
  label?: string | ReactNode
  placeholder?: string
  required?: boolean
  size?: 'mini' | 'small' | 'large' | 'default'
  className?: string
  value?: string
  file?: File
  error?: boolean
  errorMessage?: string
  isLoading?: boolean
  isButtonDisabled?: boolean
  inputDisabled?: boolean
  submitText?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  handleUpload: () => void
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void
}

function FileUploadSingle({
  ...props
}: InputField) {
  
  const [hideButton] = useState(false);

  return (
    <>
      <InputGroup>
        <DefaultInput
          onChange={props.handleFileChange}
          {...props}
          name={props.name}
        />

        {!hideButton && (
          <Button
            style="primary"
            size="small"
            onClick={(e: React.SyntheticEvent) => {
              e.preventDefault()
              props.handleUpload()
            }}
            disabled={props.isButtonDisabled}
          >
            {props.isLoading ? <Loader /> : props.submitText}
          </Button>
        )}
      </InputGroup>

      {props.error && (
        <div className={styles.error}>
          <p>{props.errorMessage}</p>
        </div>
      )}
    </>
  );
}

export default FileUploadSingle;