import React, { ChangeEvent, useEffect, useState } from 'react'
import Button from '../Button'
import styles from './index.module.css'
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useNetwork,
  useAccount,
  useBalance
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
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const { chain } = useNetwork()
  const { address } = useAccount()

  const { data: balanceWallet } = useBalance({
    address: address
  })

  const { config } = usePrepareContractWrite({
    address:
      chain?.id === 80001
        ? '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889'
        : '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
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

  useEffect(() => {
    if (isSuccess) {
      console.log('isSuccess', isSuccess)
      console.log('isPending', isPending)
      props.setStep('upload')
    }
  }, [isSuccess])

  useEffect(() => {
    if (!balanceWallet?.value || balanceWallet.value < props.amount) {
      setError(true)
      setErrorMessage('Not enough matic!')
    } else if (wmaticIsError) {
      setError(true)
      setErrorMessage('Error wMatic. Check logs.')
      console.log(wmaticError)
    }
  }, [balanceWallet, wmaticIsError])

  return (
    <>
      {!hideButton && !isSuccess && (
        <Button
          style="primary"
          size="small"
          disabled={
            !wmaticDeposit ||
            (balanceWallet && balanceWallet?.value < props.amount)
          }
          onClick={() => {
            wmaticDeposit?.()
          }}
        >
          {isLoading
            ? 'Check Wallet...'
            : isPending
            ? 'TX Pending...'
            : 'Wrap Matic'}
        </Button>
      )}

      {error && (
        <div className={styles.error}>
          <p>{errorMessage}</p>
        </div>
      )}
    </>
  )
}
