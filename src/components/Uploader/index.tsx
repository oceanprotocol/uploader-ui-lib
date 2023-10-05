import React from 'react'
import { WagmiConfig, createConfig } from 'wagmi'
import { polygon, polygonMumbai } from 'wagmi/chains'
import { ConnectKitProvider, getDefaultConfig } from 'connectkit'
import UploaderConnection from '../UploaderConnection'

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
    uploader_url: string
    uploader_account: string
}

const Uploader = ({ infuraId, walletConnectProjectId, uploader_url, uploader_account }: web3Params) => {
  
  // Initialize the Wagmi client
  const wagmiConfig = createConfig(
    getDefaultConfig({
      appName: 'Ocean Uploader UI',
      infuraId: infuraId,
      chains: [polygon, polygonMumbai],
      walletConnectProjectId: walletConnectProjectId || ''
    })
  )
  
  return (
    <WagmiConfig config={wagmiConfig}>
        <ConnectKitProvider
            options={{ initialChainId: 137 }}
            customTheme={connectKitTheme}
        >
            <UploaderConnection uploader_url={uploader_url} uploader_account={uploader_account}/>
      </ConnectKitProvider>
    </WagmiConfig>
  )
}

export default Uploader
