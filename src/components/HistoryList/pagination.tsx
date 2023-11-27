import React from 'react'
import styles from './pagination.module.css'

interface PaginationProps {
  totalPages: number
  currentPage: number
  onRefresh: () => void
  onPageChange: (page: number) => void
}

const Pagination = ({
  totalPages,
  currentPage,
  onRefresh,
  onPageChange
}: PaginationProps) => {
  // Define the number of pages to show at the beginning and end
  const pagesToShow = 3

  // Calculate the start and end range of pages to display
  let startPage = Math.max(1, currentPage - pagesToShow)
  let endPage = Math.min(totalPages, currentPage + pagesToShow)

  // If we have less than the required number of pages to show at the beginning,
  // adjust the endPage to display enough pages.
  if (currentPage <= pagesToShow) {
    endPage = Math.min(
      currentPage + pagesToShow + (pagesToShow - currentPage),
      totalPages
    )
  }

  // If we have less than the required number of pages to show at the end,
  // adjust the startPage to display enough pages.
  if (currentPage >= totalPages - pagesToShow) {
    startPage = Math.max(
      currentPage -
        pagesToShow -
        (pagesToShow - (totalPages - currentPage - 1)),
      1
    )
  }

  // Generate the pageNumbers array based on the calculated startPage and endPage
  const pageNumbers = []
  if (startPage > 1) {
    pageNumbers.push(1)
    if (startPage > 2) {
      pageNumbers.push('...')
    }
  }
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i)
  }
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pageNumbers.push('...')
    }
    pageNumbers.push(totalPages)
  }

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    onPageChange(page)
  }

  return (
    <div className={styles.paginationContainer}>
      <ul className={styles.pagination}>
        <li className={`${currentPage === 1 ? styles.prevNextDisabled : ''}`}>
          <a
            className={`${styles.prev}`}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </a>
        </li>

        {pageNumbers.map((page) => (
          <li
            key={page}
            className={`${currentPage === page ? styles.current : ''}`}
          >
            <a
              className={`${styles.number}`}
              onClick={() => {
                if (typeof page === 'number') handlePageChange(page)
              }}
            >
              {page}
            </a>
          </li>
        ))}

        <li
          className={`${
            currentPage === totalPages ? styles.prevNextDisabled : ''
          } ${styles.next}`}
        >
          <a
            className={`${styles.next}`}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </a>
        </li>
        <li className={`${styles.refreshButton} ${styles.next}`}>
          <a className={`${styles.next}`} onClick={onRefresh}>
            Refresh
          </a>
        </li>
      </ul>
    </div>
  )
}

export default Pagination
