export function getStatusMessage(statusCode: number, storage: string) {
  console.log('getStatusMessage')
  console.log(statusCode, storage)
  let statusMessages: any
  switch (storage) {
    case 'filecoin':
      statusMessages = {
        0: 'No such quote',
        99: 'Waiting for files to be uploaded by the user',
        199: 'Inadequate Balance or token Allowance given',
        300: 'Uploading files to storage',
        399: 'CID migrated to lighthouse node, creating filecoin deal',
        400: 'Deal created on filecoin network',
        401: 'Upload failure'
      }
      break
    default:
      statusMessages = {
        0: 'No such quote',
        1: 'Waiting for files to be uploaded by the user',
        99: 'Waiting for files to be uploaded by the user',
        100: 'Processing payment...',
        101: 'Processing payment...',
        102: 'Processing payment...',
        200: 'Processing payment failure',
        299: 'Processing payment failure',
        300: 'Uploading file to storage',
        400: 'Upload done!',
        401: 'Upload failure modes',
        402: 'File length exceeds quote',
        404: 'Upload failed!'
      }
      break
  }
  return statusMessages[statusCode]
}
