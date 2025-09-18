'use client';

import { ChatInterface } from '@/components/chat/chat-interface';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            AI Shop
          </h1>
          <p className="text-lg text-muted-foreground">
            Your intelligent shopping assistant
          </p>
        </div>

        {/* Chat Interface */}
        <ChatInterface />
      </div>
    </div>
  );
}