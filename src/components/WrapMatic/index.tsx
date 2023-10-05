import React, { ChangeEvent, useEffect, useState } from 'react'
import InputGroup from '../Input/InputGroup'
import DefaultInput from '../Input'
import Button from '../Button'
import Loader from '../Loader'
import styles from './index.module.css'
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction
} from 'wagmi'
import wMaticAbi from './wMaticAbi.json'

interface WrapMaticProps {
  setStep: (step: string) => void
  amount: bigint
  name?: string
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleUpload: () => void
  file?: File
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
    data,
    error: wmaticError,
    isError: wmaticIsError,
    isLoading
  } = useContractWrite(config)

  const {
    data: receipt,
    isLoading: isPending,
    isSuccess
  } = useWaitForTransaction({ hash: data?.hash })

  console.log('name', props.file)

  useEffect(() => {
    if (isSuccess) {
      console.log('isSuccess', isSuccess)
      console.log('isPending', isPending)
      props.setStep('upload')
    }
  }, [isSuccess])

  return (
    <>
      {!hideButton && !isSuccess && (
        <Button
          style="primary"
          size="small"
          disabled={!wmaticDeposit}
          onClick={() => {
            wmaticDeposit?.()
          }}
        >
          {isLoading
            ? 'Check Wallet...'
            : isPending
            ? 'Transaction Pending...'
            : 'Wrap Matic'}
        </Button>
      )}

      {wmaticIsError && (
        <div className={styles.error}>
          <p>{wmaticError}</p>
        </div>
      )}
    </>
  )
}
