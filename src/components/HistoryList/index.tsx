import React, { ReactElement, useEffect } from 'react'
import Button from '../Button'
import styles from './index.module.css'
import { GetLinkResult } from '@oceanprotocol/dbs'
import { addEllipsesToText } from '../../@utils/textFormat'

const HistoryList = ({
  items,
  tabIndex,
  uploads,
  dbsClient,
  historyUnlocked,
  getHistoryList
}: {
  items: any
  tabIndex: number
  uploads: any
  dbsClient: any
  historyUnlocked: boolean
  getHistoryList: any
}): ReactElement => {
  const [files, setFiles] = React.useState<any>({})

  const getDDOlink = async (quoteId: any) => {
    try {
      console.log('get DDO link: ', quoteId);
      const linkResult: GetLinkResult[] = await dbsClient.getLink(quoteId)
      console.log('ddo link result:', linkResult)
      const newFile = files.map((file: any) => {
        if (file.quoteId === quoteId) {
          file.ddo = linkResult[0]
        }
        return file
      })
      setFiles(newFile)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    setFiles(uploads)
  }, [uploads])
  
  return (
    <div className={styles.historyListTable}>
      <table className={styles.tableAssets} key={`table_${items[tabIndex].type}`}>
        <thead>
          <tr>
            <th>Quote ID</th>
            <th>Status Message</th>
            <th>Status Code</th>
            <th>DDO Link</th>
            <th>{'Preview'}</th>
          </tr>
        </thead>
        <tbody className={historyUnlocked ? styles.historyUnlocked : styles.historyLocked}>
          {files.length > 0 && files.map((file: any, index: number) => (
            <tr key={`table_uploads_${items[tabIndex].type}_${index}`}>
              <td>{addEllipsesToText(file.quoteId, 15)}</td>
              <td>{file.statusMessage}</td>
              <td>{file.statusCode}</td>
              <td>{file?.ddo?.transactionHash}</td>
              <td>
                <Button
                  style="primary"
                  className={styles.tableButton}
                  size="small"
                  onClick={(e: React.SyntheticEvent) => {
                    e.preventDefault()
                    getDDOlink(file.quoteId)
                  }}
                >
                  {file.statusCode === 400 ? 'Get Link' : 'Not available'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
        {
          !historyUnlocked &&
          <Button
            className={styles.unlockButton}
            style="primary"
            size="small"
            onClick={(e: React.SyntheticEvent) => {
              e.preventDefault()
              getHistoryList()
            }}
            disabled={false}
          >
            {`Unlock`}
          </Button>
        }
      </table>
    </div>
  )
}

export default HistoryList
