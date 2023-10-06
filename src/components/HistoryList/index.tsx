import React, { ReactElement, useEffect, useState } from 'react'
import Button from '../Button'
import styles from './index.module.css'
import { addEllipsesToText } from '../../@utils/textFormat'
import Loader from '../Loader';
import { useAccount } from 'wagmi'
import { getStatusMessage } from '../../@utils/statusCode'
import { getLink } from '../../@utils/linkAsset'
import Pagination from './pagination';

const HistoryList = ({
  items,
  tabIndex,
  uploads,
  historyUnlocked,
  getHistoryList,
  historyLoading
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
  const { isConnected } = useAccount()
  
  const [currentPage, setCurrentPage] = useState(1);
  const [files, setFiles] = React.useState<any[]>([]); 

  const ITEMS_PER_PAGE = 25;

  useEffect(() => {
    setFiles(uploads)
  }, [uploads])

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentFiles = Array.isArray(files) ? files.slice(startIndex, endIndex) : [];
  const totalPages = Array.isArray(files) ? Math.ceil(files.length / ITEMS_PER_PAGE) : 0;
  
  return (
    <>
      <div className={styles.historyListTable}>
        <table className={styles.tableAssets} key={`table_${items[tabIndex].type}`}>
          <thead>
            <tr>
              <th>Quote ID</th>
              <th>Status Message</th>
              <th>DDO Link</th>
              <th>{'Preview'}</th>
            </tr>
          </thead>
          <tbody className={historyUnlocked ? styles.historyUnlocked : styles.historyLocked}>
            {currentFiles.map((file: any, index: number) => (
              <tr key={`table_uploads_${items[tabIndex].type}_${index}`}>
                <td>{addEllipsesToText(file.quoteId, 15)}</td>
                <td>{getStatusMessage(file.status, items[tabIndex].type)}</td>
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
            {
              currentFiles.length === 0 &&
              <tr>
                <td colSpan={5}>
                  <p className={styles.emptyList}>There's no files uploaded!</p>
                </td>
              </tr>
            }
          </tbody>
          {
            isConnected && !historyUnlocked &&
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
            historyUnlocked && totalPages > 1 &&
            <Pagination 
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={(page: number) => { setCurrentPage(page); }}
            />
        }
    </>
  )
}

export default HistoryList
