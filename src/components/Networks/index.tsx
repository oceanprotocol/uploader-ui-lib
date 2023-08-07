import React, { ReactElement } from 'react'
import Label from '../Input/Label'
import FormHelp from '../Input/Help'
import Tooltip from '../Tooltip'
import Caret from '../../@images/caret.svg'
import Network from '../../@images/network.svg'
import NetworksList from './NetworksList'
import stylesIndex from './preferences.module.css'
import styles from './index.module.css'

export default function Networks({ chainIds, payments, paymentSelected, handleChangeNetwork, handleChangePayment }: any): ReactElement {
  
  return (
    <Tooltip
      content={
        <ul className={stylesIndex.preferencesDetails}>
          <li>
            <Label htmlFor="chains">Networks</Label>
            <FormHelp>Select the network you would like to use.</FormHelp>

            <NetworksList 
              title="Network" 
              networks={chainIds} 
              handleChanged={handleChangeNetwork}
            />

            {
              payments && payments.length > 0 &&
              <NetworksList 
                title="Payment" 
                payments={payments} 
                paymentSelected={paymentSelected} 
                handleChanged={handleChangePayment}
              />
            }
          </li>
        </ul>
      }
      trigger="click focus"
      className={`${stylesIndex.preferences} ${styles.networks}`}
    >
      <>
        <Network aria-label="Networks" className={stylesIndex.icon} />
        <Caret aria-hidden="true" className={stylesIndex.caret} />

        <div className={styles.chainsSelected}>
          {chainIds.map((chainId: number) => (
            <span className={styles.chainsSelectedIndicator} key={chainId} />
          ))}
        </div>
      </>
    </Tooltip>
  )
}
