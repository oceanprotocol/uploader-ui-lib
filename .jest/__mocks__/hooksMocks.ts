jest.mock('wagmi', () => ({
  useNetwork: () => ({
    account: '0x123',
    chainId: 1,
    networkId: 1
  }),
  useSwitchNetwork: () => ({ switchNetwork: () => jest.fn() }),
  useProvider: () => jest.fn(),
  createClient: () => jest.fn()
}))

jest.mock('wagmi/chains', () => ({
  mainnet: {
    chainId: 1,
    networkId: 1,
    name: 'mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/123',
    explorerURLs: {
      address: 'https://etherscan.io/address',
      transaction: 'https://etherscan.io/tx'
    },
    explorerName: 'Etherscan'
  },
  polygon: {
    chainId: 137,
    networkId: 137,
    name: 'polygon',
    rpcUrl: 'https://polygon-mainnet.infura.io/v3/123',
    explorerURLs: {
      address: 'https://polygonscan.com/address',
      transaction: 'https://polygonscan.com/tx'
    },
    explorerName: 'Polygonscan'
  },
  mumbai: {
    chainId: 80001,
    networkId: 80001,
    name: 'mumbai',
    rpcUrl: 'https://polygon-mumbai.infura.io/v3/123',
    explorerURLs: {
      address: 'https://mumbai.polygonscan.com/address',
      transaction: 'https://mumbai.polygonscan.com/tx'
    },
    explorerName: 'Mumbai Polygonscan'
  },
  goerli: {
    chainId: 5,
    networkId: 5,
    name: 'goerli',
    rpcUrl: 'https://goerli.infura.io/v3/123',
    explorerURLs: {
      address: 'https://goerli.etherscan.io/address',
      transaction: 'https://goerli.etherscan.io/tx'
    },
    explorerName: 'Goerli Etherscan'
  }
}))
