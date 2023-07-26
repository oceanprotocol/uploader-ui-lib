import Markdown from '../Markdown'
import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react'
import { Tab, Tabs as ReactTabs, TabList, TabPanel } from 'react-tabs'
import Tooltip from '../Tooltip'
import styles from './index.module.css'
import FileUploadSingle from '../FileUploadSingle'
import { useAccount, useConnect, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi'
import { switchNetwork } from '@wagmi/core'
import { InjectedConnector } from 'wagmi/connectors/injected'
import Button from '../Button'
import { dbs_setting } from '@components/DBSUploader'
import {
  DBSClient,
  GetQuoteArgs,
  File,
  GetQuoteResult
} from '@oceanprotocol/dbs'
import Networks from '../Networks'

export interface TabsProps {
  items: dbs_setting[]
  className?: string
  availableNetworks?: number[]
  dbsClient: DBSClient
}

export default function TabsFile({
  items,
  className,
  availableNetworks,
  dbsClient
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
  const [tabIndex, setTabIndex] = useState(initialState)
  
  const { chain } = useNetwork()
  const { chains, error, isLoading, pendingChainId } =
    useSwitchNetwork()
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect()

  const [ isNetworkSupported, setIsNetworkSupported ] = useState(false)
  
  const [paymentSelected, setPaymentSelected] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState(chain?.id || 0);
  
  const [uploadIsLoading, setUploadIsLoading] = useState(false);
  const [errorUpload, setErrorUpload] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [file, setFile] = useState<File>();
  const [submitText] = useState('Get Quote');
  
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
    const availableNetworksByService = items[tabIndex].payment.map((item: any) => item.chainId)
    const isNetworkSupported = availableNetworksByService?.includes(chain?.id.toString() || 0) || false
    setIsNetworkSupported(isNetworkSupported)
    isNetworkSupported && setSelectedNetwork(chain?.id || 0)
    isNetworkSupported && setPaymentSelected(items[tabIndex].payment.find((item: any) => item.chainId === chain?.id.toString())?.acceptedTokens[0].value || '')
  }, [chain, chains, items[tabIndex]])

  const switchNetworks = async (chainId: number) => {
    try {
      const network = await switchNetwork({chainId})
      return network
    } catch (error) {
      console.log(error);
      throw new Error("Error switching network");
    }
  }

  const handleChangeNetwork = async (event: any) => {
    event.preventDefault();
    await switchNetworks(parseInt(event.target.value)).then((switchNetwork) => {
      setSelectedNetwork(parseInt(event.target.value));
    })
    .catch((error) => {
      setSelectedNetwork(selectedNetwork);
      console.log(error);
    });
  };

  const handleChangePayment = (event: { target: { value: any } }) => {
    setPaymentSelected(event.target.value);
  };


  const handleUpload = async () => {
    setUploadIsLoading(true);
    if (!file) {
      return;
    }

    /*
    // TODO: rewmove after connecting to DBS.js
    setTimeout(() => {
      setUploadIsLoading(false);
      setErrorMessage("File uploaded failed!");
      setErrorUpload(true);

      setTimeout(() => {
        setErrorUpload(false);
        setErrorMessage("");
      }, 3000);
    }, 3000);
    */

    // TODO: fix example in dbs.js docs (wrong payment type)
    // Construct an example quote request
    const quoteArgs: GetQuoteArgs = {
      type: items[tabIndex].type,
      files: [{ length: file.size }],
      duration: 4353545453,
      payment: {
        chainId: selectedNetwork.toString(), 
        tokenAddress: paymentSelected
      },
      userAddress: address || ''
    }

    // TODO: fix files property as file object is not being accepted
    console.log(quoteArgs);

    // Fetch a quote
    try {
      const quoteResult: GetQuoteResult = await dbsClient.getQuote(quoteArgs)
      console.log('Quote result:', quoteResult)  
    } catch (error) {
      console.log(error);
      setErrorUpload(true);
      setErrorMessage("File uploaded failed!");
    }
    
    setUploadIsLoading(false);
    
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <ReactTabs className={`${className || ''}`} defaultIndex={tabIndex}>
      <div className={styles.headerContainer}>
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
          <Networks 
            chainIds={availableNetworks} 
            networkSelected={selectedNetwork} 
            paymentSelected={paymentSelected} 
            payments={items[tabIndex].payment.find((item: any) => item.chainId === selectedNetwork.toString())?.acceptedTokens}
            handleChangeNetwork={handleChangeNetwork}
            handleChangePayment={handleChangePayment}
          />
        }    
      </div> 

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
                
                <FileUploadSingle {...item} 
                  name={item.type} 
                  key={`file_uploader_${items[tabIndex].type}_${index}`} 
                  error={isNetworkSupported === false || errorUpload}
                  errorMessage={!isNetworkSupported ? "Network not supported" : errorMessage}
                  handleUpload={handleUpload}
                  isLoading={uploadIsLoading}
                  isButtonDisabled={!isConnected || !file || !isNetworkSupported}
                  inputDisabled={!isConnected || !isNetworkSupported}
                  handleFileChange={handleFileChange}
                  submitText={submitText}
                />
                
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
