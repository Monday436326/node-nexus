import { SupplyOffer, DemandRequest } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { 
  Cpu, 
  HardDrive, 
  MemoryStick, 
  Zap, 
  Clock, 
  MapPin, 
  Wallet, 
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react';

interface ComputeCardProps {
  data: SupplyOffer | DemandRequest;
  type: 'supply' | 'demand';
  onAction?: () => void;
  actionLabel?: string;
  loading?: boolean;
}

export function ComputeCard({ data, type, onAction, actionLabel, loading }: ComputeCardProps) {
  const isSupply = type === 'supply';
  const offer = data as SupplyOffer;
  const request = data as DemandRequest;

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getStatusBadge = () => {
    if (isSupply) {
      return (
        <Badge 
          variant={offer.available ? 'available' : 'unavailable'}
          icon={offer.available ? CheckCircle : XCircle}
          pulse={offer.available}
        >
          {offer.available ? 'Available' : 'Unavailable'}
        </Badge>
      );
    } else {
      const statusMap = {
        active: { variant: 'active' as const, icon: Activity },
        matched: { variant: 'success' as const, icon: CheckCircle },
        completed: { variant: 'success' as const, icon: CheckCircle },
        cancelled: { variant: 'danger' as const, icon: XCircle },
      };
      const status = statusMap[request.status];
      return (
        <Badge variant={status.variant} icon={status.icon}>
          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
        </Badge>
      );
    }
  };

  const getCardStyle = () => {
    if (isSupply) {
      return offer.available 
        ? {
            borderLeft: '4px solid #10b981',
            background: 'linear-gradient(135deg, rgba(236, 253, 245, 0.5) 0%, rgba(255, 255, 255, 1) 100%)'
          }
        : {
            borderLeft: '4px solid #94a3b8',
            background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.5) 0%, rgba(255, 255, 255, 1) 100%)'
          };
    } else {
      const gradients = {
        active: {
          borderLeft: '4px solid #3b82f6',
          background: 'linear-gradient(135deg, rgba(239, 246, 255, 0.5) 0%, rgba(255, 255, 255, 1) 100%)'
        },
        matched: {
          borderLeft: '4px solid #8b5cf6',
          background: 'linear-gradient(135deg, rgba(250, 245, 255, 0.5) 0%, rgba(255, 255, 255, 1) 100%)'
        },
        completed: {
          borderLeft: '4px solid #10b981',
          background: 'linear-gradient(135deg, rgba(236, 253, 245, 0.5) 0%, rgba(255, 255, 255, 1) 100%)'
        },
        cancelled: {
          borderLeft: '4px solid #ef4444',
          background: 'linear-gradient(135deg, rgba(254, 242, 242, 0.5) 0%, rgba(255, 255, 255, 1) 100%)'
        }
      };
      return gradients[request.status];
    }
  };

  const specs = [
    { icon: Cpu, label: 'CPU Cores', value: data.cpuCores, color: 'text-blue-600' },
    { icon: Zap, label: 'GPU Count', value: data.gpuCount, color: 'text-purple-600' },
    { icon: MemoryStick, label: 'RAM (GB)', value: data.ramGB, color: 'text-emerald-600' },
    { icon: HardDrive, label: 'Storage (GB)', value: data.storageGB, color: 'text-orange-600' },
  ];

  return (
    <div 
      className="card-floating h-full flex flex-col relative overflow-hidden group"
      style={getCardStyle()}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-raised"
            style={{
              background: isSupply 
                ? 'linear-gradient(135deg, #10b981, #14b8a6)' 
                : 'linear-gradient(135deg, #3b82f6, #6366f1)'
            }}
          >
            {isSupply ? <Activity className="w-5 h-5 text-white" /> : <Sparkles className="w-5 h-5 text-white" />}
          </div>
          <div>
            <span className="text-sm font-bold text-slate-900">
              {isSupply ? 'Supply Offer' : 'Compute Request'}
            </span>
            <div className="text-xs text-slate-500" style={{ marginTop: '-2px' }}>
              {isSupply ? 'Hardware Provider' : 'Resource Seeker'}
            </div>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      {/* Specifications Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {specs.map((spec, index) => (
          <div 
            key={index} 
            className="rounded-xl p-4 border transition-all group-hover:shadow-card"
            style={{
              background: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(10px)',
              borderColor: 'rgba(255, 255, 255, 0.4)'
            }}
          >
            <div className="flex items-center space-x-2 mb-2">
              <spec.icon className={`w-4 h-4 ${spec.color}`} />
              <span className="text-xs font-medium text-slate-600">{spec.label}</span>
            </div>
            <p className="text-lg font-bold text-slate-900">{spec.value}</p>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="space-y-4 mb-6">
        {/* GPU Type */}
        {data.gpuType && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600">GPU Type</span>
            <span className="inline-flex items-center px-3 py-1 rounded-xl text-sm font-bold border" style={{
              background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(79, 70, 229, 0.1))',
              color: '#7c3aed',
              borderColor: 'rgba(147, 51, 234, 0.2)'
            }}>
              {data.gpuType}
            </span>
          </div>
        )}

        {/* Duration for Requests */}
        {!isSupply && request.duration && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-slate-600">Duration</span>
            </div>
            <span className="font-bold text-slate-900">{request.duration} hours</span>
          </div>
        )}

        {/* Location for Supply */}
        {isSupply && offer.location && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-slate-600">Location</span>
            </div>
            <span className="font-bold text-slate-900">{offer.location}</span>
          </div>
        )}
      </div>

      {/* Job Description for Requests */}
      {!isSupply && request.jobDescription && (
        <div className="mb-6">
          <div className="text-sm font-medium text-slate-600 mb-2">Job Description</div>
          <p 
            className="text-sm text-slate-700 line-clamp-3 rounded-xl p-3 border"
            style={{
              background: 'rgba(255, 255, 255, 0.4)',
              backdropFilter: 'blur(10px)',
              borderColor: 'rgba(255, 255, 255, 0.3)'
            }}
          >
            {request.jobDescription}
          </p>
        </div>
      )}

      {/* Spacer */}
      <div style={{ flex: '1 1 0%' }} />

      {/* Price Section */}
      <div 
        className="rounded-xl p-4 border mb-4"
        style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          borderColor: 'rgba(255, 255, 255, 0.4)'
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              {isSupply ? 'Price/Hour' : 'Max Budget/Hour'}
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-gradient">
                ${isSupply ? offer.pricePerHour : request.maxPricePerHour}
              </span>
              <span className="text-sm font-medium text-slate-500">USDC</span>
            </div>
          </div>
          
          {onAction && (
            <Button
              onClick={onAction}
              loading={loading}
              disabled={!actionLabel || actionLabel.includes('No')}
              variant={
                actionLabel?.includes('No') ? 'secondary' : 
                actionLabel?.includes('Match') ? 'success' : 'primary'
              }
              size="sm"
              glow={actionLabel?.includes('Match')}
            >
              {actionLabel || 'Select'}
            </Button>
          )}
        </div>
      </div>

      {/* Wallet Address Footer */}
      <div 
        className="flex items-center justify-center space-x-2 pt-3 border-t"
        style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}
      >
        <Wallet className="w-3 h-3 text-slate-400" />
        <span className="text-xs text-slate-400 font-mono tracking-wider">
          {formatAddress(data.walletAddress)}
        </span>
      </div>
    </div>
  );
}