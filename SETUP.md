# AI Shop Application Setup Guide

## 🎯 Project Overview

AI Shop is an interactive e-commerce web application where users can shop through natural language conversations with an AI chatbot. The AI provides personalized product recommendations and helps users find what they're looking for.

## ✨ Features

- **Interactive AI Chatbot**: Natural language shopping assistance
- **Product Recommendations**: AI-powered product suggestions with visual cards
- **User Authentication**: Secure sign-in/sign-up with better-auth
- **Chat History**: Save and review conversations (authenticated users)
- **Admin Panel**: Full CRUD operations for product management
- **Responsive Design**: Works on desktop and mobile devices

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **AI Integration**: Vercel AI SDK, OpenAI GPT-4o-mini
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: better-auth
- **UI Components**: Radix UI, Tailwind CSS, Lucide Icons
- **Development**: Docker, ESLint, TypeScript

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- OpenAI API key

### Environment Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Start the database:**
   ```bash
   npm run db:up
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Visit the application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
ai-shop/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── chat/          # Chat functionality
│   │   └── products/      # Product management
│   ├── admin/             # Admin panel
│   ├── sign-in/           # Sign-in page
│   ├── sign-up/           # Sign-up page
│   └── page.tsx           # Main chat interface
├── components/            # React components
│   ├── chat/             # Chat-related components
│   └── ui/               # UI components
├── db/                   # Database schema
├── lib/                  # Utility functions
├── scripts/              # Database scripts
├── drizzle/              # Database migrations
└── documentation/        # Project documentation
```

## 🎮 Usage Guide

### For Users

1. **Start Shopping**: Open the app and begin chatting with the AI assistant
2. **Natural Language**: Ask for products using natural language (e.g., "I need running shoes for marathon training")
3. **View Recommendations**: The AI will show product cards with images, prices, and details
4. **Authentication**: Sign in to save chat history and get personalized experiences
5. **Continue Conversations**: Access previous chats through the chat history feature

### For Admins

1. **Access Admin Panel**: Visit `/admin` (requires authentication)
2. **Manage Products**: Add, edit, or delete products
3. **Update Inventory**: Modify stock levels and pricing
4. **Monitor Performance**: View product catalog and manage inventory

## 🔧 Database Management

### Useful Commands

```bash
# Start PostgreSQL
npm run db:up

# Stop PostgreSQL
npm run db:down

# View database in Drizzle Studio
npm run db:studio

# Generate migrations
npm run db:generate

# Push schema changes
npm run db:push
```

### Database Schema

- **products**: Product catalog with details and pricing
- **chats**: Conversation sessions per user
- **messages**: Individual chat messages
- **user/**: Authentication tables (users, sessions, accounts)

## 🤖 AI Configuration

The AI chatbot is configured to:
- Understand natural language shopping requests
- Provide relevant product recommendations
- Ask clarifying questions when needed
- Display product information in card format
- Remember conversation context

To modify AI behavior, edit `lib/ai.ts` and adjust the system prompt.

## 🧪 Testing

The application includes 10 sample products for testing the AI functionality. You can:
- Chat with the AI about various product categories
- Test authentication and chat history
- Use the admin panel to manage products
- Verify responsive design on different devices

## 📝 Development Notes

- The app uses Next.js App Router for modern routing
- Better-auth provides authentication with session management
- Drizzle ORM ensures type-safe database operations
- Vercel AI SDK enables streaming AI responses
- Tailwind CSS provides utility-first styling

## 🔮 Future Enhancements

- Shopping cart functionality
- Order management system
- Payment integration
- Product search and filtering
- User preferences and personalization
- Multi-language support
- Advanced AI capabilities

---

**Built with ❤️ using Next.js, OpenAI, and modern web technologies**