import React from 'react'
import { WagmiConfig, createConfig } from 'wagmi'
import { polygon } from 'wagmi/chains'
import {
  ConnectKitProvider,
  getDefaultConfig,
  ConnectKitButton
} from 'connectkit'
import DBSComponent from '../DBSComponent'

export default function App () {
  // Initialize the Wagmi client
  const wagmiConfig = createConfig(
    getDefaultConfig({
      appName: 'Ocean Uploader UI',
      infuraId: 'Your infura ID',
      chains: [polygon],
      walletConnectProjectId: 'Your wallet connect project ID'
    })
  )

  return (
    <WagmiConfig config={wagmiConfig}>
      <ConnectKitProvider>
        {/* Your App */}
        <ConnectKitButton />
        <DBSComponent
          dbs_url="https://dbs.oceanprotocol.com"
          dbs_account="0x21F2B4d705aC448c9Ff96694Dd9e5901F79f1Ab2"
        />
      </ConnectKitProvider>
    </WagmiConfig>
  )
}
