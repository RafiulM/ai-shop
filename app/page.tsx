'use client';

import { HeroSection } from '@/components/landing/hero-section';
import { ChatInterface } from '@/components/chat/chat-interface';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/sign-up');
  };

  const handleWatchDemo = () => {
    // Scroll to chat interface for demo
    const chatSection = document.getElementById('demo-section');
    if (chatSection) {
      chatSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection 
        onGetStarted={handleGetStarted}
        onWatchDemo={handleWatchDemo}
      />
      
      {/* Demo Section */}
      <div id="demo-section" className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center py-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              See AI Shop in Action
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Try our intelligent shopping assistant and experience the future of e-commerce
            </p>
          </div>

          {/* Chat Interface Demo */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <ChatInterface />
          </div>
        </div>
      </div>
    </div>
  );
}