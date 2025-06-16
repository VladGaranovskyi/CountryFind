import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Globe, BarChart3, Zap, Users, TrendingUp } from 'lucide-react';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: Search,
      title: 'Smart Discovery',
      description: 'Find similar countries using advanced AI-powered analysis of economic, social, and environmental indicators.'
    },
    {
      icon: Globe,
      title: 'Global Coverage',
      description: 'Comprehensive database covering 195+ countries with real-time data from trusted international sources.'
    },
    {
      icon: BarChart3,
      title: 'Visual Analytics',
      description: 'Interactive charts and world maps to visualize country comparisons and similarity patterns.'
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Get similarity scores and detailed comparisons in seconds with our optimized search engine.'
    },
    {
      icon: Users,
      title: 'Multiple Use Cases',
      description: 'Perfect for researchers, policymakers, investors, and anyone studying global development patterns.'
    },
    {
      icon: TrendingUp,
      title: 'Trend Analysis',
      description: 'Track changes over time and discover emerging patterns in global development indicators.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Find Countries Most
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Similar to Yours
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover countries with similar economic, environmental, and social indicators using AI-powered similarity analysis
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/search"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl group"
              >
                <Search className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Start Exploring
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center px-8 py-4 bg-blue-500/20 text-white font-semibold rounded-xl hover:bg-blue-500/30 transition-all duration-200 border border-blue-400/30 group"
              >
                <BarChart3 className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
              Powerful Features for Global Analysis
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Our advanced platform combines multiple data sources and AI algorithms to deliver accurate country similarity insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, description }, index) => (
              <div
                key={title}
                className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-blue-200"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                  <Icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3">{title}</h3>
                <p className="text-slate-600 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Discover Similar Countries?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Start your journey of global discovery today. Whether you're researching development patterns or exploring new markets, we've got you covered.
          </p>
          <Link
            to="/search"
            className="inline-flex items-center px-8 py-4 bg-white text-green-700 font-semibold rounded-xl hover:bg-green-50 transition-all duration-200 shadow-lg hover:shadow-xl group"
          >
            <Search className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;