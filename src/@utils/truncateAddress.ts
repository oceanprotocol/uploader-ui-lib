export function truncateAddress(address: string, length: number = 4): string {
    if (!address) return "";
    if (address?.length <= length * 2 + 2) return address; // +2 for the "0x"
    return address.slice(0, length + 2) + "..." + address.slice(-length);
}
