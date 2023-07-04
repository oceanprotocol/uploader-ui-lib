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
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

function FileUploadSingle({
  ...props
}: InputField) {
  const [file, setFile] = useState<File>();
  const [isLoading, setIsLoading] = useState(false);
  const [hideButton, setHideButton] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [submitText, setSubmitText] = useState('Upload');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    setIsLoading(true);
    if (!file) {
      return;
    }

    console.log(file);

    // TODO: rewmove after connect DBS.js
    setTimeout(() => {
      setIsLoading(false);
      setErrorMessage("File uploaded failed!");
      setError(true);

      setTimeout(() => {
        setError(false);
        setErrorMessage("");
      }, 3000);
    }, 3000);
    
  };

  console.log(props);

  return (
    <>
      <InputGroup>
        <DefaultInput
          onChange={handleFileChange}
          {...props}
        />

        {!hideButton && (
          <Button
            style="primary"
            size="small"
            onClick={(e: React.SyntheticEvent) => {
              e.preventDefault()
              handleUpload()
            }}
            disabled={!file || isButtonDisabled}
          >
            {isLoading ? <Loader /> : submitText}
          </Button>
        )}
      </InputGroup>

      {error && (
        <div className={styles.error}>
          <p>{errorMessage}</p>
        </div>
      )}
    </>
  );
}

export default FileUploadSingle;