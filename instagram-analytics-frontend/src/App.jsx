import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Moon, 
  Video, 
  Type,
  Smile,
  Users,
  Loader2,
  AlertCircle,
  ChevronRight
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

export default function InstagramAnalytics() {
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