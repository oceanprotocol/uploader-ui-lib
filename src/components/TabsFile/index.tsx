import Markdown from '../Markdown'
import React, { ReactElement, useEffect, useState } from 'react'
import { Tab, Tabs as ReactTabs, TabList, TabPanel } from 'react-tabs'
import Tooltip from '../Tooltip'
import styles from './index.module.css'
import FileUploadSingle from '../FileUploadSingle'
import { useAccount, useConnect, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import Button from '../Button'
import { dbs_setting } from '@components/DBSUploader'
export interface TabsProps {
  items: dbs_setting[]
  className?: string
  availableNetworks?: number[]
}

export default function TabsFile({
  items,
  className,
  availableNetworks
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
  const { chain } = useNetwork()
  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork()

  const { isConnected } = useAccount()
  const [ isNetworkSupported, setIsNetworkSupported ] = useState(false)
  const [selectedNetwork, setSelectedNetwork] = useState(0);

  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect()

  const [tabIndex, setTabIndex] = useState(initialState)
  
  const isHidden = false

  const setIndex = (tabName: string) => {
    const index = items.findIndex((tab: any) => {
      if (tab.type !== tabName) return false
      return tab
    })
    setTabIndex(index)
    setFieldValue(items[index])
  }

  const handleTabChange = (tabName: string) => {
    setIndex(tabName)
  }

  const files = [
    { name: 'File 1', status: 'Pending', link: 'https://google.com' },
    { name: 'File 2', status: 'Complete', link: 'https://google.com' },
    { name: 'File 3', status: 'Error', link: 'https://google.com' }
  ];

  const handleView = (link: string): void => {
    window.open(link, "_blank");
  }

  useEffect(() => {
    const isNetworkSupported = availableNetworks?.includes(chain?.id || 0) || false
    setIsNetworkSupported(isNetworkSupported)
    isNetworkSupported && setSelectedNetwork(chain?.id || 0)
    console.log(chains);
  }, [chain, chains])

  const handleChangeNetwork = (event: { target: { value: any } }) => {
    setSelectedNetwork(event.target.value);
    switchNetwork?.(parseInt(event.target.value))
    console.log(event.target.value);
  };
  
  return (
    <ReactTabs className={`${className || ''}`} defaultIndex={tabIndex}>
      {
        isConnected &&
        <div className={`${styles.connection}`}>
          <Button
            style="primary"
            size="small"
            onClick={() => disconnect()}
          >
            <span className={styles.disconnected}></span>
            Disconnect
          </Button>
        </div>
      }

      {
        !isConnected &&
        <div className={`${styles.connection}`}>
          <Button
            style="primary"
            size="small"
            onClick={() => connect()}
          >
            <span className={styles.connected}></span>
            Connect
          </Button>
        </div>
      }

      {
        availableNetworks && availableNetworks.length > 0 && 
        <select value={selectedNetwork} onChange={handleChangeNetwork}>
          <option value="">Select a Network</option>
          {availableNetworks.map((networkId: number, index: number) => (
            <option key={index} value={networkId}>
              {chains.find((item) => item.id === networkId)?.name || "Network not supported"}
            </option>
          ))}
        </select>
      }

      <div className={styles.tabListContainer}>
        <TabList className={styles.tabList}>
          {items.length > 0 && items.map((item, index) => {
            return (
              <Tab
                className={`${styles.tab} ${
                  isHidden ? styles.tabHidden : null
                }`}
                key={`tab_${items[tabIndex].type}_${index}`}
                onClick={
                  handleTabChange ? () => handleTabChange(item.type) : undefined
                }
              >
                {item.type}
              </Tab> 
            )
          })}
        </TabList>
      </div>
      <div className={styles.tabContent}>
        {items.length > 0 && items.map((item, index) => {
          
          return (
            <>
              <TabPanel
                key={`tabpanel_${items[tabIndex].type}_${index}`}
                className={styles.tabPanel}
              >
                {!isHidden && (
                  <label className={styles.tabLabel}>
                    {item.type}
                    {item.description && (
                      <Tooltip
                        content={
                          <Markdown
                            text={`${item.description}`}
                          />
                        }
                      />
                    )}
                  </label>
                )}
                
                {item.description}
                
                <FileUploadSingle {...item} name={item.type} connected={isConnected} key={`file_uploader_${items[tabIndex].type}_${index}`} />
                
                <br />

                <table className={styles.tableAssets} key={`table_${items[tabIndex].type}_${index}`}>
                  <thead>
                    <tr>
                      <th>Files</th>
                      <th>Status</th>
                      <th>View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((file, index) => (
                      <tr key={`table_files_${items[tabIndex].type}_${index}`}>
                        <td>{file.name}</td>
                        <td>{file.status}</td>
                        <td>
                          <button onClick={() => handleView(file.link)}>View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

              </TabPanel>
            </>
          )
        })}
      </div>
    </ReactTabs>
  )
}
