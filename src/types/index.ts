export interface SupplyOffer {
  id: string;
  walletAddress: string;
  cpuCores: number;
  gpuCount: number;
  gpuType?: string;
  ramGB: number;
  storageGB: number;
  pricePerHour: number;
  available: boolean;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DemandRequest {
  id: string;
  walletAddress: string;
  cpuCores: number;
  gpuCount: number;
  gpuType?: string;
  ramGB: number;
  storageGB: number;
  maxPricePerHour: number;
  duration: number;
  jobDescription?: string;
  status: 'active' | 'matched' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface Match {
  id: string;
  supplyOfferId: string;
  demandRequestId: string;
  agreedPrice: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  txHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  matchId: string;
  txHash: string;
  amount: number;
  token: string;
  status: 'pending' | 'confirmed' | 'failed';
  createdAt: Date;
}