// RequestComputePage.tsx  
import { DemandForm } from '../../components/DemandForm';
import { Card } from '../../components/ui/Card';
import { Search, Cpu, Zap, Clock, Brain, Palette, Calculator } from 'lucide-react';

export default function RequestComputePage() {
  const useCases = [
    {
      icon: Brain,
      title: 'AI/ML Training',
      description: 'High-performance GPU clusters for deep learning and neural networks',
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      icon: Palette,
      title: 'Rendering & VFX',
      description: '3D rendering, visual effects, and real-time graphics processing',
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-700'
    },
    {
      icon: Calculator,
      title: 'Scientific Computing',
      description: 'HPC workloads, simulations, and complex mathematical computations',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    }
  ];

  const features = [
    'Global resource network',
    'Instant provisioning',
    'Pay-per-use pricing',
    'Enterprise SLA'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-50/30">
      <div className="container-app py-8 lg:py-16">
        {/* Enhanced Header */}
        <div className="relative mb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-100/20 to-emerald-100/20 rounded-3xl blur-3xl" />
          <div className="relative bg-white/60 backdrop-blur-sm border border-white/60 rounded-3xl p-8 lg:p-12">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 gradient-emerald rounded-3xl mb-8 shadow-floating float">
                <Search className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-brand-700 to-emerald-700 bg-clip-text text-transparent mb-6">
                Scale Your Workloads
              </h1>
              <p className="text-xl lg:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed mb-8">
                Access enterprise-grade computing power for your most demanding projects
              </p>
              
              {/* Feature Pills */}
              <div className="flex flex-wrap justify-center gap-3">
                {features.map((feature, i) => (
                  <div key={i} className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full px-4 py-2 text-sm font-medium text-slate-700">
                    {feature}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Use Cases Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {useCases.map((useCase, index) => (
                <div key={index} className="card-floating p-6 text-center hover:shadow-2xl transition-all duration-500 group">
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${useCase.bgColor} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <useCase.icon className={`w-8 h-8 ${useCase.textColor}`} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{useCase.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{useCase.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <DemandForm />
      </div>
    </div>
  );
}