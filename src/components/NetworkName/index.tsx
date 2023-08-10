import React, { ReactElement } from 'react'
import styles from './index.module.css'
import { NetworkIcon } from './NetworkIcon'
import { getNetworkDisplayName } from './NetworkName'

export default function NetworkName({
  networkId,
  minimal,
  className
}: {
  networkId: number
  minimal?: boolean
  className?: string
}): ReactElement {
  
  const networkName = getNetworkDisplayName(networkId)
  
  return (
    <span
      className={`${styles.network} ${minimal ? styles.minimal : null} ${
        className || ''
      }`}
      title={networkName}
    >
      <NetworkIcon name={networkName} />{' '}
      <span className={styles.name}>{networkName}</span>
    </span>
  )
}
