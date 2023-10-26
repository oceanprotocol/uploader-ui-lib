require('dotenv').config()
import React from 'react'
import { WagmiConfig, createConfig } from 'wagmi'
import { polygon, polygonMumbai } from 'wagmi/chains'
import {
  ConnectKitProvider,
  getDefaultConfig,
  ConnectKitButton
} from 'connectkit'
import { StoryFn, Meta } from '@storybook/react'
import UploaderConnection from './index'

export default {
  title: 'DBS UI Library/DBSUploader',
  component: UploaderConnection,
  parameters: {
    controls: {
      exclude: /.*/g
    }
  }
} as Meta<typeof UploaderConnection>

const Template: StoryFn<typeof UploaderConnection> = (args) => {
  // initialize the Wagmi client
  const wagmiConfig = createConfig(
    getDefaultConfig({
      appName: 'Ocean Uploader UI',
      infuraId: process.env.PUBLIC_INFURA_PROJECT_ID,
      chains: process.env.ENABLE_DEVELOPMENT
        ? [polygon, polygonMumbai]
        : [polygon],
      walletConnectProjectId: 'Your wallet connect project ID'
    })
  )

  return (
    <WagmiConfig config={wagmiConfig}>
      <ConnectKitProvider>
        {/* Your App */}
        <ConnectKitButton />
        <UploaderConnection {...args} />
      </ConnectKitProvider>
    </WagmiConfig>
  )
}

export const uploaderConnection = Template.bind({})
uploaderConnection.args = {
  uploader_url: process.env.UPLOADER_URL,
  uploader_account: process.env.UPLOADER_ACCOUNT,
  infuraId: process.env.PUBLIC_INFURA_PROJECT_ID || undefined,
  walletConnectProjectId: process.env.PUBLIC_WALLETCONNECT_PROJECT_ID
}
