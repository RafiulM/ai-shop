"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { Sparkles, ShoppingCart, Brain, TrendingUp, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface RecommendedProduct {
  id: number;
  name: string;
  description: string;
  price: string;
  imageUrl: string | null;
  stock: number;
  reason: string;
  confidence: number;
  category: string;
  aiTags: string[];
}

interface RecommendationInsights {
  totalRecommendations: number;
  averageConfidence: number;
  topCategories: string[];
  personalizationNote: string;
}

interface RecommendationResponse {
  products: RecommendedProduct[];
  insights: RecommendationInsights;
}

interface RecommendationCardProps {
  product: RecommendedProduct;
}

function RecommendationCard({ product }: RecommendationCardProps) {
  const { addItem } = useCart();

  const handleQuickAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      imageUrl: product.imageUrl,
    });
  };

  return (
    <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 border bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm group">
      <CardContent className="p-0">
        {/* AI Confidence Badge */}
        <div className="absolute top-3 right-3 z-10">
          <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
            <Brain className="w-3 h-3 mr-1" />
            {product.confidence}%
          </Badge>
        </div>

        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-6xl opacity-40">🎯</div>
            </div>
          )}

          {/* Stock Badge */}
          {product.stock <= 5 && product.stock > 0 && (
            <div className="absolute top-3 left-3">
              <Badge variant="destructive" className="bg-orange-500 text-white">
                Only {product.stock} left
              </Badge>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          {/* AI Reason */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded-full">
            <Sparkles className="w-3 h-3 text-purple-500" />
            <span>{product.reason}</span>
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
            {product.name}
          </h3>

          {/* AI Tags */}
          <div className="flex flex-wrap gap-1">
            {product.aiTags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-green-600 dark:text-green-400">
                ${product.price}
              </span>
            </div>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>

          {/* Quick Add Button */}
          <Button 
            className="w-full group-hover:bg-purple-600 group-hover:border-purple-600 transition-colors" 
            size="sm"
            disabled={product.stock === 0}
            onClick={handleQuickAdd}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {product.stock === 0 ? 'Out of Stock' : 'Quick Add'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyRecommendations() {
  return (
    <div className="text-center py-12">
      <div className="mb-4">
        <Brain className="w-16 h-16 mx-auto text-muted-foreground/50" />
      </div>
      <h3 className="text-lg font-medium mb-2">Getting to Know You</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Our AI is learning your preferences. Browse some products or chat with our assistant to get personalized recommendations!
      </p>
      <Button variant="outline">
        <Sparkles className="w-4 h-4 mr-2" />
        Start Shopping
      </Button>
    </div>
  );
}

export function RecommendationCarousel() {
  const { data: session } = useSession();
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/recommendations');
      
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }
      
      const data = await response.json();
      setRecommendations(data);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError(err instanceof Error ? err.message : 'Failed to load recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [session?.user?.id]); // Refetch when user changes

  const handleRefresh = () => {
    fetchRecommendations();
  };

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-4">
            <Brain className="w-4 h-4" />
            AI-Powered Recommendations
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
              Just for You
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Our AI analyzes your preferences, browsing history, and shopping behavior to recommend products you'll love
          </p>
          
          {/* Refresh Button */}
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Recommendations
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              <p className="text-muted-foreground">AI is analyzing products for you...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="mb-4">
              <Brain className="w-16 h-16 mx-auto text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-medium mb-2">Unable to Load Recommendations</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={handleRefresh} variant="outline">
              Try Again
            </Button>
          </div>
        )}

        {/* Recommendations Content */}
        {!isLoading && !error && recommendations && (
          <>
            {recommendations.products.length > 0 ? (
              <div className="relative">
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {recommendations.products.map((product) => (
                      <CarouselItem key={product.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                        <RecommendationCard product={product} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden sm:flex -left-12 lg:-left-16" />
                  <CarouselNext className="hidden sm:flex -right-12 lg:-right-16" />
                </Carousel>

                {/* AI Insights */}
                <div className="mt-8 text-center space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm">
                    <TrendingUp className="w-4 h-4" />
                    {recommendations.insights.averageConfidence}% average match confidence
                  </div>
                  
                  <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                    {recommendations.insights.personalizationNote}
                  </p>

                  {recommendations.insights.topCategories.length > 0 && (
                    <div className="flex justify-center gap-2 mt-4">
                      {recommendations.insights.topCategories.slice(0, 3).map((category, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-50 dark:bg-blue-900/20">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <EmptyRecommendations />
            )}
          </>
        )}
      </div>
    </section>
  );
}