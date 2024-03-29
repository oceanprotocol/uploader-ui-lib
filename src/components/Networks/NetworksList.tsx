import React, { ChangeEvent } from 'react'
import NetworkItem from './NetworkItem'
import PaymentItem from './PaymentItem'
import styles from './NetworksList.module.css'
import { useNetwork } from 'wagmi'

export default function NetworksList({
  title,
  networks,
  payments,
  paymentSelected,
  handleChanged
}: {
  title: string
  networks?: number[]
  payments?: number[]
  paymentSelected?: number
  handleChanged: (e: ChangeEvent<HTMLInputElement>) => void
}) {
  const { chain } = useNetwork()
  
  const networksAvailable = networks?.map((chainId: number, index: number) => (
    <NetworkItem 
      key={index} 
      chainId={chainId} 
      selected={chainId === chain?.id}
      handleChanged={handleChanged}
    />
  ))
  
  const paymentsAvailable = payments?.map((payment: any, index) => (
    <PaymentItem 
      key={index} 
      selected={payment.value === paymentSelected} 
      payment={payment} 
      handleChanged={handleChanged}
    />
  ))

  return networksAvailable?.length || paymentsAvailable?.length ? (
    <>
      <h4 className={styles.titleGroup}>{title}</h4>
      <div className={styles.networks}>{networksAvailable || paymentsAvailable}</div>
    </>
  ) : null
}
