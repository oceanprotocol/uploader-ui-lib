require('dotenv').config()
import React, { useEffect } from 'react'
import { useSigner } from 'wagmi'

import '../../stylesGlobal/styles.css'
import './index.module.css'
import TabsFile from '../TabsFile'

import {DBSClient} from '@oceanprotocol/dbs';

const DBSComponent = ({ dbs_url, dbs_account }: dbsParams) => {
  const [ DBSsettings, setDBSsettings ] = React.useState([])
  const [ loading, setLoading ] = React.useState(true)
  const {data: signer} = useSigner()
  // Initialize the DBSClient with the API base URL
  /*
  TODO: remove after fix
  test env variables vercel
  */
  dbs_url = process.env.DBS_URL as any;
  dbs_account = process.env.DBS_ACCOUNT as any;

  console.log('dbs_url: ', dbs_url);
  console.log('dbs_account: ', dbs_account);

  console.log('dbs_url: ', process.env.STORYBOOK_DBS_URL);


  // TODO: fix any type
  const client = new DBSClient(dbs_url, dbs_account, signer as any);
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
    // Fetch storage info
    getStorageInfo().then((storageInfo: any) => {
      // TODO: fix error on DBS.js when endpoint is empty / unavailable / wrong
      setDBSsettings(storageInfo)
      setLoading(false)
    }).catch((err) => {
      console.log(err);
    })
  }, [signer])
  
  return (
    <div className="DBSComponent">  
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

export default DBSComponent
