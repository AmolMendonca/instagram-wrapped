import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { 
  MessageCircle, 
  Moon, 
  Video, 
  Type,
  Smile,
  Users,
  Loader2,
  AlertCircle,
  ChevronRight,
  Upload, 
  BarChart3, 
  Shield, 
  Zap,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

const AnimatedCounter = ({ value, delay = 0 }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 2000;
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
  }, [value, delay]);
  
  return <span>{count.toLocaleString()}</span>;
};

const PersonCard = ({ person, rank, delay = 0 }) => (
  <div 
    className={`flex items-center justify-between p-4 bg-gray-50 rounded-xl transition-all duration-700 ease-out transform hover:bg-gray-100 opacity-0`}
    style={{ 
      animation: `slideInRight 0.6s ease-out ${delay}ms forwards`
    }}
  >
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-700">
        {rank}
      </div>
      <span className="font-medium text-gray-900">{person.name}</span>
    </div>
    <div className="text-right">
      <div className="font-semibold text-gray-900">
        <AnimatedCounter value={person.count} delay={delay} />
      </div>
      <div className="text-sm text-gray-500">messages</div>
    </div>
  </div>
);

const EmojiReveal = ({ emojis, delay = 0 }) => (
  <div className="grid grid-cols-4 gap-4">
    {emojis.slice(0, 8).map(([emoji, count], index) => (
      <div 
        key={index}
        className="text-center p-4 bg-gray-50 rounded-xl transition-all duration-500 hover:scale-110 opacity-0"
        style={{ 
          animation: `fadeInUp 0.5s ease-out ${delay + (index * 100)}ms forwards`
        }}
      >
        <div className="text-3xl mb-2">{emoji}</div>
        <div className="text-sm text-gray-600">
          <AnimatedCounter value={count} delay={delay + (index * 100)} />
        </div>
      </div>
    ))}
  </div>
);

const NextButton = ({ onClick, isLast = false }) => (
  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
    <div
      onClick={onClick}
      className="flex items-center gap-2 text-gray-900 font-bold text-lg cursor-pointer hover:text-gray-700 transition-all group"
    >
      {isLast ? 'Restart' : 'Next'}
      <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
    </div>
  </div>
);

const ProgressDots = ({ total, current }) => (
  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
    {Array.from({ length: total }, (_, i) => (
      <div
        key={i}
        className={`w-2 h-2 rounded-full transition-colors duration-300 ${
          i === current ? 'bg-gray-900' : 'bg-gray-300'
        }`}
      />
    ))}
  </div>
);

// Your existing InstagramAnalytics component (unchanged)
function InstagramAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:8000/api/stats');
      if (!response.ok) throw new Error('Failed to fetch data');
      const result = await response.json();
      if (result.error) throw new Error(result.error);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(0);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextStep();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentStep]);

  if (loading) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Analyzing your conversations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
          <p className="text-gray-700 mb-4">{error}</p>
          <button 
            onClick={fetchData}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const totalMessages = data.top_chatted.reduce((sum, item) => sum + item.count, 0);
  const totalMidnight = data.midnight.reduce((sum, item) => sum + item.count, 0);
  const totalReels = data.reels.reduce((sum, item) => sum + item.count, 0);

  const steps = [
    // Step 0: Introduction
    {
      title: "Your Instagram Story",
      subtitle: `Let's explore your ${totalMessages.toLocaleString()} messages`,
      content: (
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-10 h-10 text-gray-600" />
          </div>
          <div className="text-6xl font-bold text-gray-900 mb-2">
            <AnimatedCounter value={totalMessages} />
          </div>
          <p className="text-gray-500 text-lg">total messages analyzed</p>
        </div>
      )
    },
    
    // Step 1: Top Conversations
    {
      title: "Your Closest Connections",
      subtitle: "The people who matter most in your DMs",
      content: (
        <div className="space-y-4 max-w-md mx-auto">
          {data.top_chatted.slice(0, 5).map((person, index) => (
            <PersonCard 
              key={index} 
              person={person} 
              rank={index + 1} 
              delay={index * 150}
            />
          ))}
        </div>
      )
    },

    // Step 2: Night Owls (if data exists)
    ...(data.midnight.length > 0 ? [{
      title: "The Night Owls",
      subtitle: "Who stays up chatting with you after midnight?",
      content: (
        <div>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
              <Moon className="w-5 h-5 text-gray-600" />
              <span className="font-semibold">
                <AnimatedCounter value={totalMidnight} /> late night messages
              </span>
            </div>
          </div>
          <div className="space-y-4 max-w-md mx-auto">
            {data.midnight.slice(0, 5).map((person, index) => (
              <PersonCard 
                key={index} 
                person={person} 
                rank={index + 1} 
                delay={index * 200}
              />
            ))}
          </div>
        </div>
      )
    }] : []),

    // Step 3: Reels (if data exists)
    ...(data.reels.length > 0 ? [{
      title: "The Reel Sharers",
      subtitle: "Who spams you with the most reels that you probably don't watch?",
      content: (
        <div>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
              <Video className="w-5 h-5 text-gray-600" />
              <span className="font-semibold">
                <AnimatedCounter value={totalReels} /> reels shared
              </span>
            </div>
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            {data.reels.slice(0, 5).map((person, index) => (
              <PersonCard 
                key={index} 
                person={person} 
                rank={index + 1} 
                delay={index * 200}
              />
            ))}
          </div>
        </div>
      )
    }] : []),

    // Step 4: Your Emoji Personality
    ...(data.emojis.length > 0 ? [{
      title: "Your Emoji DNA",
      subtitle: "The emotions you share most",
      content: (
        <div className="max-w-md mx-auto">
          <EmojiReveal emojis={data.emojis} delay={500} />
        </div>
      )
    }] : []),

    // Final Step: Summary
    {
      title: "Your Instagram Journey",
      subtitle: "Thanks for exploring your conversation patterns",
      content: (
        <div className="text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                <AnimatedCounter value={data.top_chatted.length} delay={200} />
              </div>
              <div className="text-sm text-gray-500">Active Chats</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                <AnimatedCounter value={totalMessages} delay={400} />
              </div>
              <div className="text-sm text-gray-500">Total Messages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                <AnimatedCounter value={data.emojis.length} delay={600} />
              </div>
              <div className="text-sm text-gray-500">Unique Emojis</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                <AnimatedCounter value={data.words.length} delay={800} />
              </div>
              <div className="text-sm text-gray-500">Unique Words</div>
            </div>
          </div>
          <p className="text-gray-500">Your conversations tell a story of connection 💬</p>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];

  return (
    <div className="h-screen bg-gray-50 relative overflow-hidden flex flex-col">
      <ProgressDots total={steps.length} current={currentStep} />
      
      <div className="flex-1 flex items-center justify-center py-16">
        <div className="text-center max-w-4xl mx-auto px-6">
          <div
            key={currentStep}
            className="animate-fadeIn"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              {currentStepData.title}
            </h2>
            {currentStepData.subtitle && (
              <p className="text-gray-500 mb-12 text-lg">
                {currentStepData.subtitle}
              </p>
            )}
            
            <div>
              {currentStepData.content}
            </div>
          </div>
        </div>
      </div>

      <NextButton 
        onClick={nextStep} 
        isLast={currentStep === steps.length - 1}
      />

      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
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

// Landing Page Component
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

function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleGetStarted = () => {
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

// Main App component with routing
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/analytics" element={<InstagramAnalytics />} />
    </Routes>
  );
}