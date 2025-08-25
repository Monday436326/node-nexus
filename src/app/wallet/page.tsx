'use client';

import { useState, useEffect } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { getUSDCBalance } from '../../lib/payment';
import { ethers } from 'ethers';
import { 
  Wallet, 
  RefreshCw, 
  ExternalLink, 
  Copy,
  Server,
  Search,
  Activity,
  AlertCircle,
  Sparkles,
  TrendingUp,
  Shield,
  Zap
} from 'lucide-react';

export default function WalletPage() {
  const { primaryWallet, user } = useDynamicContext();
  const [balances, setBalances] = useState({
    sei: '0',
    usdc: 0,
  });
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (primaryWallet?.address) {
      fetchBalances();
    }
  }, [primaryWallet?.address]);

  const fetchBalances = async () => {
    if (!primaryWallet?.address) return;
    
    setLoading(true);
    try {
      if (!window.ethereum) {
        throw new Error('Ethereum provider not found');
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Get SEI balance
      const seiBalance = await provider.getBalance(primaryWallet.address);
      
      // Get USDC balance
      const usdcBalance = await getUSDCBalance(provider, primaryWallet.address);
      
      setBalances({
        sei: ethers.formatEther(seiBalance),
        usdc: usdcBalance,
      });
    } catch (error) {
      console.error('Failed to fetch balances:', error);
    }
    setLoading(false);
  };

  const copyAddress = async () => {
    if (primaryWallet?.address) {
      await navigator.clipboard.writeText(primaryWallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  if (!primaryWallet?.address) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-50/30">
        <div className="container-app py-16">
          <div className="max-w-2xl mx-auto">
            <div className="card-floating text-center p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-50/50 to-emerald-50/30 rounded-2xl" />
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <Wallet className="w-10 h-10 text-slate-400" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-4">
                  Connect Your Wallet
                </h1>
                <p className="text-slate-600 mb-8 text-lg leading-relaxed">
                  Connect your wallet to view account balances, transaction history, 
                  and manage your NodeNexus marketplace activities.
                </p>
                
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                  <div className="flex items-start space-x-4">
                    <AlertCircle className="w-6 h-6 text-amber-600 mt-1" />
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-amber-800 mb-2">
                        Supported Wallets
                      </h3>
                      <p className="text-amber-700 leading-relaxed">
                        MetaMask, WalletConnect, Coinbase Wallet, and other Web3 wallets are supported. 
                        Make sure you`re connected to the Sei EVM network.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-50/30">
      <div className="container-app py-8 lg:py-16">
        {/* Enhanced Header */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-100/20 to-emerald-100/20 rounded-3xl blur-3xl" />
          <div className="relative bg-white/60 backdrop-blur-sm border border-white/60 rounded-3xl p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between">
              <div className="mb-6 lg:mb-0">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 gradient-brand rounded-2xl flex items-center justify-center shadow-floating">
                    <Wallet className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 to-brand-700 bg-clip-text text-transparent">
                      Wallet Dashboard
                    </h1>
                    <p className="text-slate-600 text-lg">
                      Account balances and marketplace activity
                    </p>
                  </div>
                </div>
              </div>
              
              <Button
                variant="secondary"
                onClick={fetchBalances}
                loading={loading}
                icon={RefreshCw}
                className="shadow-card hover:shadow-raised"
              >
                Refresh Balances
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-8">
            {/* Account Information */}
            <div className="card-floating p-8">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-slate-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Account Information</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Wallet Address
                  </label>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 px-4 py-3 bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-xl font-mono text-sm">
                      {primaryWallet.address}
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={copyAddress}
                      icon={copied ? undefined : Copy}
                      className="shadow-card hover:shadow-raised"
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Wallet Provider
                    </label>
                    <div className="px-4 py-3 bg-gradient-to-r from-brand-50 to-brand-100 border border-brand-200 rounded-xl">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-brand-600" />
                        <span className="text-sm font-medium text-brand-800">
                          {primaryWallet.connector?.name || 'Unknown'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Network Status
                    </label>
                    <div className="flex items-center space-x-3">
                      <Badge variant="success">Connected</Badge>
                      <span className="text-sm font-medium text-slate-600">Sei EVM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card-floating p-8">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Quick Actions</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button className="w-full p-4 h-auto flex-col space-y-2" icon={Server}>
                  <div className="text-center">
                    <div className="font-semibold">Offer Compute</div>
                    <div className="text-xs opacity-80">Start earning</div>
                  </div>
                  <a href="/offer-compute" className="absolute inset-0"></a>
                </Button>
                <Button variant="success" className="w-full p-4 h-auto flex-col space-y-2" icon={Search}>
                  <div className="text-center">
                    <div className="font-semibold">Request Resources</div>
                    <div className="text-xs opacity-80">Scale workloads</div>
                  </div>
                  <a href="/request-compute" className="absolute inset-0"></a>
                </Button>
                <Button variant="secondary" className="w-full p-4 h-auto flex-col space-y-2" icon={Activity}>
                  <div className="text-center">
                    <div className="font-semibold">Browse Marketplace</div>
                    <div className="text-xs opacity-80">View opportunities</div>
                  </div>
                  <a href="/marketplace" className="absolute inset-0"></a>
                </Button>
              </div>
            </div>
          </div>

          {/* Enhanced Balances Sidebar */}
          <div className="space-y-8">
            <div className="card-floating p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100/50 to-brand-100/50 rounded-full -mr-16 -mt-16" />
              <div className="relative">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-10 h-10 gradient-emerald rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Account Balances</h2>
                </div>
                
                <div className="space-y-6">
                  {/* SEI Balance */}
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-sm font-medium text-slate-600 mb-1">SEI Balance</div>
                        <div className="text-2xl font-bold text-slate-900">
                          {loading ? (
                            <div className="w-20 h-6 bg-slate-200 rounded animate-pulse" />
                          ) : (
                            `${parseFloat(balances.sei).toFixed(4)} SEI`
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-medium text-slate-500 mb-1">Network Token</div>
                        <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* USDC Balance */}
                  <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/80 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-sm font-medium text-emerald-600 mb-1">USDC Balance</div>
                        <div className="text-2xl font-bold text-emerald-900">
                          {loading ? (
                            <div className="w-24 h-6 bg-emerald-200 rounded animate-pulse" />
                          ) : (
                            `$${balances.usdc.toFixed(2)}`
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-medium text-emerald-600 mb-1">Stablecoin</div>
                        <div className="w-8 h-8 bg-emerald-200 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-bold text-emerald-700">$</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-emerald-600 font-medium">
                      Used for marketplace transactions
                    </div>
                  </div>
                </div>

                {/* Portfolio Summary */}
                <div className="mt-8 p-4 bg-gradient-to-r from-brand-50/50 to-purple-50/50 rounded-xl border border-brand-100">
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">Portfolio Value</h3>
                  <div className="text-lg font-bold text-slate-900">
                    ${(balances.usdc + parseFloat(balances.sei) * 0.5).toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-500">
                    Estimated total value in USD
                  </div>
                </div>
              </div>
            </div>

            {/* Network Info Card */}
            <div className="card-floating p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Network Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Network</span>
                  <span className="text-sm font-medium text-slate-900">Sei EVM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Chain ID</span>
                  <span className="text-sm font-medium text-slate-900">1329</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Status</span>
                  <Badge variant="success">Online</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}