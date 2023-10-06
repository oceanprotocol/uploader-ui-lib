import React, { ChangeEvent, useEffect, useState } from 'react'
import Button from '../Button'
import styles from './index.module.css'
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useNetwork
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
  const { chain } = useNetwork()
  const { config } = usePrepareContractWrite({
    address: chain?.id === 80001 ? '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889' : '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
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

  const { isLoading: isPending, isSuccess } = useWaitForTransaction({
    hash: data?.hash
  })

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
