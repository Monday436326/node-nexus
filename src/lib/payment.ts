import { ethers } from 'ethers';

const USDC_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)"
];

export async function payWithUSDC(
  signer: ethers.Signer,
  recipientAddress: string,
  amount: number,
  contractAddress: string = process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS!
): Promise<string> {
  try {
    if (!contractAddress) {
      throw new Error('USDC contract address not configured');
    }

    const usdcContract = new ethers.Contract(contractAddress, USDC_ABI, signer);
    
    // USDC has 6 decimals on most networks
    const decimals = await usdcContract.decimals();
    const amountInWei = ethers.parseUnits(amount.toString(), decimals);
    
    // Check balance first
    const signerAddress = await signer.getAddress();
    const balance = await usdcContract.balanceOf(signerAddress);
    
    if (balance < amountInWei) {
      throw new Error(`Insufficient USDC balance. Required: ${amount}, Available: ${ethers.formatUnits(balance, decimals)}`);
    }
    
    // Estimate gas
    const gasEstimate = await usdcContract.transfer.estimateGas(recipientAddress, amountInWei);
    const gasLimit = gasEstimate * BigInt(120) / BigInt(100); // Add 20% buffer
    
    const tx = await usdcContract.transfer(recipientAddress, amountInWei, {
      gasLimit
    });
    
    await tx.wait();
    
    return tx.hash;
  } catch (error) {
    console.error('USDC payment failed:', error);
    if (error instanceof Error) {
      throw new Error(`Payment failed: ${error.message}`);
    }
    throw new Error('Payment failed: Unknown error');
  }
}

export async function getUSDCBalance(
  provider: ethers.Provider,
  walletAddress: string,
  contractAddress: string = process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS!
): Promise<number> {
  try {
    if (!contractAddress) {
      console.warn('USDC contract address not configured');
      return 0;
    }

    const usdcContract = new ethers.Contract(contractAddress, USDC_ABI, provider);
    const balance = await usdcContract.balanceOf(walletAddress);
    const decimals = await usdcContract.decimals();
    
    return parseFloat(ethers.formatUnits(balance, decimals));
  } catch (error) {
    console.error('Failed to get USDC balance:', error);
    return 0;
  }
}

export async function approveUSDC(
  signer: ethers.Signer,
  spenderAddress: string,
  amount: number,
  contractAddress: string = process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS!
): Promise<string> {
  try {
    if (!contractAddress) {
      throw new Error('USDC contract address not configured');
    }

    const usdcContract = new ethers.Contract(contractAddress, USDC_ABI, signer);
    const decimals = await usdcContract.decimals();
    const amountInWei = ethers.parseUnits(amount.toString(), decimals);
    
    const tx = await usdcContract.approve(spenderAddress, amountInWei);
    await tx.wait();
    
    return tx.hash;
  } catch (error) {
    console.error('USDC approval failed:', error);
    throw error;
  }
}

export async function getUSDCAllowance(
  provider: ethers.Provider,
  ownerAddress: string,
  spenderAddress: string,
  contractAddress: string = process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS!
): Promise<number> {
  try {
    if (!contractAddress) {
      return 0;
    }

    const usdcContract = new ethers.Contract(contractAddress, USDC_ABI, provider);
    const allowance = await usdcContract.allowance(ownerAddress, spenderAddress);
    const decimals = await usdcContract.decimals();
    
    return parseFloat(ethers.formatUnits(allowance, decimals));
  } catch (error) {
    console.error('Failed to get USDC allowance:', error);
    return 0;
  }
}

export function formatUSDC(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 6
  }).format(amount);
}

export function validateWalletAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function validateTransactionHash(hash: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
}