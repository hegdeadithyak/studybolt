# StudyBolt - Lightning-Fast AI Study Assistant

StudyBolt is a production-ready web application that transforms your notes into an intelligent study companion. Get instant AI-powered explanations, semantic search across all your materials, and conversational assistance that understands your learning style.

![StudyBolt Hero](src/assets/hero-image.jpg)

## 🚀 Features

### Core Functionality
- **Smart Notebooks**: Create, organize, and manage study materials with intelligent categorization
- **AI Chat Interface**: Conversational assistant powered by Mistral AI for explanations and problem-solving
- **Semantic Search**: Find concepts and ideas, not just keywords, across all your notes
- **Real-time Streaming**: Lightning-fast responses with token-level streaming
- **User Authentication**: Secure JWT-based authentication with refresh tokens

### User Experience
- **Beautiful Design**: Modern, academic-focused interface optimized for studying
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Dark/Light Mode**: Automatic theme switching based on system preferences
- **Optimistic UI**: Instant feedback and seamless interactions
- **Offline Support**: Client-side caching for offline access to recent content

### Technical Excellence
- **Production-Ready**: Built with TypeScript, React, and modern best practices
- **Scalable Architecture**: Designed for horizontal scaling with microservices
- **Security First**: Rate limiting, input sanitization, and secure authentication
- **Monitoring**: Comprehensive observability with metrics, logs, and tracing
- **CI/CD**: Automated testing, building, and deployment pipelines

## 🛠 Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for lightning-fast development
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui
- **State Management**: TanStack Query for server state
- **Routing**: React Router v6 with nested routes

### Backend (Coming Soon)
- **API**: FastAPI (Python) for high-performance async operations
- **Database**: PostgreSQL for relational data
- **Vector Store**: Milvus for semantic search and embeddings
- **Cache**: Redis for sessions, rate limiting, and caching
- **Queue**: Redis Streams for background job processing
- **AI Integration**: Mistral API for language model operations

### Infrastructure
- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Kubernetes with Helm charts
- **Cloud**: Terraform modules for AWS/GCP/Azure
- **Monitoring**: Prometheus, Grafana, OpenTelemetry
- **CI/CD**: GitHub Actions for automated workflows

## 🚦 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Development Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd studybolt

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (shadcn/ui)
│   ├── layout/         # Layout components (Header, Footer)
│   └── sections/       # Page sections (Hero, Features)
├── pages/              # Page components
│   ├── auth/          # Authentication pages
│   └── dashboard/     # Dashboard pages
├── lib/               # Utility functions and configurations
├── hooks/             # Custom React hooks
└── assets/            # Static assets (images, icons)
```

## 🎨 Design System

StudyBolt uses a comprehensive design system built on Tailwind CSS:

- **Colors**: Academic blue primary with green accents
- **Typography**: Inter font family optimized for readability
- **Spacing**: Consistent spacing scale using CSS custom properties
- **Components**: Semantic design tokens for maintainable styling
- **Animations**: Smooth transitions using cubic-bezier curves

### Design Principles
1. **Clarity**: Clean, uncluttered interfaces that focus on content
2. **Consistency**: Uniform patterns across all components
3. **Accessibility**: WCAG 2.1 AA compliant with proper contrast ratios
4. **Performance**: Optimized for fast loading and smooth interactions

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for local development:

```env
# Development
VITE_API_URL=http://localhost:8000
VITE_APP_ENV=development

# Production (set in deployment environment)
VITE_API_URL=https://api.studybolt.com
VITE_APP_ENV=production
```

### Customization

The design system can be customized in:
- `src/index.css` - CSS custom properties and design tokens
- `tailwind.config.ts` - Tailwind configuration and theme extension

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run e2e tests (when implemented)
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

## 📦 Deployment

### Production Build

```bash
# Create optimized production build
npm run build

# Preview the production build locally
npm run preview
```

### Docker Deployment

```bash
# Build Docker image
docker build -t studybolt-frontend .

# Run container
docker run -p 80:80 studybolt-frontend
```

### Cloud Deployment

StudyBolt is designed for easy deployment on:
- **Vercel**: Zero-config deployment for React applications
- **Netlify**: Continuous deployment with form handling
- **AWS S3 + CloudFront**: Scalable static hosting
- **Google Cloud Storage**: Global content delivery

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.studybolt.com](https://docs.studybolt.com)
- **Issues**: [GitHub Issues](https://github.com/studybolt/studybolt/issues)
- **Discussions**: [GitHub Discussions](https://github.com/studybolt/studybolt/discussions)
- **Email**: support@studybolt.com

## 🗺️ Roadmap

### Phase 1 - Foundation ✅
- [x] Modern React application with TypeScript
- [x] Beautiful, responsive design system
- [x] Authentication UI (Sign In/Sign Up)
- [x] Dashboard with notebook management
- [x] Component library with shadcn/ui

### Phase 2 - Backend Integration (In Progress)
- [ ] FastAPI backend with authentication
- [ ] PostgreSQL database with migrations
- [ ] Redis for caching and sessions
- [ ] Docker Compose for local development

### Phase 3 - AI Integration
- [ ] Mistral API integration
- [ ] Vector database (Milvus) setup
- [ ] Semantic search implementation
- [ ] Real-time chat interface with streaming

### Phase 4 - Production Features
- [ ] Kubernetes deployment manifests
- [ ] Terraform infrastructure modules
- [ ] Comprehensive monitoring and logging
- [ ] Load testing and performance optimization

---

Built with ❤️ by the StudyBolt team
