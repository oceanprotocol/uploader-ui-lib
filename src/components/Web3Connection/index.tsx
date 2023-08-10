require('dotenv').config()
import React from 'react'
import { WagmiConfig, createClient } from 'wagmi'
import { mainnet, polygon, goerli, polygonMumbai } from 'wagmi/chains'
import { ConnectKitProvider, getDefaultClient } from 'connectkit'
import DBSUploader from '../DBSUploader'

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
  '--ck-secondary-button-border-radius': 'var(--border-radius)',
  '--ck-body-color-muted': 'var(--font-color-text)'
}

type web3Params = {
    infuraId: string
    walletConnectProjectId: string
    dbs_url: string
    dbs_account: string
}

const Web3Connection = ({ infuraId, walletConnectProjectId, dbs_url, dbs_account }: web3Params) => {
  // Initialize the Wagmi client
  const wagmiClient = createClient(
    getDefaultClient({
      appName: 'Ocean DBS UI',
      infuraId: infuraId,
      chains: [mainnet, polygon, goerli, polygonMumbai],
      walletConnectProjectId: walletConnectProjectId || ''
    })
  )
  
  return (
    <WagmiConfig client={wagmiClient}>
        <ConnectKitProvider
            options={{ initialChainId: 0 }}
            customTheme={connectKitTheme}
        >
            <DBSUploader dbs_url={dbs_url} dbs_account={dbs_account}/>
      </ConnectKitProvider>
    </WagmiConfig>
  )
}

export default Web3Connection
