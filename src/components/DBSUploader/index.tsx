require('dotenv').config()
import React, { useEffect } from 'react'
import { WagmiConfig, createClient } from 'wagmi'
import { mainnet, polygon, goerli, polygonMumbai } from 'wagmi/chains'
import { ConnectKitProvider, getDefaultClient } from 'connectkit'

import '../../stylesGlobal/styles.css'
import './index.module.css'
import TabsFile from '../TabsFile'

import {DBSClient} from '@oceanprotocol/dbs';

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

export type acceptedTokens = {
  title: string
  value: string
}

export type payment = {
  chainId: string
  acceptedTokens: acceptedTokens[]
}

export type dbs_setting = {
  type: string,
  description: string
  payment: payment[]
}

type dbsParams = {
  dbs_url: string
  infuraId: string
  walletConnectProjectId: string
}

const DBSUploader = ({ dbs_url, infuraId, walletConnectProjectId }: dbsParams) => {
  const [ DBSsettings, setDBSsettings ] = React.useState([])
  const [ networksChainIds, setNetworksChainIds ] = React.useState([])
  const [ loading, setLoading ] = React.useState(true)
  // Initialize the DBSClient with the API base URL
  console.log('dbs_url: ', dbs_url);
  const client = new DBSClient(dbs_url);
  // Initialize the Wagmi client
  const wagmiClient = createClient(
    getDefaultClient({
      appName: 'Ocean DBS UI',
      infuraId: infuraId,
      chains: [mainnet, polygon, goerli, polygonMumbai],
      walletConnectProjectId: walletConnectProjectId || ''
    })
  )
  // Fetch storage info
  useEffect(() => {
    // Fetch storage info from DBS endpoint
    const getStorageInfo = async () => {
      try {
        const storageInfo = await client.getStorageInfo();
        return storageInfo;  
      } catch (error) {
        console.log(error);
        setLoading(false)
        return error;
      }
    }
    // Get chainIds from DBS settings
    const getChainIds = (DBSsettings: any) => {
      const chainIds = new Set();
      DBSsettings.forEach((item: dbs_setting) => {
        (item.payment || []).forEach((paymentItem: payment) => {
          chainIds.add(parseInt(paymentItem.chainId));
        });
      });
      return Array.from(chainIds);
    }
    // Fetch storage info
    getStorageInfo().then((storageInfo: any) => {
      const chainIds: any = getChainIds(storageInfo);
      // TODO: fix error on DBS.js when endpoint is empty / unavailable / wrong
      setDBSsettings(storageInfo)
      setNetworksChainIds(chainIds)
      setLoading(false)
    }).catch((err) => {
      console.log(err);
    })
  }, [])
  
  return (
    <WagmiConfig client={wagmiClient}>
        <ConnectKitProvider
          options={{ initialChainId: 0 }}
          customTheme={connectKitTheme}
        >
      <div className="DBSUploader">  
        { DBSsettings.length === 0 && loading && <div>Loading...</div> }
        { DBSsettings.length > 0 && 
          <TabsFile items={DBSsettings as dbs_setting[]} availableNetworks={networksChainIds} dbsClient={client} />
        }
        {
          DBSsettings.length === 0 && !loading && (
            <p>DBS Not available</p>
          )
        }
      </div>
      </ConnectKitProvider>
    </WagmiConfig>
  )
}

export default DBSUploader
