import React, { ChangeEvent, useEffect, useState } from 'react'
import Button from '../Button'
import styles from './index.module.css'
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useAccount,
  useBalance
} from 'wagmi'
import wMaticAbi from './wMaticAbi.json'

interface WrapMaticProps {
  setStep: (step: string) => void
  amount: bigint
  name?: string
  payment?: `0x${string}`
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleUpload: () => void
  file?: File
}

export default function WrapMatic(props: WrapMaticProps) {
  const [hideButton] = useState(false)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const { address } = useAccount()

  const { data: balanceWallet, isSuccess: balanceSuccess } = useBalance({
    address: address
  })

  const { config } = usePrepareContractWrite({
    address: props.payment as `0x${string}`,
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
    hash: data?.hash,
    confirmations: 6
  })

  useEffect(() => {
    if (isSuccess) {
      console.log('isSuccess', isSuccess)
      console.log('isPending', isPending)
      props.setStep('upload')
    }
  }, [isSuccess])

  useEffect(() => {
    if (
      balanceSuccess &&
      balanceWallet?.value &&
      balanceWallet?.value > props.amount
    ) {
      setError(false)
      setErrorMessage('')
    } else if (
      balanceSuccess &&
      (!balanceWallet?.value || balanceWallet.value < props.amount)
    ) {
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
