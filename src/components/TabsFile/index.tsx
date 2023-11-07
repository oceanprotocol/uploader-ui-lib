import Markdown from '../Markdown'
import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react'
import { Tab, Tabs as ReactTabs, TabList, TabPanel } from 'react-tabs'
import Tooltip from '../Tooltip'
import styles from './index.module.css'
import FileUploadSingle from '../FileUploadSingle'
import { useAccount, useNetwork, useContractRead } from 'wagmi'
import { switchNetwork } from '@wagmi/core'
import Button from '../Button'
import {
  GetLinkResult,
  GetQuoteArgs,
  GetQuoteResult,
  GetStatusResult
} from '@oceanprotocol/uploader'
import Networks from '../Networks'
import { formatEther } from '@ethersproject/units'
import HistoryList from '../HistoryList'
import { addEllipsesToText } from '../../@utils/textFormat'
import { getStatusMessage } from '../../@utils/statusCode'
import wMaticAbi from '../WrapMatic/wMaticAbi.json'
import WrapMatic from '../WrapMatic'
import InputGroup from '../Input/InputGroup'
import DefaultInput from '../Input'
import { TabsProps } from '../../@types/TabsFile'

export default function TabsFile({
  items,
  className,
  uploaderClient
}: TabsProps): ReactElement {
  const [values, setFieldValue] = useState() as any
  const initialState = () => {
    if (!items) return 0
    const index = items.findIndex((tab: any) => {
      if (!values?.type) return 0
      return tab.type === values.type
    })
    return index < 0 ? 0 : index
  }
  const [tabIndex, setTabIndex] = useState(initialState)

  const { chain } = useNetwork()
  const { address, isConnected } = useAccount()

  const [isNetworkSupported, setIsNetworkSupported] = useState(false)
  const [availableNetworks, setAvailableNetworks] = useState([])

  const [paymentSelected, setPaymentSelected] = useState('')
  const [selectedNetwork, setSelectedNetwork] = useState(chain?.id || 0)

  const [uploadIsLoading, setUploadIsLoading] = useState(false)
  const [errorUpload, setErrorUpload] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const [historyLoading, setHistoryLoading] = useState(false)

  const { data: balanceData } = useContractRead({
    address:
      chain?.id === 80001
        ? '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889'
        : '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    abi: wMaticAbi,
    functionName: 'balanceOf',
    args: [address]
  })

  console.log('Check if user has wrapped matic in their wallet')
  const wmaticBalance = BigInt((balanceData as number) || 0)
  console.log('balance wmatic: ', balanceData)
  // Mocked data quote
  const [quote, setQuote] = useState<any>()
  const [quoteWithBuffer, setQuoteWithBuffer] = useState<string>()
  const [uploadStatusResponse, setUploadStatusResponse] = useState<any>('')
  const [ddoLink, setDDOLink] = useState('')

  console.log('quote tokenAmount', quote)
  const mockedDataHistory = [
    {
      quoteId: '93254d6a389ca6eb07ff548810b27eb1',
      statusMessage: getStatusMessage(400, items[tabIndex].type),
      link: 'test',
      statusCode: 400
    },
    {
      quoteId: '0a9a28828bc06b8e2feb901782726539',
      statusMessage: getStatusMessage(400, items[tabIndex].type),
      link: 'test',
      statusCode: 400
    },
    {
      quoteId: '93254d6a389ca6eb07ff548810b27eb3',
      statusMessage: getStatusMessage(400, items[tabIndex].type),
      link: 'test',
      statusCode: 400
    }
  ]
  const [historyList, setHistoryList] = useState<any>([])
  const [historyUnlocked, setHistoryUnlocked] = useState(false)

  const [step, setStep] = useState('quote')

  const [file, setFile] = useState<File>()
  const [submitText, setSubmitText] = useState('Get Quote')

  const [pageHistory, setPageHistory] = useState(1)
  const [pageSizeHistory] = useState(5)
  const [totalPagesHistory, setTotalPagesHistory] = useState(1)

  const isHidden = false

  // TODO: use after Upload
  const resetTabs = () => {
    setTabIndex(initialState)
    setStep('quote')
    setSubmitText('Get Quote')
    setQuote('')
    setFile(undefined)
    setDDOLink('')
    setUploadStatusResponse('')
  }

  const setIndex = (tabName: string) => {
    const index = items.findIndex((tab: any) => {
      if (tab.type !== tabName) return false
      return tab
    })
    setTabIndex(index)
    setFieldValue(items[index])
    setStep('quote')
    setFile(undefined)
    setErrorUpload(false)
    setErrorMessage('')
    setUploadStatusResponse('')
  }

  const handleTabChange = (tabName: string) => {
    setIndex(tabName)
  }

  useEffect(() => {
    const availableNetworksByService = items[tabIndex].payment.map(
      (item: any) => parseInt(item.chainId)
    )
    // TODO: fix any type
    setAvailableNetworks(availableNetworksByService as any)
    const isNetworkSupported =
      availableNetworksByService?.includes(chain?.id || 0) || false
    setIsNetworkSupported(isNetworkSupported)
    isNetworkSupported && setSelectedNetwork(chain?.id || 0)
    isNetworkSupported &&
      setPaymentSelected(
        items[tabIndex].payment.find(
          (item: any) => item.chainId === chain?.id.toString()
        )?.acceptedTokens[0]?.value || ''
      )
    setUploadIsLoading(false)
    // TODO: check logic after historyList implementation
    setHistoryUnlocked(false)
    setHistoryList(mockedDataHistory)
  }, [chain, items[tabIndex]])

  useEffect(() => {
    setTimeout(() => {
      setErrorUpload(false)
      setErrorMessage('')
    }, 3000)
  }, [errorUpload])

  const switchNetworks = async (chainId: number) => {
    try {
      const network = await switchNetwork({ chainId })
      return network
    } catch (error) {
      console.log(error)
      throw new Error('Error switching network')
    }
  }

  const handleChangeNetwork = async (event: any) => {
    event.preventDefault()
    await switchNetworks(parseInt(event.target.value))
      .then(() => {
        setSelectedNetwork(parseInt(event.target.value))
      })
      .catch((error) => {
        setSelectedNetwork(selectedNetwork)
        console.log(error)
      })
  }

  const handleChangePayment = (event: { target: { value: any } }) => {
    setPaymentSelected(event.target.value)
  }

  const getQuote = async ({
    type,
    duration,
    payment,
    userAddress,
    filePath,
    fileInfo
  }: GetQuoteArgs) => {
    try {
      console.log('quoting: ', {
        type,
        duration,
        payment,
        userAddress,
        filePath,
        fileInfo
      })
      if (type === 'ipfs' && fileInfo && fileInfo[0]?.length > 10000000) {
        setErrorUpload(true)
        setErrorMessage('File too big. IPFS uploads limited to 10mb')
        setUploadIsLoading(false)
        return
      }
      const quoteResult: GetQuoteResult = await uploaderClient.getQuote({
        type,
        duration,
        payment,
        userAddress,
        filePath,
        fileInfo
      })
      console.log('Quote result:', quoteResult)
      setUploadStatusResponse('')
      setQuote(quoteResult)
      console.log('quoteResult.tokenAmount', quoteResult.tokenAmount)
      console.log('quote tokenAmount', quote)

      const newQuoteFee = BigInt(quoteResult.tokenAmount)

      setQuoteWithBuffer(String(newQuoteFee))
      // Check if user has wrapped matic in their wallet
      if (wmaticBalance < newQuoteFee) {
        console.log('User does not have enough wMatic')
        setStep('wrapMatic')
      } else {
        console.log('User has enough wMatic')
        setStep('upload')
      }
    } catch (error) {
      console.log(error)
      setErrorUpload(true)
      setErrorMessage('Quote failed!')
    }
    setUploadIsLoading(false)
  }

  async function getStatus(quoteId: string) {
    try {
      console.log('get status: ', { quoteId })
      const statusResult: GetStatusResult = await uploaderClient.getStatus(
        quoteId
      )
      console.log('status result:', statusResult)
      return statusResult.status
    } catch (error) {
      console.log(error)
    }
  }

  async function completeUpload(quoteId: string) {
    var keepLoading = true
    while (keepLoading) {
      const status = await getStatus(quoteId)
      setUploadStatusResponse(
        getStatusMessage(status || 0, items[tabIndex].type)
      )
      console.log(
        'status: ',
        status,
        uploadStatusResponse,
        getStatusMessage(status || 0, items[tabIndex].type)
      )
      if (status == 400) {
        keepLoading = false
        setStep('ddoLink')
        setUploadIsLoading(false)
      }
      // check if there's any failure
      if (status == 200 || status == 401 || status == 404) {
        keepLoading = false
        setStep('quote')
        setUploadIsLoading(false)
        throw new Error('File uploaded failed!')
      }
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
    if (!keepLoading) return
  }

  const getUpload = async ({
    quoteId,
    payment,
    quoteFee,
    files,
    type
  }: any) => {
    try {
      console.log('uploading: ', { quoteId, payment, quoteFee, files, type })
      console.log('String(quoteFee)', String(quoteFee))
      const quoteAndUploadResult: any = await uploaderClient.uploadBrowser(
        quoteId,
        payment,
        String(quoteFee),
        files as FileList,
        type
      )
      console.log('Upload result:', quoteAndUploadResult)
      if (quoteAndUploadResult?.status === 200) {
        // setUploadResponse(quoteAndUploadResult);
        // CHECK status until it's 400 (upload completed)
        try {
          completeUpload(quoteId)
        } catch (error) {
          setErrorUpload(true)
          setErrorMessage('File uploaded failed!')
        }
      } else {
        setUploadIsLoading(false)
        throw new Error(
          quoteAndUploadResult?.data ||
            quoteAndUploadResult?.response?.data ||
            'File uploaded failed!'
        )
      }
    } catch (error) {
      console.log('Upload Error: ', error)
      setErrorUpload(true)
      setErrorMessage('File uploaded failed!')
      // resetTabs()
    }
  }

  const getDDOlink = async (quoteId: any) => {
    try {
      console.log('get DDO link: ', quoteId)
      const linkResult: GetLinkResult[] = await uploaderClient.getLink(quoteId)
      console.log('ddo link result:', linkResult)
      setDDOLink(
        linkResult[0].transactionHash ||
          linkResult[0].CID ||
          linkResult[0].cid ||
          ''
      )
      setUploadIsLoading(false)
    } catch (error) {
      console.log(error)
      setErrorUpload(true)
      // TODO: fix any type
      const message = error as any
      setErrorMessage(
        message?.response?.data?.message || 'File uploaded failed!'
      )
      setUploadIsLoading(false)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      return
    }

    switch (step) {
      case 'quote':
        setUploadIsLoading(true)
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
        break
      case 'upload':
        setUploadIsLoading(true)
        // Upload File
        console.log('String(quote.tokenAmount)', String(quote.tokenAmount))
        await getUpload({
          quoteId: quote.quoteId,
          payment: quote.tokenAddress,
          quoteFee: String(quoteWithBuffer),
          files: [file] as unknown as FileList,
          type: items[tabIndex].type
        })
        break
      case 'ddoLink':
        setUploadIsLoading(true)
        // Get DDO Link
        await getDDOlink(quote.quoteId)
        break
      default:
        break
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    resetTabs()
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  useEffect(() => {
    console.log('UseEffect STEP: ', step)
    switch (step) {
      case 'quote':
        setSubmitText('Get Quote')
        break
      case 'wrapMatic':
        setSubmitText('Wrap Matic')
        break
      case 'upload':
        setSubmitText('Upload File')
        break
      case 'ddoLink':
        setSubmitText('Get DDO Link')
        break
      default:
        break
    }
  }, [step])

  const getHistoryList = async (
    pageNumber = 1,
    pageSize = 1000,
    service = items[tabIndex].type
  ) => {
    setHistoryLoading(true)
    try {
      const historyList = await uploaderClient.getHistory(
        pageNumber,
        pageSize,
        service
      )
      console.log('history result: ', historyList)
      setTotalPagesHistory(historyList?.maxPages)
      setHistoryList(historyList?.data)
      setHistoryUnlocked(true)
      setHistoryLoading(false)
      setPageHistory(pageNumber)
    } catch (error) {
      console.log(error)
      setHistoryLoading(false)
    }
  }

  const changeHistoryPage = (page: number) => {
    console.log('requesting history page: ', page)
    getHistoryList(page, pageSizeHistory, items[tabIndex].type)
  }

  useEffect(() => {
    setHistoryList(mockedDataHistory)
  }, [items[tabIndex].type])

  useEffect(() => {
    resetTabs()
  }, [address])

  return (
    <ReactTabs className={`${className || ''}`} defaultIndex={tabIndex}>
      <div className={styles.headerContainer}>
        {availableNetworks && availableNetworks?.length > 0 && (
          <Networks
            chainIds={availableNetworks}
            paymentSelected={paymentSelected}
            payments={
              items[tabIndex].payment.find(
                (item: any) => item.chainId === chain?.id.toString()
              )?.acceptedTokens
            }
            handleChangeNetwork={handleChangeNetwork}
            handleChangePayment={handleChangePayment}
          />
        )}
      </div>

      <div className={styles.tabListContainer}>
        <TabList className={styles.tabList}>
          {items?.length > 0 &&
            items.map((item, index) => {
              if (item.type !== 'filecoin') {
                return (
                  <Tab
                    className={`${styles.tab} ${
                      isHidden ? styles.tabHidden : null
                    }`}
                    key={`tab_${items[tabIndex].type}_${index}`}
                    onClick={
                      handleTabChange
                        ? () => handleTabChange(item.type)
                        : undefined
                    }
                  >
                    {addEllipsesToText(item.type, 10)}
                  </Tab>
                )
              }
            })}
        </TabList>
      </div>
      <div className={styles.tabContent}>
        {items?.length > 0 &&
          items.map((item, index) => {
            return (
              <TabPanel
                key={`tabpanel_${items[tabIndex].type}_${index}`}
                className={styles.tabPanel}
              >
                {item.description}
                {
                  <Tooltip
                    content={<Markdown text={`${item.description}`} />}
                  />
                }
                {(step === 'upload' || step === 'wrapMatic') &&
                  !uploadStatusResponse && (
                    <Button
                      style="primary"
                      className={styles.priceLabel}
                      size="small"
                      onClick={(e: React.SyntheticEvent) => {
                        e.preventDefault()
                      }}
                      disabled={false}
                    >
                      {`${
                        quoteWithBuffer === '0' ||
                        parseFloat(formatEther(`${quoteWithBuffer}`)) === 0
                          ? 'Free'
                          : `${formatEther(`${quoteWithBuffer}`)} ${
                              items[tabIndex].payment
                                .filter(
                                  (item: any) =>
                                    item.chainId === chain?.id.toString()
                                )[0]
                                ?.acceptedTokens.filter(
                                  (item: any) => item.value === paymentSelected
                                )[0]?.title
                            }`
                      }`}
                    </Button>
                  )}
                {uploadStatusResponse && (
                  <Button
                    style="primary"
                    className={styles.ddoLinkLabel}
                    size="small"
                    onClick={(e: React.SyntheticEvent) => {
                      e.preventDefault()
                    }}
                    disabled={false}
                  >
                    {uploadStatusResponse}
                  </Button>
                )}
                {step === 'ddoLink' && ddoLink && (
                  <Button
                    style="primary"
                    className={styles.ddoLinkLabel}
                    size="small"
                    onClick={(e: React.SyntheticEvent) => {
                      e.preventDefault()
                    }}
                    disabled={false}
                  >
                    {ddoLink}
                  </Button>
                )}
                <InputGroup>
                  <DefaultInput
                    handleFileChange={handleFileChange}
                    handleUpload={handleUpload}
                    name={item.type}
                  />
                  {step === 'wrapMatic' ? (
                    <WrapMatic
                      setStep={setStep}
                      amount={BigInt(quoteWithBuffer as string)}
                      name={item.type}
                      handleFileChange={handleFileChange}
                      handleUpload={handleUpload}
                      file={file}
                    />
                  ) : (
                    <FileUploadSingle
                      {...item}
                      name={item.type}
                      key={`file_uploader_${items[tabIndex].type}_${index}`}
                      error={isNetworkSupported === false || errorUpload}
                      errorMessage={
                        !isNetworkSupported
                          ? isConnected
                            ? 'Network not supported'
                            : 'Connect wallet'
                          : errorMessage
                      }
                      handleUpload={handleUpload}
                      isLoading={uploadIsLoading}
                      isButtonDisabled={
                        !isConnected ||
                        !file ||
                        !isNetworkSupported ||
                        !!ddoLink
                      }
                      inputDisabled={!isConnected || !isNetworkSupported}
                      handleFileChange={handleFileChange}
                      file={file}
                      submitText={submitText}
                    />
                  )}
                </InputGroup>
                <br />
                <HistoryList
                  items={items}
                  tabIndex={index}
                  uploads={historyList}
                  historyUnlocked={historyUnlocked}
                  getHistoryList={getHistoryList}
                  historyLoading={historyLoading}
                  historyPage={pageHistory}
                  historyTotalPages={totalPagesHistory}
                  changeHistoryPage={(page: number) => changeHistoryPage(page)}
                />
              </TabPanel>
            )
          })}
      </div>
    </ReactTabs>
  )
}
