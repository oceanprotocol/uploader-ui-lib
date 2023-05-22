import React from 'react'

import '../../stylesGlobal/styles.css'
import './index.module.css'
import TabsFile from '../TabsFile'

import DBSClient from 'dbs/src/index';

type dbs_setting = {
  title: string,
  content: string
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
    <div className="DBSUploader"> 
      <TabsFile items={dbs_settings as any} />
    </div>
  )
}

export default DBSUploader
