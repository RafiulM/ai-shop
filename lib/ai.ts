import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { db } from '@/db';
import { products, chats, messages } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  imageUrl?: string;
  stock: number;
  createdAt: Date;
}

interface Message {
  id: number;
  chatId: number;
  role: string;
  content: string;
  createdAt: Date;
}

// Create OpenAI provider instance - use directly without variable assignment

// Product schema for structured output
const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  price: z.string(),
  imageUrl: z.string().nullable(),
  stock: z.number(),
});

// Chat response schema
const chatResponseSchema = z.object({
  message: z.string(),
  products: z.array(productSchema).optional(),
  followUpQuestions: z.array(z.string()).optional(),
});

export async function getChatResponse(
  message: string,
  userId?: string,
  chatId?: number
) {
  let allProducts: Product[] = [];
  let chatHistory: Message[] = [];

  try {
    console.log('Getting products from database...');
    // Get all products for context
    const dbProducts = await db.select().from(products);
    allProducts = dbProducts.map(p => ({
      ...p,
      imageUrl: p.imageUrl || undefined,
      stock: p.stock || 0,
      createdAt: p.createdAt || new Date(),
    }));
    console.log(`Found ${allProducts.length} products`);

    // Get chat history if chatId is provided
    if (chatId) {
      console.log('Getting chat history for chat:', chatId);
      const history = await db
        .select()
        .from(messages)
        .where(eq(messages.chatId, chatId))
        .orderBy(desc(messages.createdAt))
        .limit(10);

      chatHistory = history.reverse().map(m => ({
      ...m,
      createdAt: m.createdAt || new Date(),
    }));
      console.log(`Found ${chatHistory.length} chat messages`);
    }
  } catch (dbError) {
    console.error('Database error in getChatResponse:', dbError);
    // Continue with empty data if database fails
    allProducts = [];
    chatHistory = [];
  }

  // Create the prompt
  const systemPrompt = `You are an AI shopping assistant for an e-commerce store.
Your goal is to help users find the perfect products based on their needs.

Available products:
${allProducts.map(p => `- ${p.name}: ${p.description} (Price: $${p.price}, Stock: ${p.stock})`).join('\n')}

Instructions:
1. Be helpful, friendly, and conversational
2. Ask clarifying questions if needed
3. Recommend relevant products based on user queries
4. If user asks for product recommendations, respond with a structured JSON that includes:
   - message: Your conversational response
   - products: Array of recommended product objects (if applicable)
   - followUpQuestions: Optional array of follow-up questions
5. Keep responses concise and focused on helping the user shop
6. If no products match the user's request, suggest alternatives or ask for more details

Response format: Return a JSON object with the structure:
{
  "message": "Your conversational response to the user",
  "products": [
    {
      "id": 1,
      "name": "Product Name",
      "description": "Product description",
      "price": "19.99",
      "imageUrl": "url/to/image.jpg",
      "stock": 10
    }
  ],
  "followUpQuestions": ["Would you like to see more options?", "What's your budget range?"]
}`;

  try {
    console.log('AI Request:', {
      hasApiKey: !!process.env.OPENAI_API_KEY,
      messageLength: message.length,
      productsCount: allProducts.length,
      chatHistoryLength: chatHistory.length
    });

    // Generate AI response
    const result = await generateObject({
      model: openai('gpt-4o-mini'),
      system: systemPrompt,
      prompt: `User message: "${message}"${chatHistory.length > 0 ? '\n\nChat history:\n' + chatHistory.map(m => `${m.role}: ${m.content}`).join('\n') : ''}`,
      schema: chatResponseSchema,
      temperature: 0.7,
    });

    console.log('AI Response successful');

    const response = result.object;

    // Save message to database if user is authenticated
    if (userId && chatId) {
      try {
        await db.insert(messages).values({
          chatId,
          role: 'user',
          content: message,
        });

        await db.insert(messages).values({
          chatId,
          role: 'assistant',
          content: JSON.stringify(response),
        });
        console.log('Messages saved to database');
      } catch (dbError) {
        console.error('Database save error:', dbError);
        // Continue even if database save fails
      }
    }

    return response;
  } catch (error) {
    console.error('AI Error Details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      error: error
    });

    // Check for specific error types
    if (error instanceof Error) {
      if (error.message.includes('API_KEY')) {
        return {
          message: "I'm not properly configured to respond right now. Please check the API key configuration.",
          products: [],
          followUpQuestions: [],
        };
      }

      if (error.message.includes('rate_limit')) {
        return {
          message: "I'm receiving too many requests right now. Please wait a moment and try again.",
          products: [],
          followUpQuestions: [],
        };
      }

      if (error.message.includes('timeout')) {
        return {
          message: "I'm taking too long to respond. Please try a simpler question.",
          products: [],
          followUpQuestions: [],
        };
      }
    }

    // Fallback response with more specific error info
    return {
      message: "I'm having trouble processing your request right now. This could be due to API configuration or service issues. Please try again later.",
      products: [],
      followUpQuestions: [],
    };
  }
}

export async function createNewChat(userId: string) {
  const [newChat] = await db.insert(chats).values({
    userId,
  }).returning();

  return newChat;
}

export async function getChatHistory(userId: string) {
  const userChats = await db
    .select({
      id: chats.id,
      createdAt: chats.createdAt,
      messages: messages,
    })
    .from(chats)
    .leftJoin(messages, eq(chats.id, messages.chatId))
    .where(eq(chats.userId, userId))
    .orderBy(desc(chats.createdAt));

  // Group messages by chat
  const groupedChats = userChats.reduce((acc, row) => {
    if (!acc[row.id!]) {
      acc[row.id!] = {
        id: row.id!,
        createdAt: row.createdAt!,
        messages: [],
      };
    }
    if (row.messages) {
      acc[row.id!].messages.push({
        ...row.messages,
        createdAt: row.messages.createdAt || new Date(),
      });
    }
    return acc;
  }, {} as Record<string, { id: number; createdAt: Date; messages: Message[] }>);

  return Object.values(groupedChats);
}