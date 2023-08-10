import Markdown from '../Markdown'
import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react'
import { Tab, Tabs as ReactTabs, TabList, TabPanel } from 'react-tabs'
import Tooltip from '../Tooltip'
import styles from './index.module.css'
import FileUploadSingle from '../FileUploadSingle'
import { useAccount, useConnect, useDisconnect, useNetwork } from 'wagmi'
import { switchNetwork } from '@wagmi/core'
import { InjectedConnector } from 'wagmi/connectors/injected'
import Button from '../Button'
import { dbs_setting } from '../DBSComponent'
import {
  DBSClient,
  GetQuoteArgs,
  GetQuoteResult,
  GetStatusResult
} from '@oceanprotocol/dbs'
import Networks from '../Networks'
import { formatEther } from "@ethersproject/units";
import HistoryList from '../HistoryList'
import { addEllipsesToText } from '../../@utils/textFormat'

export interface TabsProps {
  items: dbs_setting[]
  className?: string
  dbsClient: DBSClient
}

export default function TabsFile({
  items,
  className,
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
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect()

  const [ isNetworkSupported, setIsNetworkSupported ] = useState(false)
  const [ availableNetworks, setAvailableNetworks ] = useState([])
  
  const [paymentSelected, setPaymentSelected] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState(chain?.id || 0);
  
  const [uploadIsLoading, setUploadIsLoading] = useState(false);
  const [errorUpload, setErrorUpload] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successUpload, setSuccessUpload] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Mocked data quote
  const [quote, setQuote] = useState<any>({
    "quoteId": "78959b7f49f848ca99a1a31aa4d16830",
    "tokenAmount": 21825,
    "approveAddress": "0x0ff9092e55d9f6CCB0DD4C490754811bc0839866",
    "chainId": 80001,
    "tokenAddress": "0x21c561e551638401b937b03fe5a0a0652b99b7dd"
  });
  const [uploadResponse, setUploadResponse] = useState<any>({});

  const [historyList, setHistoryList] = useState<any>([]);

  const [step, setStep] = useState('quote');
  
  const [file, setFile] = useState<File>();
  const [submitText, setSubmitText] = useState('Get Quote');
  
  const isHidden = false

  // TODO: use after Upload
  const resetTabs = () => {
    setTabIndex(initialState)
    setStep('quote');
    setSubmitText('Get Quote');
    setFile(undefined);
    
    setTimeout(() => {
      setSuccessUpload(false)
      setSuccessMessage('')
      setErrorUpload(false)
      setErrorMessage('')
    }, 3000);
  }

  const setIndex = (tabName: string) => {
    const index = items.findIndex((tab: any) => {
      if (tab.type !== tabName) return false
      return tab
    })
    setTabIndex(index)
    setFieldValue(items[index])
    setStep('quote');
    setFile(undefined);
    setErrorUpload(false);
    setErrorMessage('');
  }

  const handleTabChange = (tabName: string) => {
    setIndex(tabName)
  }

  const uploads = [
    {
      "quoteId": "412f2539b845c4bc58442b2ee1323d3e"
    }
  ];

  useEffect(() => {
    const availableNetworksByService = items[tabIndex].payment.map((item: any) => parseInt(item.chainId))
    // TODO: fix any type
    setAvailableNetworks(availableNetworksByService as any)
    const isNetworkSupported = availableNetworksByService?.includes(chain?.id || 0) || false
    setIsNetworkSupported(isNetworkSupported)
    isNetworkSupported && setSelectedNetwork(chain?.id || 0)
    isNetworkSupported && setPaymentSelected(items[tabIndex].payment.find((item: any) => item.chainId === chain?.id.toString())?.acceptedTokens[0]?.value || '')
    setUploadIsLoading(false);
  }, [chain, items[tabIndex]])

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
    await switchNetworks(parseInt(event.target.value)).then(() => {
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

  const getQuote = async ({ type, duration, payment, userAddress, filePath, fileInfo}: GetQuoteArgs) => {
    try {
      console.log('quoting: ', { type, duration, payment, userAddress, filePath, fileInfo });
      const quoteResult: GetQuoteResult = await dbsClient.getQuote({
        type,
        duration,
        payment,
        userAddress,
        filePath,
        fileInfo
      })
      console.log('Quote result:', quoteResult) 
      setQuote(quoteResult); 
      setStep('upload');
    } catch (error) {
      console.log(error);
      setErrorUpload(true);
      setErrorMessage("Quote failed!");
    }
  }

  const getUpload = async ({ quoteId, payment, files}: any) => {
    try {
      console.log('uploading: ', typeof files);
      const quoteAndUploadResult: any = await dbsClient.uploadBrowser(
        quoteId,
        payment,
        files as FileList
      )
      console.log('Upload result:', quoteAndUploadResult);
      if (quoteAndUploadResult?.status === 200) {
        setUploadResponse(quoteAndUploadResult);
        // TODO: merge this into HistoryList once integrated
        console.log(uploadResponse);
        
        setSuccessUpload(true);
        setSuccessMessage(quoteAndUploadResult?.data || "File uploaded successfully!");
        resetTabs();
      } else {
        throw new Error(quoteAndUploadResult?.data || 'File uploaded failed!');
      }
    } catch (error) {
      console.log(error);
      setErrorUpload(true);
      setErrorMessage("File uploaded failed!");
      resetTabs();
    }
  }

  const handleUpload = async () => {
    setUploadIsLoading(true);
    if (!file) {
      return;
    }

    switch (step) {
      case 'quote':
        // Fetch a quote
        await getQuote({
          type: items[tabIndex].type,
          duration: 4353545453,
          payment: {
            chainId: selectedNetwork.toString(), 
            tokenAddress: paymentSelected
          },
          userAddress: address || '',
          filePath: undefined,
          fileInfo: [{ length: file.size }]
        })
        break;
      case 'upload':
        // Upload File
        await getUpload({
          quoteId: quote.quoteId,
          payment: quote.tokenAddress,
          files: [file] as unknown as FileList
        })
        break;
      default:
        break;
    }
    
    setUploadIsLoading(false);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };
  
  useEffect(() => {
    switch (step) {
      case 'quote':
        setSubmitText('Get Quote');
        break;
      case 'upload':
        setSubmitText('Upload File');
        break;
      default:
        break;
    }
  }, [step])

  async function getStatus(quoteId: string){
    try {
      console.log('get status: ', { quoteId });
      const statusResult: GetStatusResult = await dbsClient.getStatus(
        quoteId
      )
      console.log('status result:', statusResult)
      return statusResult.status 
    } catch (error) {
      console.log(error);
    }
  }

  const getStatusMessage = (statusCode: number, storage: string) => {
    let statusMessages: any;
    switch (storage) {
      case 'filecoin':
        statusMessages = {
          0: "No such quote",
          99: "Waiting for files to be uploaded by the user",
          199: "Inadequate Balance or token Allowance given",
          300: "Uploading files to storage",
          399: "CID migrated to lighthouse node, creating filecoin deal",
          400: "Deal created on filecoin network",
          401: "Upload failure"
        };   
        break;
      case 'arweave':
        statusMessages = {
          0: "No such quote",
          99: "Waiting for files to be uploaded by the user",
          100: "Processing payment",
          200: "Processing payment failure modes",
          300: "Uploading files to storage",
          400: "Upload done",
          401: "Upload failure modes"
        };   
        break;
    }
    return statusMessages[statusCode];
  }

  const getStatusFiles = async () => {
    await uploads.map(async (upload: any) => {
      const stausCode = await getStatus(upload.quoteId).then((status: any) => status)
      console.log('status code: ', stausCode);
      const infoFile = {
        quoteId: upload.quoteId,
        statusMessage: getStatusMessage(stausCode, items[tabIndex].type),
        link: 'test',
        statusCode: stausCode
      }
      setHistoryList([infoFile])
    })
  }

  useEffect(() => {
    getStatusFiles()
  }, [items[tabIndex].type])

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
            paymentSelected={paymentSelected} 
            payments={items[tabIndex].payment.find((item: any) => item.chainId === chain?.id.toString())?.acceptedTokens}
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
                {addEllipsesToText(item.type, 10)}
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
                {item.description} 
                
                { 
                  <Tooltip
                    content={
                      <Markdown
                        text={`${item.description}`}
                      />
                    }
                  />
                }

                {
                  step === 'upload' &&
                  <Button
                    style="primary"
                    className={styles.priceLabel}
                    size="small"
                    onClick={(e: React.SyntheticEvent) => {
                      e.preventDefault()
                    }}
                    disabled={false}
                  >
                    {`${formatEther(quote.tokenAmount)} ${items[tabIndex].payment.filter((item: any) => item.chainId === chain?.id.toString())[0].acceptedTokens.filter((item: any) => item.value === paymentSelected)[0].title}`}
                  </Button>
                }
                
                <FileUploadSingle {...item} 
                  name={item.type} 
                  key={`file_uploader_${items[tabIndex].type}_${index}`} 
                  error={isNetworkSupported === false || errorUpload}
                  errorMessage={!isNetworkSupported ? "Network not supported" : errorMessage}
                  success={successUpload}
                  successMessage={successMessage}
                  handleUpload={handleUpload}
                  isLoading={uploadIsLoading}
                  isButtonDisabled={!isConnected || !file || !isNetworkSupported}
                  inputDisabled={!isConnected || !isNetworkSupported}
                  handleFileChange={handleFileChange}
                  file={file}
                  submitText={submitText}
                />
                
                <br />

                <HistoryList 
                  items={items}
                  tabIndex={index}
                  uploads={historyList}
                  dbsClient={dbsClient}
                />

              </TabPanel>
            </>
          )
        })}
      </div>
    </ReactTabs>
  )
}
