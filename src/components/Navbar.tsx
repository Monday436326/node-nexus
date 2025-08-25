'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Server, Activity, Search, Wallet, Globe, Sparkles } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
    const { isConnected, address } = useAccount();
      const { setShowAuthFlow, user } = useDynamicContext();

     const handleConnectWallet = () => {
    if (isConnected) {
      // If connected, show disconnect options
      const shouldDisconnect = confirm('Disconnect wallet?');
      if (shouldDisconnect) {
        // Handle disconnect logic here
      }
    } else {
      // If not connected, show auth flow
      setShowAuthFlow(true);
    }
  };
    const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Marketplace', href: '/marketplace', icon: Globe },
    { name: 'Offer Compute', href: '/offer-compute', icon: Server },
    { name: 'Request Compute', href: '/request-compute', icon: Search },
    { name: 'Wallet', href: '/wallet', icon: Wallet },
  ];

  const navbarStyle = {
    position: 'sticky' as const,
    top: 0,
    zIndex: 50,
    transition: 'all 0.3s ease',
    ...(scrolled ? {
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)'
    } : {
      background: 'rgba(255, 255, 255, 0.6)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    })
  };

  return (
    <nav style={navbarStyle}>
      <div className="container-modern">
        <div className="flex justify-between items-center" style={{ height: '80px' }}>
          {/* Logo and Brand */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 gradient-brand rounded-2xl flex items-center justify-center shadow-raised group-hover:shadow-floating transition-all group-hover:scale-110">
                  <Server className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 gradient-emerald rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </div>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-gradient">
                  NodeNexus
                </span>
                <div className="text-xs text-slate-500 font-medium" style={{ marginTop: '-4px' }}>
                  Enterprise Cloud
                </div>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex space-x-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="nav-link group flex items-center space-x-2"
                >
                  <item.icon className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-all" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wide border border-emerald-200">
              <Activity className="w-3 h-3 inline mr-1" />
              Live
            </div>
            <div className="card-modern" style={{
              padding: '4px',
              borderRadius: '16px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
                         <button
            onClick={handleConnectWallet}
            className={`btn ${
              isConnected
                ? 'btn-success'
                : 'btn-primary'
            }`}
          >
            {isConnected && address ? formatAddress(address) : 'Connect Wallet'}
          </button>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-3">
            <div className="px-2 py-1 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200">
              <Activity className="w-3 h-3 inline" />
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 transition-all border"
              style={{
                background: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(255, 255, 255, 0.2)'
              }}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t py-4 rounded-b-2xl shadow-floating mx-4 mt-2" style={{
            borderColor: 'rgba(255, 255, 255, 0.2)',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)'
          }}>
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="nav-link-mobile group flex items-center space-x-3"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center border transition-all group-hover:scale-105" style={{
                    background: 'linear-gradient(135deg, #f8fafc, #ffffff)',
                    borderColor: '#e2e8f0'
                  }}>
                    <item.icon className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-all" />
                  </div>
                  <div>
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-xs text-slate-500" style={{ marginTop: '-4px' }}>
                      {item.name === 'Marketplace' && 'Browse offers & requests'}
                      {item.name === 'Offer Compute' && 'Monetize your hardware'}
                      {item.name === 'Request Compute' && 'Scale your workloads'}
                      {item.name === 'Wallet' && 'Manage your account'}
                    </div>
                  </div>
                </Link>
              ))}
              <div className="pt-4 border-t mt-4" style={{ borderColor: '#e2e8f0' }}>
                <div className="card-modern" style={{
                  padding: '12px',
                  borderRadius: '16px',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <button
            onClick={handleConnectWallet}
            className={`btn ${
              isConnected
                ? 'btn-success'
                : 'btn-primary'
            }`}
          >
            {isConnected && address ? formatAddress(address) : 'Connect Wallet'}
          </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}