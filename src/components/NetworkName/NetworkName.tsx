export function getNetworkDisplayName(chainId: number): string {
  let displayName
  if (!chainId) return 'Unknown'

  switch (chainId) {
    case 1:
      displayName = 'Ethereum'
      break
    case 137:
      displayName = 'Polygon'
      break
    case 1285:
      displayName = 'Moonriver'
      break
    case 80001:
      displayName = 'Mumbai'
      break
    case 8996:
      displayName = 'Development'
      break
    case 5:
      displayName = 'Görli'
      break
    case 2021000:
      displayName = 'GAIA-X'
      break
    default:
      displayName = 'Unrecognized'
      break
  }

  return displayName
}
