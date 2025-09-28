import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { db } from '@/db';
import { products, messages, chats } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';
import { auth } from '@/lib/auth';

// Recommendation schema
const recommendationSchema = z.object({
  products: z.array(z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    price: z.string(),
    imageUrl: z.string().nullable(),
    stock: z.number(),
    reason: z.string(),
    confidence: z.number().min(0).max(100),
    category: z.string(),
    aiTags: z.array(z.string()),
  })),
  insights: z.object({
    totalRecommendations: z.number(),
    averageConfidence: z.number(),
    topCategories: z.array(z.string()),
    personalizationNote: z.string(),
  }),
});

interface UserActivity {
  recentMessages: string[];
  preferredCategories: string[];
  priceRange: { min: number; max: number };
  interests: string[];
}

async function getUserActivity(userId: string): Promise<UserActivity> {
  try {
    // Get user's recent chat messages to understand preferences
    const recentChats = await db
      .select({
        chatId: chats.id,
      })
      .from(chats)
      .where(eq(chats.userId, userId))
      .orderBy(desc(chats.createdAt))
      .limit(5);

    if (recentChats.length === 0) {
      return {
        recentMessages: [],
        preferredCategories: [],
        priceRange: { min: 0, max: 1000 },
        interests: [],
      };
    }

    const chatIds = recentChats.map(chat => chat.chatId);
    
    // Get recent messages from these chats
    const recentMessages = await db
      .select({
        content: messages.content,
        role: messages.role,
      })
      .from(messages)
      .where(eq(messages.chatId, chatIds[0])) // Get messages from most recent chat
      .orderBy(desc(messages.createdAt))
      .limit(10);

    const userMessages = recentMessages
      .filter(msg => msg.role === 'user')
      .map(msg => msg.content)
      .slice(0, 5);

    return {
      recentMessages: userMessages,
      preferredCategories: extractCategories(userMessages),
      priceRange: extractPriceRange(userMessages),
      interests: extractInterests(userMessages),
    };
  } catch (error) {
    console.error('Error getting user activity:', error);
    return {
      recentMessages: [],
      preferredCategories: [],
      priceRange: { min: 0, max: 1000 },
      interests: [],
    };
  }
}

function extractCategories(messages: string[]): string[] {
  const categories = ['Electronics', 'Fashion', 'Home', 'Sports', 'Books', 'Health', 'Beauty'];
  const found: string[] = [];
  
  messages.forEach(message => {
    const lowerMessage = message.toLowerCase();
    categories.forEach(category => {
      if (lowerMessage.includes(category.toLowerCase()) && !found.includes(category)) {
        found.push(category);
      }
    });
  });
  
  return found;
}

function extractPriceRange(messages: string[]): { min: number; max: number } {
  const priceRegex = /\$(\d+(?:\.\d{2})?)/g;
  const prices: number[] = [];
  
  messages.forEach(message => {
    const matches = message.match(priceRegex);
    if (matches) {
      matches.forEach(match => {
        const price = parseFloat(match.replace('$', ''));
        if (price > 0) prices.push(price);
      });
    }
  });
  
  if (prices.length === 0) {
    return { min: 0, max: 500 }; // Default range
  }
  
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  
  return {
    min: Math.max(0, minPrice - 50), // Add some buffer
    max: maxPrice + 100,
  };
}

function extractInterests(messages: string[]): string[] {
  const interests = [
    'gaming', 'fitness', 'cooking', 'music', 'reading', 'travel',
    'photography', 'art', 'technology', 'fashion', 'outdoor', 'wellness'
  ];
  
  const found: string[] = [];
  
  messages.forEach(message => {
    const lowerMessage = message.toLowerCase();
    interests.forEach(interest => {
      if (lowerMessage.includes(interest) && !found.includes(interest)) {
        found.push(interest);
      }
    });
  });
  
  return found.slice(0, 5); // Limit to top 5 interests
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    
    // Get all available products
    const allProducts = await db.select().from(products);
    
    if (allProducts.length === 0) {
      return NextResponse.json({
        products: [],
        insights: {
          totalRecommendations: 0,
          averageConfidence: 0,
          topCategories: [],
          personalizationNote: "No products available for recommendations.",
        },
      });
    }

    let userActivity: UserActivity = {
      recentMessages: [],
      preferredCategories: [],
      priceRange: { min: 0, max: 500 },
      interests: [],
    };

    // Get user activity if authenticated
    if (userId) {
      userActivity = await getUserActivity(userId);
    }

    // Create AI prompt for personalized recommendations
    const systemPrompt = `You are an AI recommendation engine for an e-commerce platform.
Your task is to analyze available products and user preferences to provide highly personalized recommendations.

Available products:
${allProducts.map(p => `- ID: ${p.id}, Name: ${p.name}, Description: ${p.description}, Price: $${p.price}, Stock: ${p.stock}`).join('\n')}

User Profile:
- Recent interests: ${userActivity.interests.join(', ') || 'None detected'}
- Preferred categories: ${userActivity.preferredCategories.join(', ') || 'None detected'}
- Price range preference: $${userActivity.priceRange.min} - $${userActivity.priceRange.max}
- Recent messages: ${userActivity.recentMessages.slice(0, 3).join('; ') || 'No recent activity'}

Instructions:
1. Select 4-6 products that best match the user's profile and interests
2. If no user activity is available, recommend popular, diverse products across categories
3. For each product, provide:
   - A personalized reason for the recommendation
   - A confidence score (0-100) based on how well it matches user preferences  
   - Relevant category classification
   - 2-3 AI tags highlighting key features or benefits
4. Ensure recommendations are diverse across categories when possible
5. Consider price preferences when available
6. Only recommend products that are in stock

Response format: Return recommendations with insights about the selection process.`;

    const result = await generateObject({
      model: openai('gpt-4o-mini'),
      system: systemPrompt,
      prompt: `Generate personalized product recommendations for this user. Focus on quality matches and diverse selection.${userId ? ' User is authenticated.' : ' User is anonymous - use general popular items.'}`,
      schema: recommendationSchema,
      temperature: 0.7,
    });

    const recommendations = result.object;

    // Ensure we only return products that exist in our database
    const validRecommendations = recommendations.products.filter(rec => 
      allProducts.some(p => p.id === rec.id && (p.stock || 0) > 0)
    );

    return NextResponse.json({
      products: validRecommendations,
      insights: {
        ...recommendations.insights,
        totalRecommendations: validRecommendations.length,
        personalizationNote: userId 
          ? `Recommendations based on your browsing history and preferences.`
          : `General recommendations. Sign in for personalized suggestions!`,
      },
    });

  } catch (error) {
    console.error('Error generating recommendations:', error);
    
    // Fallback: return some basic recommendations without AI
    const fallbackProducts = await db.select().from(products).limit(4);
    
    const basicRecommendations = fallbackProducts.map((product, index) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      stock: product.stock || 0,
      reason: "Popular choice among customers",
      confidence: 75 + index * 5,
      category: "General",
      aiTags: ["Popular", "Quality Choice"],
    }));

    return NextResponse.json({
      products: basicRecommendations,
      insights: {
        totalRecommendations: basicRecommendations.length,
        averageConfidence: 80,
        topCategories: ["General"],
        personalizationNote: "Basic recommendations available. AI recommendations temporarily unavailable.",
      },
    });
  }
}