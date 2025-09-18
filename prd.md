Of course\! Here is the English translation of the Project Requirements Document.

-----

## **Project Requirements Document (PRD): Interactive Store with AI Chatbot**

This document outlines the functional and technical requirements for building an innovative e-commerce web application where the primary user interaction is through an AI chatbot for product recommendations.

### **1. Project Goals** 🎯

The main goals of this project are to:

1.  **Create a Unique Shopping Experience:** Offer a new way for customers to discover products through natural language conversations.
2.  **Increase Conversion Rates:** Help users find the most relevant products quickly, thereby increasing the likelihood of a purchase.
3.  **Simplify Navigation:** Reduce the need for users to browse through complex categories and filters; they can simply ask the AI.

### **2. Tech Stack** 💻

  * **Framework:** Next.js 15
  * **AI & Chat Interface:** Vercel AI SDK
  * **ORM & Database:** Drizzle ORM with PostgreSQL
  * **Authentication:** better-auth

-----

### **3. Core Features** ✨

#### **For Users (User-Facing)**

  * **Interactive AI Chatbot:**

      * A chat interface as the main landing page.
      * The chatbot can understand user requests in natural language (e.g., "find me comfortable running shoes for a marathon," "any birthday gift recommendations for my girlfriend?").
      * The AI can ask clarifying questions to narrow down product choices.

  * **Personalized Product Recommendations:**

      * The AI will access the product database to provide relevant recommendations.
      * Recommendations will not just be text but will also display UI components (product cards) containing an image, name, price, and a link to the detail page.

  * **User Authentication:**

      * Users can register and log in to their accounts using `better-auth`.
      * Login is required to save and view conversation history.

  * **Chat History:**

      * Logged-in users can review their previous conversations with the AI.

#### **For Admins (Admin-Facing)**

  * **Product Management (CRUD):**
      * A simple interface for Admins to create, read, update, and delete product data in the database.

-----

### **4. Application Flow** 🌊

1.  **User Arrives:** The user opens the web app and is immediately greeted by a chatbot interface ready for input.
2.  **Interaction Begins:** The user types their needs into the chatbox.
3.  **Backend Processing:**
      * The user's input is sent from the client (Next.js) to a serverless function using the Vercel AI SDK.
      * On the server, the application fetches relevant product data from the PostgreSQL database using Drizzle.
      * The product information and the user's query are combined into a comprehensive prompt.
      * This prompt is sent to a Large Language Model (LLM) such as GPT, Gemini, or others.
4.  **AI Responds:** The LLM processes the prompt and generates a response in the form of a text recommendation. The AI SDK streams this response back to the client.
5.  **Frontend Display:**
      * The chat interface displays the AI's response in real-time.
      * If the AI recommends products, the Vercel AI SDK will render special React components (product cards) directly within the chat.
6.  **Data Persistence:** Every message from the user and the AI is saved to the `messages` table in the database, linked to the user's `chat` session.
7.  **Continued Session:** The user can continue the conversation, and the AI will remember the context from previous messages in the same chat session to provide better recommendations.

-----

### **5. Database Schema (Drizzle Schema)** 💾

Here is a simple database schema designed for Drizzle ORM with PostgreSQL.

#### **`products` Table**

Stores all information about the products for sale.

```typescript
import { pgTable, serial, varchar, text, numeric, integer, timestamp } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  description: text('description').notNull(), // Detailed description is crucial for AI context
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  imageUrl: varchar('image_url', { length: 1024 }),
  stock: integer('stock').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});
```

#### **`users` Table**

Stores user data for authentication and chat history.

```typescript
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(), // Aligned with better-auth which often uses strings (e.g., from Clerk, Lucia)
  email: text('email').unique().notNull(),
  hashedPassword: text('hashed_password'), // To store the hashed password
  createdAt: timestamp('created_at').defaultNow(),
});
```

#### **`chats` and `messages` Tables**

Stores the conversation history between users and the AI.

```typescript
import { pgTable, serial, text, timestamp, integer, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './users'; // assuming a users.ts file

// Enum to define the role of the message sender
export const messageRoleEnum = pgEnum('message_role', ['user', 'assistant']);

// Table for each conversation session
export const chats = pgTable('chats', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(), // Relation to the users table
  createdAt: timestamp('created_at').defaultNow(),
});

// Table for each message within a conversation
export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  chatId: integer('chat_id').references(() => chats.id, { onDelete: 'cascade' }).notNull(), // Relation to the chats table
  role: messageRoleEnum('role').notNull(), // 'user' or 'assistant'
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
```

This document can serve as a strong initial guide to start your project development. Good luck\!