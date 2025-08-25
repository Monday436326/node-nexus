import Link from 'next/link';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Server, 
  Search, 
  Zap, 
  Shield, 
  DollarSign, 
  Network,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Cpu,
  Globe,
  Users,
  TrendingUp,
  Award,
  Clock,
  Lock
} from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast Matching',
      description: 'AI-powered algorithms instantly connect supply and demand with sub-second matching times.',
      color: 'gradient-amber',
    },
    {
      icon: DollarSign,
      title: 'Crypto Payments',
      description: 'Secure USDC payments on Sei blockchain with automated escrow and instant settlements.',
      color: 'gradient-emerald',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Military-grade security with multi-signature wallets and comprehensive audit trails.',
      color: 'gradient-brand',
    },
    {
      icon: Network,
      title: 'Global Network',
      description: 'Decentralized infrastructure spanning 50+ countries with 99.9% uptime guarantee.',
      color: 'gradient-rose',
    },
  ];

  const stats = [
    { 
      label: 'Active Providers', 
      value: '2,847',
      icon: Users,
      color: 'gradient-brand',
      change: '+12%'
    },
    { 
      label: 'GPU Hours', 
      value: '1.2M+',
      icon: Cpu,
      color: 'gradient-rose',
      change: '+45%'
    },
    { 
      label: 'Total Volume', 
      value: '$4.8M',
      icon: TrendingUp,
      color: 'gradient-emerald',
      change: '+23%'
    },
    { 
      label: 'Uptime', 
      value: '99.9%',
      icon: Award,
      color: 'gradient-amber',
      change: 'Stable'
    },
  ];

  const benefits = [
    'Set your own competitive pricing',
    'Automated USDC payments',
    '24/7 monitoring and support',
    'Enterprise SLA guarantees'
  ];

  const useCases = [
    'AI/ML model training and inference',
    'High-frequency trading algorithms', 
    'Scientific computing simulations',
    '3D rendering and visual effects',
    'Blockchain validation and mining',
    'Real-time data processing'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Animated Background */}
      <div className="relative overflow-hidden hero-gradient">
        <div className="absolute inset-0">
          <div className="absolute float" style={{
            top: '80px',
            left: '40px',
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
            borderRadius: '50%',
            opacity: 0.2
          }}></div>
          
          <div className="absolute float" style={{
            top: '160px',
            right: '80px',
            width: '128px',
            height: '128px',
            background: 'linear-gradient(135deg, #fb7185, #ef4444)',
            borderRadius: '50%',
            opacity: 0.2,
            animationDelay: '1s'
          }} ></div>
          
          <div className="absolute float" style={{
            bottom: '80px',
            left: '25%',
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, #34d399, #14b8a6)',
            borderRadius: '50%',
            opacity: 0.2,
            animationDelay: '2s'
          }}></div>
        </div>
        
        <div className="relative container-modern py-16 lg:py-24">
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 gradient-brand rounded-3xl mb-8 float shadow-floating" style={{
                boxShadow: '0 20px 40px rgba(99, 102, 241, 0.25)'
              }}>
                <Server className="w-10 h-10 text-white" />
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="block text-slate-900">Enterprise</span>
                <span className="block text-gradient">Cloud Marketplace</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed mb-8">
                Connect compute providers with enterprise workloads through our 
                <span className="text-gradient font-semibold"> decentralized infrastructure marketplace</span>. 
                Secure, scalable, and cost-effective.
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/offer-compute">
                <Button
                  variant="primary"
                  size="lg"
                  className="text-lg px-8 py-4"
                  style={{
                    boxShadow: '0 20px 40px rgba(99, 102, 241, 0.25)'
                  }}
                  icon={Sparkles}
                >
                  Monetize Your Hardware
                </Button>
              </Link>
              
              <Link href="/request-compute">
                <Button
                  variant="secondary"
                  size="lg"
                  className="text-lg px-8 py-4"
                  style={{
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
                  }}
                  icon={Search}
                >
                  Scale Your Workloads
                </Button>
              </Link>
            </div>

            <Link href="/marketplace">
              <Button 
                variant="secondary" 
                icon={Globe}
                iconPosition="left"
                className="shadow-raised"
              >
                Browse Live Marketplace
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container-modern py-16 lg:py-20">
        {/* Live Statistics */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Real-Time Network <span className="text-gradient">Statistics</span>
            </h2>
            <p className="text-lg text-slate-600">Live data from our global compute network</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="stats-card group">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center shadow-raised`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-sm font-semibold text-green-600 bg-emerald-50 px-2 py-1 rounded-xl border border-emerald-200">
                    {stat.change}
                  </div>
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2 group-hover:text-gradient transition-all">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Value Propositions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {/* Supply Side */}
          <Card variant="gradient" className="relative overflow-hidden group">
            <div className="absolute top-0 right-0 opacity-30 transition-all group-hover:scale-110" style={{
              width: '160px',
              height: '160px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))',
              borderRadius: '50%',
              marginTop: '-80px',
              marginRight: '-80px'
            }} />
            <div className="relative">
              <div className="w-16 h-16 gradient-brand rounded-2xl flex items-center justify-center mb-6 shadow-floating">
                <Server className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">
                Transform Hardware into <span className="text-gradient">Revenue</span>
              </h2>
              
              <p className="text-slate-600 mb-6 leading-relaxed text-lg">
                Turn your idle compute resources into a profitable business. Join thousands of providers 
                earning passive income from their hardware infrastructure.
              </p>
              
              <div className="space-y-3 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-slate-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <Link href="/offer-compute">
                <Button 
                  variant="primary"
                  className="w-full sm:w-auto shadow-floating" 
                  icon={ArrowRight} 
                  iconPosition="right"
                >
                  Start Earning Today
                </Button>
              </Link>
            </div>
          </Card>
          
          {/* Demand Side */}
          <Card variant="gradient" className="relative overflow-hidden group">
            <div className="absolute top-0 right-0 opacity-30 transition-all group-hover:scale-110" style={{
              width: '160px',
              height: '160px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(20, 184, 166, 0.2))',
              borderRadius: '50%',
              marginTop: '-80px',
              marginRight: '-80px'
            }} />
            <div className="relative">
              <div className="w-16 h-16 gradient-emerald rounded-2xl flex items-center justify-center mb-6 shadow-floating">
                <Search className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">
                Scale Without <span className="text-gradient-success">Limits</span>
              </h2>
              
              <p className="text-slate-600 mb-6 leading-relaxed text-lg">
                Access enterprise-grade computing power on-demand. Perfect for AI training, 
                scientific computing, and high-performance workloads.
              </p>
              
              <div className="mb-8">
                <div className="text-sm font-semibold text-slate-700 mb-3">Perfect for:</div>
                <div className="grid grid-cols-1 gap-2">
                  {useCases.slice(0, 4).map((useCase, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 gradient-emerald rounded-full flex-shrink-0" />
                      <span className="text-slate-700 text-sm font-medium">{useCase}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <Link href="/request-compute">
                <Button 
                  variant="success" 
                  className="w-full sm:w-auto shadow-floating glow-success" 
                  icon={ArrowRight} 
                  iconPosition="right"
                >
                  Find Resources Now
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-6">
              Why Choose <span className="text-gradient">NodeNexus</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Built for mission-critical workloads with enterprise security, compliance, and performance standards.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} variant="floating" className="group transition-all hover:scale-105">
                <div className="flex items-start space-x-6">
                  <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-raised group-hover:scale-110 transition-all`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-gradient transition-all">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Technical Specifications */}
        <Card variant="dark" className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-90" style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #312e81 100%)'
          }} />
          <div className="relative text-white">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 gradient-rose rounded-2xl mb-6 shadow-floating">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Enterprise-Grade <span style={{
                  background: 'linear-gradient(135deg, #a78bfa, #fb7185)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>Performance</span>
              </h2>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                Engineered for high-performance computing with enterprise reliability and global scale
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 gradient-emerald rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl lg:text-5xl font-bold mb-3" style={{
                  background: 'linear-gradient(135deg, #34d399, #10b981)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>99.9%</div>
                <div className="text-slate-300 font-medium">Network Uptime</div>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 gradient-brand rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl lg:text-5xl font-bold mb-3" style={{
                  background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>&lt;100ms</div>
                <div className="text-slate-300 font-medium">Matching Latency</div>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 gradient-rose rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl lg:text-5xl font-bold mb-3" style={{
                  background: 'linear-gradient(135deg, #a78bfa, #fb7185)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>256-bit</div>
                <div className="text-slate-300 font-medium">Encryption Standard</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}