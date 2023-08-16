
interface acceptedTokens {
    title: string
    value: string
}
  
interface payment {
    chainId: string
    acceptedTokens: acceptedTokens[]
}

interface dbs_setting {
    type: string,
    description: string
    payment: payment[]
}

interface dbsParams {
    dbs_url: string
    dbs_account: string
}