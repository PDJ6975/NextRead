# NextRead - AI-Powered Book Recommendation System

A full-stack web application that provides personalized book recommendations using artificial intelligence. Built as a modern monorepo demonstrating enterprise-level software architecture, clean code practices, and comprehensive full-stack development skills.

## Live Demo

- **Frontend**: [https://PDJ6975.github.io/NextRead_NOAI/](https://PDJ6975.github.io/NextRead_NOAI/)
- **Backend API**: [Production Endpoint]
- **Database**: Supabase PostgreSQL

## Project Overview

NextRead is a sophisticated book recommendation platform that leverages OpenAI's GPT-4 to generate personalized reading suggestions. The system analyzes user preferences, reading history, and behavioral patterns to deliver intelligent recommendations with detailed reasoning.

### Key Features

- **AI-Powered Recommendations**: Integration with OpenAI GPT-4 for intelligent book suggestions
- **User Preference Analysis**: Comprehensive survey system capturing reading habits and preferences
- **Personal Library Management**: Complete CRUD operations for user book collections
- **Reading Progress Tracking**: Status management and rating system for books
- **Responsive Design**: Mobile-first approach with custom design system
- **Real-time Updates**: Dynamic UI updates with optimistic rendering
- **Hybrid Book Search**: Integration with Google Books API and local database
- **Email Verification**: Secure user registration with automated email workflows

## Technical Architecture

### Backend (Spring Boot)

**Framework & Tools**
- Spring Boot 3.5.3 with Spring Security 6
- Spring Data JPA with Hibernate
- PostgreSQL with Supabase integration
- Maven for dependency management
- JWT-based authentication with secure token handling

**Key Technical Implementations**
- **RESTful API Design**: Comprehensive REST endpoints following best practices
- **Security Layer**: JWT authentication with configurable CORS policies
- **Database Design**: Normalized relational schema with proper indexing
- **Service Layer Architecture**: Clear separation of concerns with service abstractions
- **External API Integration**: Google Books API for book metadata enrichment
- **Email Service**: Automated verification emails with template system
- **OpenAI Integration**: Structured prompt engineering for consistent AI responses

**Advanced Features**
- **Data Validation**: Custom validators with annotation-based constraints
- **Exception Handling**: Global exception handling with meaningful error responses
- **Transaction Management**: Proper transactional boundaries for data consistency
- **Configuration Management**: Environment-based configuration with profiles

### Frontend (Next.js)

**Framework & Technologies**
- Next.js 14 with App Router architecture
- React 18 with modern hooks and context patterns
- Tailwind CSS with custom design system
- Axios for HTTP client with interceptors
- Zod for runtime type validation

**Advanced React Patterns**
- **Context API**: Centralized state management for authentication
- **Custom Hooks**: Reusable logic abstraction for forms and API calls
- **Component Composition**: Flexible component architecture with variant patterns
- **Optimistic Updates**: Immediate UI feedback with error recovery
- **Protected Routes**: Route-level authentication guards

**UI/UX Engineering**
- **Custom Design System**: "Cozy" theme with consistent color palette and typography
- **Responsive Components**: Mobile-first responsive design patterns
- **Interactive Elements**: Advanced interactions like half-star ratings and carousels
- **Modal System**: Reusable modal architecture with scroll management
- **Loading States**: Comprehensive loading and error state handling
- **Form Validation**: Real-time validation with user-friendly error messages

### Database Architecture

**PostgreSQL Schema Design**
- **User Management**: Users, authentication tokens, email verification
- **Content System**: Books, authors with many-to-many relationships
- **User Interactions**: Reading history, ratings, recommendations
- **Survey System**: User preferences and onboarding data

**Data Integrity**
- Foreign key constraints ensuring referential integrity
- Proper indexing for performance optimization
- Normalized design preventing data duplication
- Audit fields for tracking data changes

## AI Integration Strategy

**OpenAI GPT-4 Implementation**
- **Prompt Engineering**: Structured prompts for consistent recommendation quality
- **Response Processing**: Robust JSON parsing with validation and error recovery
- **Context Building**: User preference analysis and reading history integration
- **Rate Limiting**: Intelligent retry mechanisms and API call optimization

**Recommendation Algorithm**
- Analysis of user reading patterns and preferences
- Integration of previously read and abandoned books
- Exclusion logic for recently rejected recommendations
- Diversity algorithms ensuring varied genre recommendations

## Development Practices

### Code Quality
- **Clean Architecture**: Clear separation between presentation, business, and data layers
- **SOLID Principles**: Dependency inversion and single responsibility implementation
- **Error Handling**: Comprehensive exception handling with graceful degradation
- **Code Documentation**: Self-documenting code with meaningful variable names

### Testing Strategy
- **Unit Testing**: Service layer and utility function testing
- **Integration Testing**: API endpoint testing with database interactions
- **Component Testing**: Frontend component behavior validation
- **Error Scenario Testing**: Edge case and failure condition coverage

### DevOps & Deployment
- **CI/CD Pipeline**: GitHub Actions for automated testing and deployment
- **Environment Management**: Separate development and production configurations
- **Static Site Generation**: Next.js static export for GitHub Pages deployment
- **Database Migration**: Structured schema evolution and data migration

## API Design

### RESTful Endpoints
- **Authentication**: `/auth/signup`, `/auth/login`, `/auth/verify`
- **User Management**: `/users/me`, `/users/nickname`, `/users/avatar`
- **Book Operations**: `/books/search`, `/userbooks` CRUD operations
- **Recommendations**: `/recommendations/generate`, `/recommendations` management
- **Survey System**: `/surveys/find`, `/surveys/update`

### Security Implementation
- JWT token-based authentication with configurable expiration
- CORS configuration for cross-origin resource sharing
- Input validation and sanitization across all endpoints
- Secure password hashing with Spring Security

## Performance Optimizations

**Frontend Optimizations**
- Lazy loading for improved initial page load
- Optimistic updates reducing perceived latency
- Image optimization with fallback strategies
- Efficient re-rendering with React memoization

**Backend Optimizations**
- Database query optimization with proper indexing
- Caching strategies for frequently accessed data
- Efficient batch operations for bulk data processing
- Connection pooling for database performance

## Skills Demonstrated

### Full-Stack Development
- Complete ownership of application from database design to user interface
- Integration of complex business logic across multiple layers
- Real-world problem solving with scalable solutions

### Modern Web Technologies
- Advanced React patterns and Next.js features
- Spring Boot ecosystem with security integration
- PostgreSQL database design and optimization
- RESTful API design following industry standards

### Software Engineering Practices
- Clean code principles and architectural patterns
- Comprehensive error handling and user experience design
- Version control with meaningful commit history
- Documentation and code maintainability

### AI/ML Integration
- Practical machine learning integration in production applications
- Prompt engineering for consistent AI responses
- Data preprocessing and response validation

### DevOps & Deployment
- CI/CD pipeline configuration and automation
- Environment management and deployment strategies
- Performance monitoring and optimization techniques

## Local Development

### Prerequisites
- Node.js 18+ and npm
- Java 17+ and Maven
- PostgreSQL database (or Supabase account)

### Setup Instructions

**Backend Setup**
```bash
cd apps/api
cp .env.example .env
# Configure environment variables
mvn spring-boot:run
```

**Frontend Setup**
```bash
cd apps/web
npm install
cp .env.local.example .env.local
# Configure API URL
npm run dev
```

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET_KEY`: Secure random key for JWT signing
- `OPENAI_API_KEY`: OpenAI API key for recommendations
- `NEXT_PUBLIC_API_URL`: Backend API endpoint for frontend

## Production Deployment

The application is deployed using a modern cloud architecture:
- Frontend deployed to GitHub Pages with automated CI/CD
- Backend deployed to Railway/Render with zero-downtime deployment
- Database hosted on Supabase with automatic backups
- Environment-specific configuration management

## Project Structure

```
NextRead_NOAI/
├── apps/
│   ├── api/          # Spring Boot backend
│   │   ├── src/main/java/com/nextread/
│   │   │   ├── config/       # Security and application configuration
│   │   │   ├── controller/   # REST API controllers
│   │   │   ├── dto/          # Data transfer objects
│   │   │   ├── entities/     # JPA entity models
│   │   │   ├── repositories/ # Data access layer
│   │   │   └── services/     # Business logic layer
│   │   └── src/test/         # Comprehensive test suite
│   └── web/          # Next.js frontend
│       ├── src/
│       │   ├── app/          # Next.js App Router pages
│       │   ├── components/   # Reusable UI components
│       │   ├── contexts/     # React Context providers
│       │   ├── hooks/        # Custom React hooks
│       │   ├── lib/          # Utility libraries
│       │   └── services/     # API service layer
│       └── public/           # Static assets
├── .github/workflows/        # CI/CD configuration
└── docs/                     # Project documentation
```

This project demonstrates practical experience with modern web development technologies, clean code practices, and the ability to deliver complete, production-ready applications. The codebase showcases problem-solving skills, attention to detail, and understanding of both user experience and technical implementation challenges.