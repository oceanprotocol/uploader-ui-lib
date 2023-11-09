import React, { useEffect } from 'react'
import { useEthersSigner } from '../../@utils/useEthersSigner'

import '../../stylesGlobal/styles.css'
import styles from './index.module.css'
import TabsFile from '../TabsFile'

import { UploaderClient } from '@oceanprotocol/uploader'

const UploaderConnection = ({
  uploader_url,
  uploader_account
}: uploaderParams) => {
  const [uploaderSettings, setUploaderSettings] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const signer = useEthersSigner()

  // TODO: fix any type
  const client = new UploaderClient(uploader_url, uploader_account, signer)
  // Fetch storage info
  useEffect(() => {
    // Fetch storage info from Uploader endpoint
    const getStorageInfo = async () => {
      try {
        let storageInfo = await client.getStorageInfo()
        storageInfo = storageInfo.sort((a, b) => {
          if (a.type < b.type) {
            return -1
          } else return 1
        })
        return storageInfo
      } catch (error) {
        console.log(error)
        setLoading(false)
        return error
      }
    }
    // Fetch storage info
    getStorageInfo()
      .then((storageInfo: any) => {
        // TODO: fix error on Uploader.js when endpoint is empty / unavailable / wrong
        setUploaderSettings(storageInfo)
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [signer])

  return (
    <div className={styles.UploaderConnection}>
      {uploaderSettings.length === 0 && loading && <div>Loading...</div>}
      {uploaderSettings.length > 0 && (
        <TabsFile
          items={uploaderSettings as uploader_setting[]}
          uploaderClient={client}
        />
      )}
      {uploaderSettings.length === 0 && !loading && (
        <p>Uploader Not available</p>
      )}
    </div>
  )
}

export default UploaderConnection
