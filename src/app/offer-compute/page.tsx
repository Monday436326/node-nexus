// OfferComputePage.tsx
import { SupplyForm } from '../../components/SupplyForm';
import { Card } from '../../components/ui/Card';
import { Server, DollarSign, Shield, Zap, TrendingUp, Users, Clock } from 'lucide-react';

export default function OfferComputePage() {
  const benefits = [
    {
      icon: DollarSign,
      title: 'Competitive Revenue',
      description: 'Earn up to $50/hour for high-end GPU resources with dynamic pricing',
      color: 'from-emerald-500 to-green-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-grade security with automated monitoring and insurance coverage',
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      icon: Zap,
      title: 'Instant Payments',
      description: 'Automatic USDC payments upon job completion with zero delays',
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700'
    }
  ];

  const stats = [
    { label: 'Average Earnings', value: '$127/day', icon: TrendingUp },
    { label: 'Active Providers', value: '2,847', icon: Users },
    { label: 'Avg. Utilization', value: '73%', icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      <div className="container-app py-8 lg:py-16">
        {/* Enhanced Header */}
        <div className="relative mb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/20 to-brand-100/20 rounded-3xl blur-3xl" />
          <div className="relative bg-white/60 backdrop-blur-sm border border-white/60 rounded-3xl p-8 lg:p-12">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 gradient-brand rounded-3xl mb-8 shadow-floating float">
                <Server className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-emerald-700 to-brand-700 bg-clip-text text-transparent mb-6">
                Monetize Your Hardware
              </h1>
              <p className="text-xl lg:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
                Transform idle compute resources into revenue streams on NodeNexus marketplace
              </p>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white/80 rounded-2xl mb-3 shadow-card">
                    <stat.icon className="w-6 h-6 text-slate-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-sm font-medium text-slate-600">{stat.label}</div>
                </div>
              ))}
            </div>
            
            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="card-floating p-6 text-center hover:shadow-2xl transition-all duration-500 group">
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${benefit.bgColor} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <benefit.icon className={`w-8 h-8 ${benefit.textColor}`} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{benefit.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <SupplyForm />
      </div>
    </div>
  );
}
