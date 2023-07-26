import React, { ChangeEvent, ReactElement } from 'react'
import styles from './NetworkItem.module.css'

export default function PaymentItem({
  selected,
  payment,
  handleChanged
}: {
  selected: boolean
  payment: any
  handleChanged: (e: ChangeEvent<HTMLInputElement>) => void
}): ReactElement {
  
  return (
    <div className={styles.radioWrap} key={payment.value}>
      <label className={styles.radioLabel} htmlFor={`opt-${payment.value}`}>
        <input
          className={styles.input}
          id={`opt-${payment.value}`}
          type="radio"
          name="paymentMethods"
          value={payment.value}
          onChange={handleChanged}
          defaultChecked={selected}
        />
        <p>{payment.title}</p>
      </label>
    </div>
  )
}
