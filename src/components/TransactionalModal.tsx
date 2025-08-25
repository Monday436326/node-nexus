'use client';

import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { CheckCircle, XCircle, Clock, ExternalLink, Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  txHash?: string;
  status: 'pending' | 'success' | 'error';
  message?: string;
  amount?: number;
}

export function TransactionModal({ 
  isOpen, 
  onClose, 
  txHash, 
  status, 
  message,
  amount 
}: TransactionModalProps) {
  if (!isOpen) return null;

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return (
          <div className="w-20 h-20 gradient-emerald rounded-3xl flex items-center justify-center shadow-floating">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
        );
      case 'error':
        return (
          <div className="w-20 h-20 gradient-rose rounded-3xl flex items-center justify-center shadow-floating">
            <XCircle className="w-10 h-10 text-white" />
          </div>
        );
      default:
        return (
          <div className="w-20 h-20 gradient-brand rounded-3xl flex items-center justify-center shadow-floating animate-pulse">
            <Clock className="w-10 h-10 text-white" />
          </div>
        );
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case 'success':
        return 'Transaction Successful!';
      case 'error':
        return 'Transaction Failed';
      default:
        return 'Processing Transaction';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-emerald-900';
      case 'error':
        return 'text-rose-900';
      default:
        return 'text-brand-900';
    }
  };

  const getBackgroundGradient = () => {
    switch (status) {
      case 'success':
        return 'bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50';
      case 'error':
        return 'bg-gradient-to-br from-rose-50 via-white to-rose-50/50';
      default:
        return 'bg-gradient-to-br from-brand-50 via-white to-brand-50/50';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`max-w-md w-full card-floating ${getBackgroundGradient()} border-0 relative overflow-hidden`}>
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-brand-200/50 to-emerald-200/50 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-gradient-to-br from-emerald-200/50 to-brand-200/50 rounded-full blur-xl animate-pulse delay-1000" />
        </div>
        
        <div className="relative p-8 text-center">
          {/* Status Icon */}
          <div className="flex justify-center mb-6">
            {getStatusIcon()}
          </div>
          
          {/* Title and Message */}
          <h3 className={`text-2xl font-bold mb-4 ${getStatusColor()}`}>
            {getStatusTitle()}
          </h3>
          
          {message && (
            <p className="text-slate-600 mb-6 leading-relaxed">{message}</p>
          )}

          {/* Amount Display for Success */}
          {amount && status === 'success' && (
            <div className="mb-6">
              <div className="card-modern p-6 bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-700">Amount Processed</span>
                </div>
                <div className="text-3xl font-bold text-emerald-900">
                  ${amount.toFixed(2)} USDC
                </div>
                <div className="text-sm text-emerald-600 mt-1">
                  Transaction completed successfully
                </div>
              </div>
            </div>
          )}
          
          {/* Transaction Hash */}
          {txHash && (
            <div className="mb-8">
              <div className="card-modern p-6 bg-slate-50/80 border-slate-200">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <Sparkles className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-600">Transaction Hash</span>
                </div>
                <div className="font-mono text-xs text-slate-700 break-all mb-4 bg-white/60 rounded-lg p-3 border border-slate-200">
                  {txHash}
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => window.open(`https://seitrace.com/tx/${txHash}`, '_blank')}
                  icon={ExternalLink}
                  iconPosition="right"
                  className="w-full shadow-card hover:shadow-raised"
                >
                  View on Sei Explorer
                </Button>
              </div>
            </div>
          )}

          {/* Loading Animation for Pending */}
          {status === 'pending' && (
            <div className="mb-6">
              <div className="flex items-center justify-center space-x-2 text-brand-600">
                <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce delay-200"></div>
              </div>
              <p className="text-sm text-slate-500 mt-2">
                Please wait while we process your transaction...
              </p>
            </div>
          )}

          {/* Error Details */}
          {status === 'error' && (
            <div className="mb-6">
              <div className="card-modern p-4 bg-gradient-to-r from-rose-50 to-red-50 border-rose-200">
                <div className="flex items-center justify-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span className="text-sm font-medium text-rose-700">
                    Transaction could not be completed
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {/* Action Button */}
          <Button
            onClick={onClose}
            className="w-full shadow-floating hover:shadow-2xl"
            variant={
              status === 'error' ? 'danger' : 
              status === 'success' ? 'success' : 
              'primary'
            }
            size="lg"
          >
            {status === 'pending' ? 'Continue Waiting' : 'Close'}
          </Button>

          {/* Additional Actions for Success */}
          {status === 'success' && (
            <div className="mt-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => window.location.href = '/marketplace'}
                className="w-full"
              >
                Return to Marketplace
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}