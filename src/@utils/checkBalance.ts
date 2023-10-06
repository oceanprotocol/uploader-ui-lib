import { useAccount, useContractRead, useNetwork } from 'wagmi';

export async function checkBalance(): Promise<any> {
    try {
        const { address } = useAccount()
        const { chain } = useNetwork()
        
        // Get the ERC20 contract instance for WMATIC
        const minERC20Abi = [
            'function balanceOf(address owner) view returns (uint256)'
        ];
        const { data } = useContractRead({
            address: chain?.id === 80001 ? '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889' : '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
            abi: minERC20Abi,
            functionName: 'balanceOf',
            args: [address]
          })
          console.log('checkBalance data:', data)
        
          return data
    } catch (error) {
        console.error("Error checking WMATIC balance:", error);
        return false;
    }
}
