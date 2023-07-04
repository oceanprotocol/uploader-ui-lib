import React from 'react'
import { WagmiConfig, createConfig, mainnet } from 'wagmi'
import { createPublicClient, http } from 'viem'

import '../../stylesGlobal/styles.css'
import './index.module.css'
import TabsFile from '../TabsFile'

// TODO: connect to remote DBSclient
// import DBSClient from 'dbs/src/index';

const config = createConfig({
  autoConnect: true,
  publicClient: createPublicClient({
    chain: mainnet,
    transport: http()
  }),
})

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
    <WagmiConfig config={config}>
      <div className="DBSUploader">  
        <TabsFile items={dbs_settings as any} />
      </div>
    </WagmiConfig>
  )
}

export default DBSUploader
