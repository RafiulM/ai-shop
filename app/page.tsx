'use client';

import { LandingNavbar } from '@/components/landing/landing-navbar';
import { HeroSection } from '@/components/landing/hero-section';
import { FeaturedProductsSection } from '@/components/landing/featured-products-section';
import { RecommendationCarousel } from '@/components/landing/recommendation-carousel';
import { LandingFooter } from '@/components/landing/landing-footer';
import { ChatInterface } from '@/components/chat/chat-interface';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <LandingNavbar />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Featured Products Section */}
      <FeaturedProductsSection />
      
      {/* AI Recommendation Carousel */}
      <RecommendationCarousel />
      
      {/* Chat Interface Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Chat with Your{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Assistant
              </span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              Get instant product recommendations, compare items, and find exactly what you're looking for with our intelligent chat assistant
            </p>
          </div>
          
          {/* Chat Interface */}
          <ChatInterface />
        </div>
      </section>
      
      {/* Footer */}
      <LandingFooter />
    </div>
  );
}