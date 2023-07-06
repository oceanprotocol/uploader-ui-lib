require('dotenv').config()
import React from 'react'
import { WagmiConfig, createClient } from 'wagmi'
import { mainnet, polygon, goerli, polygonMumbai } from 'wagmi/chains'
import { ConnectKitProvider, getDefaultClient } from 'connectkit'

import '../../stylesGlobal/styles.css'
import './index.module.css'
import TabsFile from '../TabsFile'

// TODO: connect to remote DBSclient
// import DBSClient from 'dbs/src/index';

// Wagmi client
export const wagmiClient = createClient(
  getDefaultClient({
    appName: 'Ocean Market',
    infuraId: process.env.PUBLIC_INFURA_PROJECT_ID,
    // TODO: mapping between appConfig.chainIdsSupported and wagmi chainId
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

type dbs_setting = {
  title: string,
  content: string
  payment: {
    chainId: number
    tokenAddress: string
  }
  field: {
    name: string
    className: string
  }
}

type Props = {
  dbs_settings: dbs_setting[]
}

const DBSUploader = ({ dbs_settings }: Props) => {

  /*
  // Initialize the DBSClient with the API base URL
  const client = new DBSClient('https://api.example.com');

  console.log(client);

  // Fetch storage info
  (async () => {
    // Fetch storage info
    const storageInfo = await client.getStorageInfo();
    console.log(storageInfo);
  })();
  */
  
  return (
    <WagmiConfig client={wagmiClient}>
        <ConnectKitProvider
          options={{ initialChainId: 0 }}
          customTheme={connectKitTheme}
        >
      <div className="DBSUploader">  
        <TabsFile items={dbs_settings as any} />
      </div>
      </ConnectKitProvider>
    </WagmiConfig>
  )
}

export default DBSUploader
