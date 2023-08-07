require('dotenv').config()
import React, { useEffect } from 'react'
import { useSigner } from 'wagmi'

import '../../stylesGlobal/styles.css'
import './index.module.css'
import TabsFile from '../TabsFile'

import {DBSClient} from '@oceanprotocol/dbs';

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
}

const DBSUploader = ({ dbs_url }: dbsParams) => {
  const [ DBSsettings, setDBSsettings ] = React.useState([])
  const [ loading, setLoading ] = React.useState(true)
  const {data: signer} = useSigner()
  // Initialize the DBSClient with the API base URL
  console.log('dbs_url: ', dbs_url);
  // TODO: fix any type
  const client = new DBSClient(dbs_url, signer as any);
  console.log(signer);
  
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
      setLoading(false)
    }).catch((err) => {
      console.log(err);
    })
  }, [signer])
  
  return (
    <div className="DBSUploader">  
      { DBSsettings.length === 0 && loading && <div>Loading...</div> }
      { DBSsettings.length > 0 && 
        <TabsFile items={DBSsettings as dbs_setting[]} dbsClient={client} />
      }
      {
        DBSsettings.length === 0 && !loading && (
          <p>DBS Not available</p>
        )
      }
    </div>
  )
}

export default DBSUploader
