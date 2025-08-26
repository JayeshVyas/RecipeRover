# Overview

This is a Marketing Insights & Automation Platform similar to Marble AI, designed specifically for the marketing industry. The platform enables users to connect their advertising accounts (Google Ads, Meta, LinkedIn, TikTok, GA4), interact with an AI assistant for insights and analysis, and manage marketing campaigns through a comprehensive dashboard. The system is built with a modern full-stack architecture using React/TypeScript for the frontend and Node.js/Express for the backend, with PostgreSQL for data persistence.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Components**: Shadcn/UI component library with Radix UI primitives for accessibility
- **Styling**: TailwindCSS with custom CSS variables for theming (dark mode support)
- **State Management**: TanStack React Query for server state and caching
- **Routing**: Wouter for lightweight client-side routing
- **Charts**: Recharts for data visualization and analytics dashboards

## Backend Architecture  
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API architecture with structured route handlers
- **Development**: Hot reload with tsx for development server
- **Build**: esbuild for production bundling with external package handling

## Data Layer
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema**: Comprehensive schema covering users, campaigns, alerts, AI interactions, and connected accounts
- **Storage Strategy**: In-memory storage implementation for development with interface for easy PostgreSQL migration
- **Caching**: Designed for Redis integration to reduce API quota usage
- **Migrations**: Drizzle Kit for database schema management

## AI Integration
- **Provider**: OpenAI GPT models for natural language processing
- **Architecture**: Structured AI service layer for processing marketing queries
- **Context Handling**: Rich context passing including campaign data, alerts, and user preferences
- **Response Format**: JSON-structured responses with insights and recommendations

## External Service Integrations
- **Google Ads**: Service layer with metrics collection for campaigns, impressions, clicks, conversions
- **Future Platforms**: Extensible architecture for Meta Ads, LinkedIn Ads, TikTok, GA4
- **Authentication**: OAuth2 flow preparation for connecting advertising accounts
- **API Management**: Rate limiting and quota management considerations

## Security & Authentication
- **Session Management**: Built-in user authentication system with role-based access control
- **Data Protection**: Secure storage patterns for API tokens and credentials
- **CORS**: Configured for cross-origin requests in development environment

## Performance Optimizations
- **Code Splitting**: Vite-based bundling with dynamic imports
- **Caching Strategy**: React Query with infinite stale time for dashboard data
- **Image Optimization**: Asset optimization through Vite build process
- **Bundle Analysis**: Development tools for performance monitoring

# External Dependencies

## Core Framework Dependencies
- **React 18**: Component library with hooks and modern patterns
- **Express.js**: Web application framework for Node.js
- **TypeScript**: Type safety across frontend and backend
- **Vite**: Fast build tool and development server

## Database & ORM
- **Drizzle ORM**: Type-safe PostgreSQL operations with schema validation
- **Drizzle Kit**: Database migration and schema management
- **@neondatabase/serverless**: PostgreSQL database driver optimized for serverless

## UI & Styling
- **Shadcn/UI**: Complete component library built on Radix UI
- **Radix UI**: Headless UI primitives for accessibility
- **TailwindCSS**: Utility-first CSS framework
- **Lucide Icons**: Consistent icon library

## State Management & Data Fetching
- **TanStack React Query**: Server state management with caching
- **React Hook Form**: Form handling with validation
- **Zod**: Runtime type validation and schema validation

## AI & External APIs
- **OpenAI**: GPT model integration for marketing insights
- **Google Ads API**: (Planned) Campaign performance data
- **Various Ad Platform APIs**: (Planned) Meta, LinkedIn, TikTok integrations

## Development & Build Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production
- **PostCSS**: CSS processing with autoprefixer
- **Wouter**: Lightweight routing library

## Utility Libraries
- **date-fns**: Date manipulation and formatting
- **clsx**: Conditional CSS class utilities
- **class-variance-authority**: Type-safe variant styling