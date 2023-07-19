require('dotenv').config()
import React, { useEffect } from 'react'
import { WagmiConfig, createClient } from 'wagmi'
import { mainnet, polygon, goerli, polygonMumbai } from 'wagmi/chains'
import { ConnectKitProvider, getDefaultClient } from 'connectkit'

import '../../stylesGlobal/styles.css'
import './index.module.css'
import TabsFile from '../TabsFile'

import {DBSClient} from '@oceanprotocol/dbs';

// Wagmi client
export const wagmiClient = createClient(
  getDefaultClient({
    appName: 'Ocean DBS UI',
    infuraId: process.env.PUBLIC_INFURA_PROJECT_ID,
    chains: [mainnet, polygon, goerli, polygonMumbai],
    walletConnectProjectId: process.env.PUBLIC_WALLETCONNECT_PROJECT_ID || ''
  })
)

// ConnectKit CSS overrides
// https://docs.family.co/connectkit/theming#theme-variables
export const connectKitTheme = {
  '--ck-font-family': 'var(--font-family-base)',
  '--ck-border-radius': 'var(--border-radius)',
  '--ck-overlay-background': 'var(--background-body-transparent)',
  '--ck-modal-box-shadow': '0 0 20px 20px var(--box-shadow-color)',
  '--ck-body-background': 'var(--background-body)',
  '--ck-body-color': 'var(--font-color-text)',
  '--ck-primary-button-border-radius': 'var(--border-radius)',
  '--ck-primary-button-color': 'var(--font-color-heading)',
  '--ck-primary-button-background': 'var(--background-content)',
  '--ck-secondary-button-border-radius': 'var(--border-radius)'
}

type acceptedTokens = {
  title: string
  value: string
}

type payment = {
  chainId: number
  acceptedTokens: acceptedTokens[]
}

export type dbs_setting = {
  type: string,
  description: string
  payment: payment[]
}

const DBSUploader = () => {
  // const { data: signer } = useSigner()
  const [ DBSsettings, setDBSsettings ] = React.useState([])
  const [ DBSnetworks, setDBSnetworks ] = React.useState([])
  // Initialize the DBSClient with the API base URL
  const client = new DBSClient(process.env.DBS_URL || ''); 
  // Fetch storage info
  useEffect(() => {
    const getStorageInfo = async () => {
      try {
        const storageInfo = await client.getStorageInfo();
        return storageInfo;  
      } catch (error) {
        console.log(error);
        return error;
      }
    }

    const getChainIds = (data: any) => {
      const chainIds = new Set();
      data.forEach((item: dbs_setting) => {
        (item.payment || []).forEach((paymentItem: payment) => {
          chainIds.add(paymentItem.chainId);
        });
      });
      return Array.from(chainIds);
    }
    // Fetch storage info
    getStorageInfo().then((storageInfo) => {
      // TODO: fix error on DBS.js when endpoint is empty / unavailable / wrong
      setDBSsettings(storageInfo as any)
      console.log(storageInfo);
      setDBSnetworks(getChainIds(storageInfo) as any);
    }).catch((err) => {
      console.log(err);
    })
  }, [])

  useEffect(() => {
    console.log(DBSnetworks);
  }, [DBSnetworks])
  
  return (
    <WagmiConfig client={wagmiClient}>
        <ConnectKitProvider
          options={{ initialChainId: 0 }}
          customTheme={connectKitTheme}
        >
      <div className="DBSUploader">  
        <TabsFile items={DBSsettings as dbs_setting[]} />
      </div>
      </ConnectKitProvider>
    </WagmiConfig>
  )
}

export default DBSUploader
