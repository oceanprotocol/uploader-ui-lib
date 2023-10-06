
interface acceptedTokens {
    title: string
    value: string
}
  
interface payment {
    chainId: string
    acceptedTokens: acceptedTokens[]
}

interface uploader_setting {
    type: string,
    description: string
    payment: payment[]
}

interface uploaderParams {
    uploader_url: string
    uploader_account: string
}