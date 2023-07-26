import React, { ReactElement } from 'react'
import styles from './index.module.css'
import { NetworkIcon } from './NetworkIcon'
import { useSwitchNetwork } from 'wagmi'

export default function NetworkName({
  networkId,
  minimal,
  className
}: {
  networkId: number
  minimal?: boolean
  className?: string
}): ReactElement {
  const { chains } = useSwitchNetwork()

  const networkName = chains.find((item) => item.id === networkId)?.name || "Network not supported"
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
