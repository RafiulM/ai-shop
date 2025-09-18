'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from './product-card';
import { AuthButtons } from '@/components/auth-buttons';
import { useSession } from '@/lib/auth-client';
import { Send, Bot, User, ShoppingCart } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  imageUrl?: string;
  stock: number;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  products?: Product[];
}

interface ChatInterfaceProps {
  onAuthRequired?: () => void;
}

export function ChatInterface({ onAuthRequired: _onAuthRequired }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI shopping assistant. I'm here to help you find the perfect products for your needs. What are you looking for today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const requestBody = {
        message: input,
        ...(currentChatId && { chatId: currentChatId }),
      };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!data.success) {
        // Handle structured error responses
        let errorMessage = "I'm sorry, I'm having trouble responding right now. Please try again later.";

        if (data.error) {
          // Map error codes to user-friendly messages
          switch (data.code) {
            case 'INVALID_MESSAGE':
            case 'EMPTY_MESSAGE':
            case 'MESSAGE_TOO_LONG':
            case 'INVALID_CHAT_ID':
              errorMessage = data.details || data.error;
              break;
            case 'RATE_LIMITED':
              errorMessage = "I'm getting too many requests right now. Please wait a moment and try again.";
              break;
            case 'TIMEOUT':
              errorMessage = "I'm taking too long to respond. Please try your question again.";
              break;
            case 'SERVICE_UNAVAILABLE':
            case 'DATABASE_ERROR':
              errorMessage = "I'm having some technical difficulties right now. Please try again in a moment.";
              break;
            case 'AI_CONFIG_ERROR':
              errorMessage = "I'm not properly configured right now. Please contact support.";
              break;
            case 'QUOTA_EXCEEDED':
              errorMessage = "I've reached my usage limit for now. Please try again later.";
              break;
            default:
              errorMessage = data.details || data.error || errorMessage;
          }
        }

        const errorAssistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: errorMessage,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, errorAssistantMessage]);
        return;
      }

      // Update chat ID if it's a new chat
      if (data.chatId && !currentChatId) {
        setCurrentChatId(data.chatId);
      }

      // Parse the AI response
      let aiResponse;
      try {
        aiResponse = JSON.parse(data.response.message);
      } catch {
        aiResponse = {
          message: data.response.message,
          products: data.response.products || [],
        };
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse.message,
        timestamp: new Date(),
        products: aiResponse.products || [],
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble connecting to my services right now. Please check your internet connection and try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              AI Shopping Assistant
              <Badge variant="secondary" className="ml-2">
                {session ? 'Online' : 'Guest'}
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-2">
              {!session && <AuthButtons />}
              {session && (
                <Avatar className="w-8 h-8">
                  <AvatarImage src={session.user?.image || ''} />
                  <AvatarFallback>
                    {session.user?.name?.[0] || <User className="w-4 h-4" />}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 px-4 pb-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback>
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    {message.products && message.products.length > 0 && (
                      <div className="mt-3 space-y-3">
                        {message.products.map((product) => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                      </div>
                    )}
                    <p className="text-xs opacity-70 mt-1">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>

                  {message.role === 'user' && (
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarImage src={session?.user?.image || ''} />
                      <AvatarFallback>
                        {session?.user?.name?.[0] || <User className="w-4 h-4" />}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback>
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me about products, make recommendations, or get shopping advice..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </form>

            {!session && (
              <div className="mt-2 text-xs text-muted-foreground text-center">
                <a href="/sign-in" className="hover:underline">
                  Sign in
                </a>{' '}
                to save your chat history and get personalized recommendations
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}