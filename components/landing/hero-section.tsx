"use client";

import { ShoppingBag, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroAuthButtons } from "@/components/auth-buttons";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-700/25 bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Hero Content */}
        <div className="space-y-8">
          {/* Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              AI-Powered Shopping Experience
            </div>
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight">
              <span className="block">Welcome to</span>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                AI Shop
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed">
              Your intelligent shopping assistant that understands your needs and 
              finds the perfect products with the power of AI
            </p>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">Instant Recommendations</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700">
              <ShoppingBag className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Smart Shopping</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium">Personalized Experience</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="pt-4">
            <HeroAuthButtons />
          </div>

          {/* Additional CTA */}
          <div className="pt-8">
            <Button 
              variant="ghost" 
              size="lg" 
              className="group"
              onClick={() => {
                document.getElementById('featured-products')?.scrollIntoView({ 
                  behavior: 'smooth' 
                });
              }}
            >
              Explore Products
              <ShoppingBag className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="pt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-md sm:max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400">10K+</div>
            <div className="text-sm text-muted-foreground">Products</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-purple-600 dark:text-purple-400">99%</div>
            <div className="text-sm text-muted-foreground">Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-teal-600 dark:text-teal-400">24/7</div>
            <div className="text-sm text-muted-foreground">AI Support</div>
          </div>
        </div>
      </div>
    </section>
  );
}