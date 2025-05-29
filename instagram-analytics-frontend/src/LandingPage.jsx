import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Upload, 
  BarChart3, 
  Shield, 
  Zap,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

const FloatingNav = () => (
  <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
    <div className="bg-white/80 backdrop-blur-md border border-gray-200/50 rounded-full px-6 py-3 shadow-lg">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-gray-900" />
          <span className="font-semibold text-gray-900">DM Analytics</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-sm">
          <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
          <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">How it works</a>
          <a href="#privacy" className="text-gray-600 hover:text-gray-900 transition-colors">Privacy</a>
        </div>
      </div>
    </div>
  </nav>
);

const AnimatedCounter = ({ value, duration = 2000, delay = 0 }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      
      const counter = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(counter);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      
      return () => clearInterval(counter);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [value, duration, delay]);
  
  return <span>{count.toLocaleString()}</span>;
};

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => (
  <div 
    className="bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 opacity-0"
    style={{ 
      animation: `fadeInUp 0.6s ease-out ${delay}ms forwards`
    }}
  >
    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm">
      <Icon className="w-6 h-6 text-gray-700" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const StepCard = ({ number, title, description, delay = 0 }) => (
  <div 
    className="text-center opacity-0"
    style={{ 
      animation: `fadeInUp 0.6s ease-out ${delay}ms forwards`
    }}
  >
    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-gray-700">
      {number}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleGetStarted = () => {
    // Navigate to analytics page or show file upload
    window.location.href = '/analytics';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <FloatingNav />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div 
            className={`transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">Discover your Instagram story</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Your Instagram
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                DM Analytics
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Uncover fascinating insights about your Instagram conversations. 
              See who you chat with most, your emoji personality, and discover your digital communication patterns.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={handleGetStarted}
                className="group bg-gray-900 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Get Started
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
              
              <div className="flex items-center gap-2 text-gray-500">
                <Shield className="w-4 h-4" />
                <span className="text-sm">100% Private & Secure</span>
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 max-w-lg mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">
                <AnimatedCounter value={50000} delay={1000} />+
              </div>
              <div className="text-sm text-gray-500">Messages Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">
                <AnimatedCounter value={100} delay={1200} />%
              </div>
              <div className="text-sm text-gray-500">Private</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">
                <AnimatedCounter value={5} delay={1400} />min
              </div>
              <div className="text-sm text-gray-500">Setup Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Discover Your Digital Self
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get meaningful insights from your Instagram conversations with beautiful, interactive visualizations.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={BarChart3}
              title="Conversation Insights"
              description="See who you chat with most, when you're most active, and discover your communication patterns over time."
              delay={200}
            />
            <FeatureCard
              icon={MessageCircle}
              title="Emoji Analysis"
              description="Uncover your emoji personality and see which emotions you express most in your conversations."
              delay={400}
            />
            <FeatureCard
              icon={Zap}
              title="Interactive Stories"
              description="Experience your data through beautiful, animated presentations that tell the story of your connections."
              delay={600}
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple as 1, 2, 3
            </h2>
            <p className="text-xl text-gray-600">
              Get insights from your Instagram data in just a few minutes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <StepCard
              number="1"
              title="Export Your Data"
              description="Download your Instagram data from your account settings. We'll guide you through the process."
              delay={200}
            />
            <StepCard
              number="2"
              title="Upload & Analyze"
              description="Upload your messages file and our system will instantly analyze your conversation patterns."
              delay={400}
            />
            <StepCard
              number="3"
              title="Explore Insights"
              description="Dive into beautiful visualizations and discover fascinating insights about your digital relationships."
              delay={600}
            />
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section id="privacy" className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Your Privacy Matters
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your data never leaves your device. All analysis happens locally in your browser. 
            We don't store, share, or access any of your personal information.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="text-gray-700">Local Processing</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="text-gray-700">No Data Storage</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="text-gray-700">Open Source</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to explore your story?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Discover the hidden patterns in your Instagram conversations.
          </p>
          
          <button 
            onClick={handleGetStarted}
            className="group bg-white text-gray-900 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Start Analyzing Now
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}