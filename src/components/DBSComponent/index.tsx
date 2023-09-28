import React, { useEffect } from 'react'
import { useEthersSigner } from '../../@utils/useEthersSigner'

import '../../stylesGlobal/styles.css'
import './index.module.css'
import TabsFile from '../TabsFile'

import {UploaderClient} from '@oceanprotocol/uploader';

const DBSComponent = ({ dbs_url, dbs_account }: dbsParams) => {
  const [ DBSsettings, setDBSsettings ] = React.useState([])
  const [ loading, setLoading ] = React.useState(true)
  const signer = useEthersSigner()

  // TODO: fix any type
  const client = new UploaderClient(dbs_url, dbs_account, signer);
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
      <h1>Ocean Uploader</h1>  
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
