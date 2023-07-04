import Markdown from '../Markdown'
import React, { ReactElement, ReactNode, useState } from 'react'
import { Tab, Tabs as ReactTabs, TabList, TabPanel } from 'react-tabs'
import Tooltip from '../Tooltip'
import styles from './index.module.css'
import FileUploadSingle from '../FileUploadSingle'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

export interface TabsItem {
  title: string
  content: ReactNode
  disabled?: boolean
  props: any
  field: {
    value: string
    label: string
    placeholder: string
  }
}

export interface TabsProps {
  items: TabsItem[]
  className?: string
}

export default function TabsFile({
  items,
  className
}: TabsProps): ReactElement {
  const [values, setFieldValue] = useState() as any;
  const initialState = () => {
    const index = items.findIndex((tab: any) => {
      // fallback for edit mode (starts at index 0 with hidden element)
      if (!values?.services) return 0

      return tab.field.value === values.services[0].files[0].type
    })

    return index < 0 ? 0 : index
  }

  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect()

  const [tabIndex, setTabIndex] = useState(initialState)
  // hide tabs if are hidden
  console.log('items', items);
  
  const isHidden = false

  const setIndex = (tabName: string) => {
    const index = items.findIndex((tab: any) => {
      if (tab.title !== tabName) return false
      return tab
    })
    setTabIndex(index)
    setFieldValue(items[index])
  }

  const handleTabChange = (tabName: string) => {
    setIndex(tabName)
  }

  return (
    <ReactTabs className={`${className || ''}`} defaultIndex={tabIndex}>
      <div className={styles.tabListContainer}>
        <TabList className={styles.tabList}>
          {items.map((item, index) => {
            return (
              <Tab
                className={`${styles.tab} ${
                  isHidden ? styles.tabHidden : null
                }`}
                key={`tab_${items[tabIndex].title}_${index}`}
                onClick={
                  handleTabChange ? () => handleTabChange(item.title) : undefined
                }
                disabled={item.disabled}
              >
                {item.title}
              </Tab> 
            )
          })}
        </TabList>
      </div>
      <div className={styles.tabContent}>
        {items.map((item, index) => {
          return (
            <>
              <TabPanel
                key={`tabpanel_${items[tabIndex].title}_${index}`}
                className={styles.tabPanel}
              >
                {
                  isConnected &&
                  <div className={styles.connection}>
                    Connected to {address}
                    <button onClick={() => disconnect()}>Disconnect</button>
                  </div>
                }

                {
                  !isConnected &&
                  <div className={styles.connection}>
                    <button onClick={() => connect()}>Connect Wallet</button>
                  </div>
                }

                {!isHidden && (
                  <label className={styles.tabLabel}>
                    {item.title}
                    {item.content && (
                      <Tooltip
                        content={
                          <Markdown
                            text={`${item.content}`}
                          />
                        }
                      />
                    )}
                  </label>
                )}
                
                {item.content}
                
                <FileUploadSingle {...item.field} />

              </TabPanel>
            </>
          )
        })}
        {
          items.length === 0 && (
            <p>DBS Not available</p>
          )
        }
      </div>
    </ReactTabs>
  )
}
