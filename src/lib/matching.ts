import { SupplyOffer, DemandRequest } from '../types';

export function matchSupplyAndDemand(
  demandRequest: DemandRequest,
  availableSupply: SupplyOffer[]
): SupplyOffer | null {
  // Filter compatible supply offers
  const compatibleSupply = availableSupply.filter(supply => 
    supply.available &&
    supply.cpuCores >= demandRequest.cpuCores &&
    supply.gpuCount >= demandRequest.gpuCount &&
    supply.ramGB >= demandRequest.ramGB &&
    supply.storageGB >= demandRequest.storageGB &&
    supply.pricePerHour <= demandRequest.maxPricePerHour &&
    (!demandRequest.gpuType || !supply.gpuType || supply.gpuType === demandRequest.gpuType)
  );

  if (compatibleSupply.length === 0) return null;

  // Sort by price (ascending) and then by performance score (descending)
  const sortedSupply = compatibleSupply.sort((a, b) => {
    // Primary sort: price (lower is better)
    if (a.pricePerHour !== b.pricePerHour) {
      return a.pricePerHour - b.pricePerHour;
    }
    
    // Secondary sort: performance score (higher is better)
    const scoreA = calculatePerformanceScore(a);
    const scoreB = calculatePerformanceScore(b);
    return scoreB - scoreA;
  });

  return sortedSupply[0];
}

export function calculatePerformanceScore(supply: SupplyOffer): number {
  // Simple performance scoring algorithm
  // This can be enhanced with more sophisticated metrics
  let score = 0;
  
  // CPU contribution (1 point per core)
  score += supply.cpuCores;
  
  // GPU contribution (10 points per GPU, bonus for high-end GPUs)
  score += supply.gpuCount * 10;
  if (supply.gpuType) {
    const highEndGPUs = ['RTX 4090', 'RTX 4080', 'V100', 'A100', 'H100'];
    if (highEndGPUs.some(gpu => supply.gpuType?.includes(gpu))) {
      score += supply.gpuCount * 5; // Bonus for high-end GPUs
    }
  }
  
  // RAM contribution (0.1 point per GB)
  score += supply.ramGB * 0.1;
  
  // Storage contribution (0.01 point per GB)
  score += supply.storageGB * 0.01;
  
  return score;
}

export function calculateTotalCost(pricePerHour: number, duration: number): number {
  return pricePerHour * duration;
}

export function calculateMatchCompatibility(
  demand: DemandRequest,
  supply: SupplyOffer
): {
  compatible: boolean;
  score: number;
  reasons: string[];
} {
  const reasons: string[] = [];
  let compatible = true;
  let score = 100;

  // Check hard requirements
  if (supply.cpuCores < demand.cpuCores) {
    compatible = false;
    reasons.push(`Insufficient CPU cores: need ${demand.cpuCores}, available ${supply.cpuCores}`);
  }

  if (supply.gpuCount < demand.gpuCount) {
    compatible = false;
    reasons.push(`Insufficient GPUs: need ${demand.gpuCount}, available ${supply.gpuCount}`);
  }

  if (supply.ramGB < demand.ramGB) {
    compatible = false;
    reasons.push(`Insufficient RAM: need ${demand.ramGB}GB, available ${supply.ramGB}GB`);
  }

  if (supply.storageGB < demand.storageGB) {
    compatible = false;
    reasons.push(`Insufficient storage: need ${demand.storageGB}GB, available ${supply.storageGB}GB`);
  }

  if (supply.pricePerHour > demand.maxPricePerHour) {
    compatible = false;
    reasons.push(`Price too high: ${supply.pricePerHour} > ${demand.maxPricePerHour} max budget`);
  }

  if (demand.gpuType && supply.gpuType && supply.gpuType !== demand.gpuType) {
    score -= 20;
    reasons.push(`GPU type mismatch: requested ${demand.gpuType}, available ${supply.gpuType}`);
  }

  if (!supply.available) {
    compatible = false;
    reasons.push('Supply offer is not available');
  }

  if (demand.status !== 'active') {
    compatible = false;
    reasons.push('Demand request is not active');
  }

  // Calculate efficiency score for compatible matches
  if (compatible) {
    // Price efficiency (lower price relative to max budget is better)
    const priceEfficiency = (demand.maxPricePerHour - supply.pricePerHour) / demand.maxPricePerHour;
    score += priceEfficiency * 30;

    // Resource efficiency (closer match to requirements is better)
    const cpuEfficiency = 1 - Math.min(0.5, (supply.cpuCores - demand.cpuCores) / demand.cpuCores);
    const ramEfficiency = 1 - Math.min(0.5, (supply.ramGB - demand.ramGB) / demand.ramGB);
    const storageEfficiency = 1 - Math.min(0.5, (supply.storageGB - demand.storageGB) / demand.storageGB);
    
    const resourceEfficiency = (cpuEfficiency + ramEfficiency + storageEfficiency) / 3;
    score += resourceEfficiency * 20;

    // Exact GPU type match bonus
    if (demand.gpuType && supply.gpuType === demand.gpuType) {
      score += 10;
      reasons.push(`Exact GPU type match: ${supply.gpuType}`);
    }

    reasons.push(`Compatibility score: ${Math.round(score)}/100`);
  }

  return {
    compatible,
    score: Math.max(0, Math.min(100, score)),
    reasons
  };
}

export function findBestMatches(
  demandRequest: DemandRequest,
  availableSupply: SupplyOffer[],
  limit: number = 5
): Array<{
  supply: SupplyOffer;
  compatibility: ReturnType<typeof calculateMatchCompatibility>;
}> {
  const matches = availableSupply
    .map(supply => ({
      supply,
      compatibility: calculateMatchCompatibility(demandRequest, supply)
    }))
    .filter(match => match.compatibility.compatible)
    .sort((a, b) => b.compatibility.score - a.compatibility.score)
    .slice(0, limit);

  return matches;
}