import React, { ChangeEvent, ReactElement } from 'react'
import NetworkItem from './NetworkItem'
import PaymentItem from './PaymentItem'
import styles from './NetworksList.module.css'

export default function NetworksList({
  title,
  networks,
  payments,
  networkSelected,
  paymentSelected,
  handleChanged
}: {
  title: string
  networks?: number[]
  payments?: number[]
  networkSelected?: number
  paymentSelected?: number
  handleChanged: (e: ChangeEvent<HTMLInputElement>) => void
}) {
  
  const networksAvailable = networks?.map((chainId: number, index: number) => (
    <NetworkItem 
      key={index} 
      chainId={chainId} 
      selected={chainId === networkSelected}
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
