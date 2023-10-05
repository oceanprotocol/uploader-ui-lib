import React, { ChangeEvent } from 'react'
import { useState } from 'react'
import InputGroup from '../Input/InputGroup'
import DefaultInput from '../Input'
import Button from '../Button'
import Loader from '../Loader'
import styles from './index.module.css'
import { usePrepareContractWrite, useContractWrite } from 'wagmi'
import wMaticAbi from './wMaticAbi.json'

interface WrapMaticProps {
  setStep: (step: string) => void
  amount: bigint
  name?: string
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleUpload: () => void
}

export default function WrapMatic(props: WrapMaticProps) {
  const [hideButton] = useState(false)
  const { config } = usePrepareContractWrite({
    address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    abi: wMaticAbi,
    functionName: 'deposit',
    value: props.amount
  })
  const {
    write: wmaticDeposit,
    error: wmaticError,
    isError: wmaticIsError,
    isLoading: wmaticLoading,
    isSuccess: wmaticSuccess
  } = useContractWrite(config)

  console.log('wmaticSuccess', wmaticSuccess)
  console.log('wmaticError', wmaticError)
  console.log('wmaticIsError', wmaticIsError)
  console.log('wmaticLoading', wmaticLoading)

  return (
    <>
      <InputGroup>
        <DefaultInput
          onChange={props.handleFileChange}
          {...props}
          name={props.name}
        />
        {!hideButton && !wmaticSuccess && (
          <Button
            style="primary"
            size="small"
            disabled={!wmaticDeposit}
            onClick={() => {
              wmaticDeposit?.()
              props.setStep('upload')
            }}
          >
            {wmaticLoading ? <Loader /> : 'Wrap Matic'}
          </Button>
        )}
      </InputGroup>

      {wmaticIsError && (
        <div className={styles.error}>
          <p>{wmaticError}</p>
        </div>
      )}
    </>
  )
}
