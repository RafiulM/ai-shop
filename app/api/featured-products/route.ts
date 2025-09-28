import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { desc, gt } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '6', 10);

    // Fetch featured products from database
    // For now, we'll get the most recent products with stock > 0
    const featuredProducts = await db
      .select()
      .from(products)
      .where(gt(products.stock, 0))
      .orderBy(desc(products.createdAt))
      .limit(limit);

    // Transform products to include featured product specific data
    const transformedProducts = featuredProducts.map((product, index) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: parseFloat(product.price),
      originalPrice: parseFloat(product.price) * (1 + Math.random() * 0.3), // Add random "original price" for discount effect
      rating: 4.2 + Math.random() * 0.7, // Random rating between 4.2 and 4.9
      reviews: Math.floor(Math.random() * 1000) + 100, // Random review count
      imageUrl: product.imageUrl,
      category: determineCategory(product.name, product.description),
      stock: product.stock || 0,
      isNew: index < 2, // Mark first 2 as "new"
      isFeatured: true,
    }));

    return NextResponse.json({
      products: transformedProducts,
      total: transformedProducts.length,
      limit,
    });

  } catch (error) {
    console.error('Error fetching featured products:', error);
    
    // Return empty array with error info for graceful handling
    return NextResponse.json({
      products: [],
      total: 0,
      limit: 6,
      error: 'Failed to fetch featured products',
    }, { status: 500 });
  }
}

// Helper function to categorize products based on name and description
function determineCategory(name: string, description: string): string {
  const text = `${name} ${description}`.toLowerCase();
  
  const categories: { [key: string]: string[] } = {
    'Electronics': ['phone', 'laptop', 'computer', 'tablet', 'headphone', 'speaker', 'camera', 'tech', 'electronic', 'gadget', 'device'],
    'Fashion': ['shirt', 'dress', 'pants', 'jacket', 'shoes', 'hat', 'clothing', 'apparel', 'fashion', 'wear'],
    'Home & Garden': ['furniture', 'chair', 'table', 'lamp', 'decor', 'home', 'garden', 'kitchen', 'bedroom'],
    'Health & Beauty': ['skincare', 'makeup', 'beauty', 'health', 'wellness', 'fitness', 'cosmetic'],
    'Sports & Outdoors': ['sport', 'outdoor', 'fitness', 'exercise', 'bike', 'ball', 'gym', 'camping'],
    'Books & Media': ['book', 'movie', 'music', 'dvd', 'cd', 'magazine', 'novel'],
    'Food & Beverages': ['food', 'drink', 'coffee', 'tea', 'snack', 'beverage'],
    'Tools & Hardware': ['tool', 'hardware', 'drill', 'hammer', 'construction', 'repair'],
    'Toys & Games': ['toy', 'game', 'puzzle', 'board game', 'action figure', 'doll'],
    'Automotive': ['car', 'auto', 'vehicle', 'tire', 'engine', 'automotive'],
  };

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return category;
    }
  }

  return 'General';
}