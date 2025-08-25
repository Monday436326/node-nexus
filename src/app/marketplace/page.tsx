'use client';

import { useState, useEffect } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { ComputeCard } from '../../components/ComputeCard';
import { TransactionModal } from '../../components/TransactionalModal';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { SupplyOffer, DemandRequest, Match } from '../../types';
import { payWithUSDC } from '../../lib/payment';
import { ethers } from 'ethers';
import { 
  RefreshCw, 
  TrendingUp, 
  Users, 
  Activity,
  Filter,
  Search,
  BarChart3,
  Database
} from 'lucide-react';

export default function MarketplacePage() {
  const [supplyOffers, setSupplyOffers] = useState<SupplyOffer[]>([]);
  const [demandRequests, setDemandRequests] = useState<DemandRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'supply' | 'demand'>('supply');
  const [matchingLoading, setMatchingLoading] = useState<string | null>(null);
  const [txModal, setTxModal] = useState({
    isOpen: false,
    status: 'pending' as 'pending' | 'success' | 'error',
    txHash: '',
    message: '',
    amount: 0
  });
  
  const { primaryWallet } = useDynamicContext();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    
    try {
      const [supplyRes, demandRes] = await Promise.all([
        fetch('/api/supply'),
        fetch('/api/demand')
      ]);
      
      const supply = await supplyRes.json();
      const demand = await demandRes.json();
      
      setSupplyOffers(supply);
      setDemandRequests(demand);
    } catch (error) {
      console.error('Failed to fetch marketplace data:', error);
    }
    
    setLoading(false);
    if (showRefresh) setRefreshing(false);
  };

  const handleMatch = async (demandId: string, supplyId: string) => {
    if (!primaryWallet?.address) {
      alert('Please connect your wallet first');
      return;
    }

    setMatchingLoading(demandId);

    try {
      setTxModal({
        isOpen: true,
        status: 'pending',
        txHash: '',
        message: 'Processing match and payment...',
        amount: 0
      });

      // Create match
      const matchResponse = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          demandRequestId: demandId,
          supplyOfferId: supplyId
        })
      });

      if (!matchResponse.ok) {
        throw new Error('Failed to create match');
      }

      const match: Match = await matchResponse.json();
      const demand = demandRequests.find(d => d.id === demandId);
      const supply = supplyOffers.find(s => s.id === supplyId);
      
      if (!demand || !supply) {
        throw new Error('Invalid match data');
      }

      const totalCost = match.agreedPrice * demand.duration;
      
      // Process payment
      if (!window.ethereum) {
        throw new Error('Ethereum provider not found. Please install MetaMask.');
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const txHash = await payWithUSDC(
        signer,
        supply.walletAddress,
        totalCost
      );

      // Update match with transaction hash
      await fetch(`/api/match/${match.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txHash, status: 'active' })
      });

      setTxModal({
        isOpen: true,
        status: 'success',
        txHash,
        message: 'Match created and payment processed successfully',
        amount: totalCost
      });

      // Refresh marketplace data
      fetchData();

    } catch (error) {
      console.error('Match failed:', error);
      setTxModal({
        isOpen: true,
        status: 'error',
        txHash: '',
        message: error instanceof Error ? error.message : 'Transaction failed',
        amount: 0
      });
    }
    
    setMatchingLoading(null);
  };

  const findCompatibleSupply = (demand: DemandRequest) => {
    return supplyOffers.find(supply => 
      supply.available &&
      supply.cpuCores >= demand.cpuCores &&
      supply.gpuCount >= demand.gpuCount &&
      supply.ramGB >= demand.ramGB &&
      supply.storageGB >= demand.storageGB &&
      supply.pricePerHour <= demand.maxPricePerHour &&
      (!demand.gpuType || !supply.gpuType || supply.gpuType === demand.gpuType)
    );
  };

  const getMarketStats = () => {
    const availableSupply = supplyOffers.filter(s => s.available).length;
    const activeRequests = demandRequests.filter(r => r.status === 'active').length;
    const avgPrice = supplyOffers.reduce((sum, s) => sum + s.pricePerHour, 0) / supplyOffers.length || 0;
    
    return { availableSupply, activeRequests, avgPrice };
  };

  const stats = getMarketStats();

  if (loading) {
    return (
      <div className="enterprise-container py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading marketplace data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="enterprise-container py-8 lg:py-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Compute Marketplace
            </h1>
            <p className="text-gray-600 text-lg">
              Real-time supply and demand for enterprise compute resources
            </p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <Button
              variant="secondary"
              onClick={() => fetchData(true)}
              loading={refreshing}
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Market Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center" padding="md">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.availableSupply}</div>
            <div className="text-sm text-gray-600">Available Resources</div>
          </Card>
          
          <Card className="text-center" padding="md">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stats.activeRequests}</div>
            <div className="text-sm text-gray-600">Active Requests</div>
          </Card>
          
          <Card className="text-center" padding="md">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              ${stats.avgPrice.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Avg. Price/Hour</div>
          </Card>
        </div>

        {/* Tabs */}
        <Card padding="sm" className="mb-8">
          <nav className="flex space-x-1">
            <button
              onClick={() => setActiveTab('supply')}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'supply'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Database className="w-4 h-4" />
                <span>Supply Offers ({supplyOffers.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('demand')}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'demand'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Search className="w-4 h-4" />
                <span>Compute Requests ({demandRequests.length})</span>
              </div>
            </button>
          </nav>
        </Card>

        {/* Content */}
        {activeTab === 'supply' && (
          <div>
            {supplyOffers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {supplyOffers.map((offer) => (
                  <ComputeCard
                    key={offer.id}
                    data={offer}
                    type="supply"
                  />
                ))}
              </div>
            ) : (
              <Card className="text-center py-16" padding="lg">
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Database className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Supply Offers Available
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Be the first to offer your compute resources to the marketplace 
                  and start earning revenue from idle hardware.
                </p>
                <Button>
                  <a href="/offer-compute">Offer Your Resources</a>
                </Button>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'demand' && (
          <div>
            {demandRequests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {demandRequests.map((request) => {
                  const compatibleSupply = findCompatibleSupply(request);
                  const isMatching = matchingLoading === request.id;
                  
                  return (
                    <ComputeCard
                      key={request.id}
                      data={request}
                      type="demand"
                      onAction={compatibleSupply && !isMatching ? () => handleMatch(request.id, compatibleSupply.id) : undefined}
                      actionLabel={
                        isMatching ? 'Processing...' : 
                        compatibleSupply ? 'Match & Pay' : 'No Compatible Supply'
                      }
                      loading={isMatching}
                    />
                  );
                })}
              </div>
            ) : (
              <Card className="text-center py-16" padding="lg">
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Compute Requests Available
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Submit a request to access available compute resources 
                  from verified providers in the network.
                </p>
                <Button variant="success">
                  <a href="/request-compute">Request Resources</a>
                </Button>
              </Card>
            )}
          </div>
        )}

        <TransactionModal
          isOpen={txModal.isOpen}
          onClose={() => setTxModal({ ...txModal, isOpen: false })}
          txHash={txModal.txHash}
          status={txModal.status}
          message={txModal.message}
          amount={txModal.amount}
        />
      </div>
    </div>
  )};