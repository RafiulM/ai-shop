import { NextRequest, NextResponse } from 'next/server';
import { getChatResponse, createNewChat } from '@/lib/ai';
import { auth } from '@/lib/auth';

interface ChatRequest {
  message: string;
  chatId?: number;
}

interface ChatErrorResponse {
  error: string;
  code?: string;
  details?: string;
  retryable?: boolean;
}

class ChatError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: string,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'ChatError';
  }
}

function getErrorMessage(error: unknown): ChatErrorResponse {
  if (error instanceof ChatError) {
    return {
      error: error.message,
      code: error.code,
      details: error.details,
      retryable: error.retryable,
    };
  }

  if (error instanceof Error) {
    // Handle specific error types
    if (error.message.includes('ENOENT') || error.message.includes('ECONNREFUSED')) {
      return {
        error: 'Service temporarily unavailable',
        code: 'SERVICE_UNAVAILABLE',
        details: 'Unable to connect to required services. Please try again in a moment.',
        retryable: true,
      };
    }

    if (error.message.includes('timeout')) {
      return {
        error: 'Request timeout',
        code: 'TIMEOUT',
        details: 'The request took too long to complete. Please try again.',
        retryable: true,
      };
    }

    if (error.message.includes('invalid_api_key')) {
      return {
        error: 'AI service configuration error',
        code: 'AI_CONFIG_ERROR',
        details: 'The AI service is not properly configured. Please contact support.',
        retryable: false,
      };
    }

    if (error.message.includes('rate_limit')) {
      return {
        error: 'Too many requests',
        code: 'RATE_LIMITED',
        details: 'Please wait a moment before sending another message.',
        retryable: true,
      };
    }

    if (error.message.includes('insufficient_quota')) {
      return {
        error: 'Service limit reached',
        code: 'QUOTA_EXCEEDED',
        details: 'The AI service has reached its usage limit. Please try again later.',
        retryable: true,
      };
    }
  }

  // Database connection errors
  if (error && typeof error === 'object' && 'code' in error) {
    const dbError = error as { code: string };
    if (dbError.code === 'ECONNREFUSED' || dbError.code === '3D000') {
      return {
        error: 'Database connection failed',
        code: 'DATABASE_ERROR',
        details: 'Unable to connect to the database. Please try again later.',
        retryable: true,
      };
    }

    if (dbError.code === '23505') {
      return {
        error: 'Data conflict',
        code: 'DATA_CONFLICT',
        details: 'There was a conflict saving your data. Please try again.',
        retryable: true,
      };
    }
  }

  // Default error
  return {
    error: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
    details: 'We encountered an unexpected issue. Please try again.',
    retryable: true,
  };
}

function validateRequest(body: Record<string, unknown>): ChatRequest {
  if (!body || typeof body !== 'object') {
    throw new ChatError(
      'Invalid request format',
      'INVALID_REQUEST',
      'The request must be a valid JSON object.',
      false
    );
  }

  const { message, chatId } = body;

  if (!message || typeof message !== 'string') {
    throw new ChatError(
      'Message is required and must be a string',
      'INVALID_MESSAGE',
      'Please provide a valid message.',
      false
    );
  }

  if (message.trim().length === 0) {
    throw new ChatError(
      'Message cannot be empty',
      'EMPTY_MESSAGE',
      'Please provide a non-empty message.',
      false
    );
  }

  if (message.length > 2000) {
    throw new ChatError(
      'Message is too long',
      'MESSAGE_TOO_LONG',
      'Messages must be less than 2000 characters.',
      false
    );
  }

  // Handle chatId properly - null/undefined are valid (for new chats)
  if (chatId !== null && chatId !== undefined && (typeof chatId !== 'number' || !Number.isInteger(chatId) || chatId <= 0)) {
    throw new ChatError(
      'Invalid chat ID',
      'INVALID_CHAT_ID',
      'Chat ID must be a positive integer or null/undefined for new chats.',
      false
    );
  }

  // Convert null to undefined for consistency
  return { message: message.trim(), chatId: chatId || undefined };
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  let requestId: string = 'unknown';

  try {
    // Generate request ID for tracking
    requestId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log(`[${requestId}] Starting chat request`);

    // Parse and validate request
    let body: Record<string, unknown>;
    try {
      body = await req.json() as Record<string, unknown>;
    } catch {
      throw new ChatError(
        'Invalid JSON format',
        'INVALID_JSON',
        'The request body must be valid JSON.',
        false
      );
    }

    const { message, chatId } = validateRequest(body);
    console.log(`[${requestId}] Validated request: message length=${message.length}, chatId=${chatId}`);

    // Get user session
    let session;
    try {
      session = await auth.api.getSession({
        headers: req.headers,
      });
      console.log(`[${requestId}] Auth session: ${session?.user?.id ? 'authenticated' : 'anonymous'}`);
    } catch (authError) {
      console.error(`[${requestId}] Auth error:`, authError);
      // Continue without authentication - this is not a blocking error
    }

    let userId = session?.user?.id;
    let finalChatId = chatId;

    // Create new chat for authenticated users if needed
    if (userId) {
      try {
        if (!finalChatId) {
          console.log(`[${requestId}] Creating new chat for user: ${userId}`);
          const newChat = await createNewChat(userId);
          finalChatId = newChat.id;
          console.log(`[${requestId}] New chat created: ${finalChatId}`);
        }
      } catch (chatError) {
        console.error(`[${requestId}] Chat creation error:`, chatError);
        // Continue without chat creation - this is not a blocking error
        userId = undefined; // Treat as anonymous user
        finalChatId = undefined;
      }
    }

    // Get AI response
    console.log(`[${requestId}] Getting AI response...`);
    const response = await getChatResponse(message, userId, finalChatId);
    console.log(`[${requestId}] AI response received`);

    const responseTime = Date.now() - startTime;
    console.log(`[${requestId}] Request completed in ${responseTime}ms`);

    return NextResponse.json({
      success: true,
      response,
      chatId: finalChatId,
      requestId,
      responseTime,
      authenticated: !!userId,
    });

  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error(`[${requestId || 'unknown'}] Chat API Error after ${responseTime}ms:`, error);

    const errorResponse = getErrorMessage(error);
    const statusCode = errorResponse.code === 'INVALID_REQUEST' ? 400 : 500;

    return NextResponse.json({
      success: false,
      error: errorResponse.error,
      code: errorResponse.code,
      details: errorResponse.details,
      retryable: errorResponse.retryable,
      requestId,
      responseTime,
    }, { status: statusCode });
  }
}