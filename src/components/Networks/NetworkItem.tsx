import React, { ChangeEvent, ReactElement } from 'react'
import styles from './NetworkItem.module.css'
import NetworkName from '../NetworkName'

export default function NetworkItem({
  chainId,
  selected,
  handleChanged
}: {
  chainId: number
  selected: boolean
  handleChanged: (e: ChangeEvent<HTMLInputElement>) => void
}): ReactElement {
  
  return (
    <div className={styles.radioWrap} key={chainId}>
      <label className={styles.radioLabel} htmlFor={`opt-${chainId}`}>
        <input
          className={styles.input}
          id={`opt-${chainId}`}
          type="radio"
          name="chainIds"
          value={chainId}
          onChange={handleChanged}
          checked={selected}
        />
        <NetworkName key={chainId} networkId={chainId} />
      </label>
    </div>
  )
}
