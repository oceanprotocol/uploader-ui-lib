export function getLink(provider: string, item: string) {
    let link;
    switch (provider) {
      case 'filecoin':
        link = `https://gateway.ipfs.io/ipfs/${item}`
        break;
      case 'arweave':
        link = `https://arweave.net/${item}`
        break;
      default:
        break;
    }
    window.open(link, "_blank");
}