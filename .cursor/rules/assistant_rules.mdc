Project Rules for AI Assistant
This document provides a set of rules and conventions for the Polling App project. These rules are designed to guide the AI assistant in generating code that is consistent with the project's architecture and best practices.

1. Folder Structure
All pages for routes should be located in the /app directory, using the Next.js App Router convention (page.tsx).

All shared components should be placed in the /components directory.

Authentication-specific components should be nested in /components/auth.

All Supabase-related client code and helpers should be in the /lib directory, for example, /lib/supabaseClient.ts.

All API routes should be created under /app/api/.

2. Form Libraries
All forms must be built using react-hook-form for state management and handling.

Client-side validation must be implemented using Zod schemas.

The UI for all forms must use shadcn/ui components for styling and accessibility.

3. Supabase Integration
The project uses Supabase for authentication and database interactions.

An AuthContext must be used to provide the user's session data to components that require it. This context should be initialized in /context/auth.tsx.

Direct API calls to Supabase should be handled within server actions or API routes, not directly in client components.

When generating authentication forms, use mock handlers in place of direct Supabase calls until the backend integration is ready.

4. Code and Styling
All components should be written in TypeScript (.tsx).

Tailwind CSS is the primary styling method. Use class names from the Tailwind utility library.

Ensure UI elements include helpful UX cues, such as loading states, error messages, and success notifications.