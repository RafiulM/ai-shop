'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';

interface HeroSectionProps {
  className?: string;
  onGetStarted?: () => void;
  onWatchDemo?: () => void;
}

export function HeroSection({ className, onGetStarted, onWatchDemo }: HeroSectionProps) {
  return (
    <section className={`relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-pulse">
              <Sparkles className="w-4 h-4" />
              AI-Powered E-commerce
            </div>
            
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Launch Your{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Store
              </span>{' '}
              in Minutes
            </h1>
            
            {/* Value Proposition */}
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Transform your e-commerce vision into reality with our intelligent platform. 
              Create professional online stores in under 15 minutes using cutting-edge AI technology.
            </p>
            
            {/* Key Benefits */}
            <div className="flex flex-col sm:flex-row gap-6 mb-10 text-left">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <Zap className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">Lightning Fast</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Setup in 15 minutes</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">AI-Powered</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Smart product insights</div>
                </div>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="group px-8 py-6 text-lg font-semibold"
                onClick={onGetStarted}
              >
                Get Started Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-6 text-lg"
                onClick={onWatchDemo}
              >
                Watch Demo
              </Button>
            </div>
            
            {/* Social Proof */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Trusted by 10,000+ merchants worldwide
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-8 opacity-60">
                <div className="text-2xl font-bold text-gray-400">AI</div>
                <div className="text-2xl font-bold text-gray-400">Shop</div>
                <div className="text-2xl font-bold text-gray-400">Pro</div>
              </div>
            </div>
          </div>
          
          {/* Visual Element */}
          <div className="relative lg:order-last">
            <div className="relative">
              {/* Gradient Orbs */}
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-3xl opacity-20 animate-pulse" />
              <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl opacity-20 animate-pulse delay-1000" />
              
              {/* Main Visual - AI Shop Dashboard Preview */}
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 transform rotate-1 hover:rotate-0 transition-all duration-500 hover:shadow-3xl">
                <div className="space-y-4">
                  {/* Browser Header */}
                  <div className="flex items-center gap-2 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <div className="ml-4 flex-1 h-6 bg-gray-100 dark:bg-gray-700 rounded text-xs flex items-center px-3 text-gray-500">
                      🔒 mystore.ai-shop.com
                    </div>
                  </div>
                  
                  {/* Store Header */}
                  <div className="flex items-center justify-between">
                    <div className="h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg w-32" />
                    <div className="flex gap-2">
                      <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center text-xs">🛒</div>
                      <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center text-xs">👤</div>
                    </div>
                  </div>
                  
                  {/* Product Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <div className="aspect-square bg-gradient-to-br from-pink-200 to-purple-300 dark:from-pink-800 dark:to-purple-900 rounded-lg flex items-center justify-center text-2xl animate-pulse">📱</div>
                      <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded-full" />
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-3/4" />
                    </div>
                    <div className="space-y-2">
                      <div className="aspect-square bg-gradient-to-br from-blue-200 to-cyan-300 dark:from-blue-800 dark:to-cyan-900 rounded-lg flex items-center justify-center text-2xl animate-pulse delay-100">💻</div>
                      <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded-full" />
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-2/3" />
                    </div>
                    <div className="space-y-2">
                      <div className="aspect-square bg-gradient-to-br from-green-200 to-emerald-300 dark:from-green-800 dark:to-emerald-900 rounded-lg flex items-center justify-center text-2xl animate-pulse delay-200">🎧</div>
                      <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded-full" />
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-4/5" />
                    </div>
                  </div>
                  
                  {/* Stats Bar */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-3 rounded-lg">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-green-600 dark:text-green-400 font-semibold">↗ +127% Sales</span>
                      <span className="text-blue-600 dark:text-blue-400 font-semibold">🤖 AI Optimized</span>
                    </div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-6 -left-6 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-2 rounded-full text-sm font-medium shadow-lg animate-bounce">
                  ⚡ Live
                </div>
                <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-green-400 to-blue-400 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                  AI Powered ✨
                </div>
              </div>
              
              {/* Floating Cards */}
              <div className="absolute top-4 -left-8 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg transform -rotate-12 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">AI</div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Smart Analytics</div>
                    <div className="text-xs text-gray-500">Real-time insights</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-8 -right-12 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg transform rotate-12 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white text-xs">🚀</div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Auto Deploy</div>
                    <div className="text-xs text-gray-500">15 min setup</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}