# Frontend Guidelines Document for ai-shop

This document provides a clear overview of the frontend setup, architecture, and best practices for the ai-shop project. It aims to guide any team member—technical or not—through how the user interface is built, styled, organized, and maintained.

## 1. Frontend Architecture

### 1.1 Overview
- The frontend is built with **Next.js**, a React-based framework that combines server-side rendering (SSR) and static site generation (SSG) in one tool.
- We use **TypeScript** (`.tsx` files) to catch errors early and make the code easier to understand.
- The code follows a **file-based routing** system: each folder under `/app` with a `page.tsx` file becomes a route in the app.

### 1.2 How It Supports Scalability, Maintainability, and Performance
- **Scalability**: Adding new pages or features is as simple as creating new folders and files—no central router file to update.
- **Maintainability**: Co-locating related files (page, layout, styles, API route) keeps code for each feature in one place, making it easy to find and change.
- **Performance**: Next.js automatically splits code and serves only what each page needs. We also benefit from built-in image optimization and fast data fetching methods.

## 2. Design Principles

### 2.1 Key Principles
- **Usability**: Interfaces should be simple and clear—buttons and links look like buttons and links.
- **Accessibility**: All interactive elements have keyboard support and proper labels. We follow WCAG guidelines for color contrast and screen-reader compatibility.
- **Responsiveness**: Pages adapt smoothly from mobile phones to desktops using flexible layouts and media queries.

### 2.2 Applying These Principles
- We use semantic HTML tags (like `<nav>`, `<main>`, `<button>`) so assistive technologies can understand the page structure.
- Color and font sizes meet contrast standards, and every image has an `alt` text.
- Layout components (headers, footers, grids) automatically adjust to screen size.

## 3. Styling and Theming

### 3.1 Styling Approach
- **CSS Modules**: We place component-specific styles in files named `Component.module.css`. This ensures styles apply only to that component.
- **Global Styles**: Shared styles (reset rules, typography defaults) go into `globals.css` at the root.
- **Naming Convention**: We follow the **BEM** (Block-Element-Modifier) pattern in our CSS class names to keep things clear:
  - Block: `product-card`  
  - Element: `product-card__title`  
  - Modifier: `product-card--featured`

### 3.2 Theming
- We use **CSS variables** (`--color-primary`, `--color-background`, etc.) defined in `globals.css`. Changing a variable in one place updates the look everywhere.
- Supports a default (light) theme. Adding a dark theme later is as easy as overriding those variables under a `.dark-theme` class.

### 3.3 Visual Style
- **Flat, modern design** with clean edges and plenty of white space.
- **Color Palette**:
  - Primary: #4F46E5 (Indigo)
  - Secondary: #6366F1 (Light Indigo)
  - Accent: #EC4899 (Pink)
  - Background: #F9FAFB (Light Gray)
  - Surface (cards, panels): #FFFFFF (White)
  - Text: #111827 (Dark Gray)
  - Success: #10B981 (Green)
  - Warning: #F59E0B (Orange)
  - Danger: #EF4444 (Red)
- **Font**: We use **Inter**, a modern sans-serif font for good readability and a friendly tone.

## 4. Component Structure

- Every UI element is a **React component** stored under `/app/components` or within feature folders (e.g., `/app/products/ProductCard`).
- Components come in two flavors:
  1. **Presentational Components**: Focus on layout and appearance.
  2. **Container Components**: Handle data fetching and pass data down to presentational parts.
- We encourage **reusability**: if a piece of UI appears more than once (like a button or card), it lives in a shared folder so multiple pages can import it.
- This structure makes it easier to track where things live, to reuse code, and to update shared components without hunting through many files.

## 5. State Management

### 5.1 Approach
- **Local State**: For simple show/hide logic or form inputs, we use React’s built-in `useState` and `useReducer` hooks.
- **Global State**:
  - **React Context** is used for session-level data, such as the user’s authentication status and shopping cart contents.
  - **SWR** (Stale-While-Revalidate) is our library for fetching and caching data (products, chat history, analytics) from API routes.

### 5.2 Sharing State
- Context providers live near the root layout (`layout.tsx`) so any page or component can tap into user, cart, or theme data.
- SWR hooks (e.g., `useSWR('/api/products')`) handle caching, revalidation, and background updates, ensuring smooth, up-to-date UIs.

## 6. Routing and Navigation

- **File-Based Routing**: Pages and API endpoints map directly to folders and files under `/app`:
  - `/app/products/page.tsx` → `/products` page
  - `/app/products/[id]/page.tsx` → `/products/123`
  - `/app/api/chat/route.ts` → `/api/chat`
- **Link Component**: We use Next.js’s `<Link>` component for internal navigation, which preloads linked pages for faster clicks.
- **Layouts**: Nested `layout.tsx` files define shared structure (like sidebars or headers) for a group of pages.

## 7. Performance Optimization

- **Code Splitting**: Next.js automatically splits JavaScript by page. For large components (e.g., charts), we use `next/dynamic` to load them only when needed.
- **Lazy Loading Images**: The built-in `<Image>` component optimizes images and defers off-screen images until they enter the viewport.
- **API Response Caching**: SWR caches API data in memory and reuses it across pages, reducing network requests.
- **Asset Optimization**: We minify CSS and JavaScript in production. Fonts and icons are served via CDN.

## 8. Testing and Quality Assurance

### 8.1 Unit and Integration Tests
- **Jest** + **React Testing Library**:
  - Test individual components in isolation.
  - Assert that buttons, forms, and data displays work as expected.

### 8.2 End-to-End (E2E) Tests
- **Playwright** or **Cypress**:
  - Simulate real user flows like logging in, adding items to the cart, and checking out.
  - Verify that navigation, forms, and API integration all behave correctly.

### 8.3 Linting and Formatting
- **ESLint** with recommended rules ensures consistent code style and catches common mistakes.
- **Prettier** formats code on save so the team never argues about spaces or semicolons.

## 9. Conclusion and Overall Frontend Summary

The ai-shop frontend is built to be:
- **Clear and Modular**: Features live in self-contained folders with co-located code, making it easy to navigate.
- **Fast and Responsive**: Next.js powers server-side rendering, image and asset optimization, and smart data fetching.
- **User-Friendly**: Design decisions focus on accessibility, simple navigation, and a modern flat look.
- **Easy to Maintain**: TypeScript, CSS Modules, and well-defined conventions keep code predictable and safe.

By following these guidelines, the team can add new features, maintain quality, and ensure a consistent user experience as ai-shop grows and evolves.