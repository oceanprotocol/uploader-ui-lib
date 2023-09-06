import React, { ReactElement, useEffect } from 'react'
import Button from '../Button'
import styles from './index.module.css'
import { addEllipsesToText } from '../../@utils/textFormat'
import Loader from '../Loader';
import { getStatusMessage } from '../../@utils/statusCode'
import { getLink } from '../../@utils/linkAsset'
import Pagination from './pagination';

const HistoryList = ({
  items,
  tabIndex,
  uploads,
  historyUnlocked,
  getHistoryList,
  historyLoading,
  historyPage,
  historyTotalPages,
  changeHistoryPage
}: {
  items: any
  tabIndex: number
  uploads: any
  historyUnlocked: boolean
  getHistoryList: any
  historyLoading: boolean
  historyPage: number
  historyTotalPages: number
  changeHistoryPage: any
}): ReactElement => {
  const [files, setFiles] = React.useState<any>({})

  useEffect(() => {
    setFiles(uploads)
  }, [uploads])
  
  return (
    <>
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
                <td>{getStatusMessage(file.status, items[tabIndex].type)}</td>
                <td>{file.status}</td>
                <td>{file?.transactionHash || file?.cid}</td>
                <td>
                  <Button
                    style="primary"
                    className={styles.tableButton}
                    size="small"
                    onClick={(e: React.SyntheticEvent) => {
                      e.preventDefault()
                      getLink(items[tabIndex].type, file?.transactionHash || file?.cid)
                    }}
                    disabled={file.status !== 400}
                  >
                    {file.status === 400 ? 'Open Asset' : 'Not available'}
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
                if (historyLoading) return
                e.preventDefault()
                getHistoryList()
              }}
              disabled={false}
            >
              {historyLoading ? <Loader /> : `Unlock`}
            </Button>
          }
        </table>
      </div>
      {
        historyUnlocked && historyTotalPages > 1 &&
        <Pagination 
          totalPages={historyTotalPages}
          currentPage={historyPage}
          onPageChange={(page: number) => { changeHistoryPage(page)}}
        />
      }
    </>
  )
}

export default HistoryList
