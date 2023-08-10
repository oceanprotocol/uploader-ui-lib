import React, { ReactElement, useEffect } from 'react'
import Button from '../Button'
import styles from './index.module.css'
import { GetLinkResult } from '@oceanprotocol/dbs'

const HistoryList = ({
  items,
  tabIndex,
  uploads,
  dbsClient
}: {
  items: any
  tabIndex: number
  uploads: any
  dbsClient: any
}): ReactElement => {
  const [files, setFiles] = React.useState<any>({})

  const getDDOlink = async (quoteId: any) => {
    try {
      console.log('get DDO link: ', { quoteId });
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
    <table className={styles.tableAssets} key={`table_${items[tabIndex].type}`}>
      <thead>
        <tr>
          <th>Quote ID</th>
          <th>Status Message</th>
          <th>Status Code</th>
          <th>Hash</th>
          <th>{'Preview'}</th>
        </tr>
      </thead>
      <tbody>
        {files.length > 0 && files.map((file: any, index: number) => (
          <tr key={`table_uploads_${items[tabIndex].type}_${index}`}>
            <td>{file.quoteId}</td>
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
    </table>
  )
}

export default HistoryList
