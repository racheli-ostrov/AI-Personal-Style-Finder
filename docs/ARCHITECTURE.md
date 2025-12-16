# Architecture Diagram

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                          User Browser                                │
│                     http://localhost:3000                            │
└────────────────┬────────────────────────────────────────────────────┘
                 │
                 │ HTTPS/HTTP
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       Frontend (React)                               │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Components:                                                  │  │
│  │  • App.js (Main container)                                   │  │
│  │  • ImageUpload (Drag & drop with preview)                    │  │
│  │  • WardrobeGallery (Grid with favorites)                     │  │
│  │  • StyleProfile (AI insights display)                        │  │
│  │                                                               │  │
│  │  Services:                                                    │  │
│  │  • api.js (Axios HTTP client)                                │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                    Port 3000 (Docker: 80)                            │
└────────────────┬────────────────────────────────────────────────────┘
                 │
                 │ REST API
                 │ JSON over HTTP
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     Backend (Node.js + Express)                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Routes:                                                      │  │
│  │  • GET  /api/health                                          │  │
│  │  • POST /api/style/analyze (image upload)                    │  │
│  │  • POST /api/style/profile                                   │  │
│  │  • POST /api/style/recommendations                           │  │
│  │  • GET  /api/wardrobe                                        │  │
│  │  • POST /api/wardrobe                                        │  │
│  │  • DELETE /api/wardrobe/:id                                  │  │
│  │  • PATCH /api/wardrobe/:id/favorite                          │  │
│  │                                                               │  │
│  │  Middleware:                                                  │  │
│  │  • CORS, Body Parser, Error Handler                          │  │
│  │  • Multer (File upload - 10MB limit)                         │  │
│  │                                                               │  │
│  │  Services:                                                    │  │
│  │  • geminiService.js (AI integration)                         │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                          Port 5001                                   │
└────────────────┬────────────────────────────────────────────────────┘
                 │
                 │ API Calls
                 │ JSON with base64 images
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Google Gemini AI API                              │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Model: gemini-1.5-flash                                     │  │
│  │                                                               │  │
│  │  Capabilities:                                                │  │
│  │  • Image understanding                                        │  │
│  │  • Clothing item classification                              │  │
│  │  • Color and pattern detection                               │  │
│  │  • Style analysis                                             │  │
│  │  • Recommendation generation                                 │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                    External Cloud Service                            │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

### 1. Image Upload & Analysis Flow

```
User                Frontend              Backend             Gemini AI
 │                     │                     │                     │
 │   Upload Image      │                     │                     │
 ├────────────────────>│                     │                     │
 │                     │                     │                     │
 │                     │  POST /api/style/   │                     │
 │                     │      analyze        │                     │
 │                     ├────────────────────>│                     │
 │                     │   (FormData)        │                     │
 │                     │                     │                     │
 │                     │                     │  Analyze Image      │
 │                     │                     │  (base64 + prompt)  │
 │                     │                     ├────────────────────>│
 │                     │                     │                     │
 │                     │                     │                     │
 │                     │                     │  JSON Response      │
 │                     │                     │  {itemType, colors, │
 │                     │                     │   style, fabric...} │
 │                     │                     │<────────────────────┤
 │                     │                     │                     │
 │                     │  Analysis Result    │                     │
 │                     │<────────────────────┤                     │
 │                     │                     │                     │
 │   Display Results   │                     │                     │
 │<────────────────────┤                     │                     │
 │                     │                     │                     │
 │                     │  POST /api/wardrobe │                     │
 │                     │  (save to wardrobe) │                     │
 │                     ├────────────────────>│                     │
 │                     │                     │                     │
 │                     │  Success            │                     │
 │<────────────────────┤<────────────────────┤                     │
 │                     │                     │                     │
```

### 2. Style Profile Generation Flow

```
User                Frontend              Backend             Gemini AI
 │                     │                     │                     │
 │  Generate Profile   │                     │                     │
 ├────────────────────>│                     │                     │
 │                     │                     │                     │
 │                     │  GET /api/wardrobe  │                     │
 │                     ├────────────────────>│                     │
 │                     │                     │                     │
 │                     │  Wardrobe Items []  │                     │
 │                     │<────────────────────┤                     │
 │                     │                     │                     │
 │                     │  POST /api/style/   │                     │
 │                     │      profile        │                     │
 │                     ├────────────────────>│                     │
 │                     │  {wardrobeItems}    │                     │
 │                     │                     │                     │
 │                     │                     │  Analyze Wardrobe   │
 │                     │                     │  + Generate Profile │
 │                     │                     ├────────────────────>│
 │                     │                     │                     │
 │                     │                     │  Style Profile      │
 │                     │                     │  {dominantStyle,    │
 │                     │                     │   colorPalette,     │
 │                     │                     │   recommendations}  │
 │                     │                     │<────────────────────┤
 │                     │                     │                     │
 │                     │  Profile Data       │                     │
 │                     │<────────────────────┤                     │
 │                     │                     │                     │
 │   Display Profile   │                     │                     │
 │<────────────────────┤                     │                     │
 │                     │                     │                     │
```

---

## Component Architecture

### Frontend Component Tree

```
App
├── Header
│   ├── Title
│   └── Subtitle
│
├── Notification (conditional)
│
├── Main Container
│   ├── Upload Section
│   │   ├── Section Title
│   │   ├── Section Description
│   │   └── ImageUpload Component
│   │       ├── Dropzone
│   │       ├── Preview
│   │       └── Error Display
│   │
│   ├── Wardrobe Section
│   │   └── WardrobeGallery Component
│   │       ├── Gallery Header
│   │       └── Gallery Grid
│   │           └── Wardrobe Items []
│   │               ├── Image
│   │               ├── Favorite Button
│   │               ├── Details (type, colors, tags)
│   │               └── Delete Button
│   │
│   └── Profile Section (conditional)
│       └── StyleProfile Component
│           ├── Generate Button
│           ├── Dominant Style
│           ├── Color Palette
│           ├── Formality Level
│           ├── Style Persona
│           ├── Recommendations
│           │   ├── Strengths
│           │   ├── Gaps
│           │   └── Suggestions
│           └── Shopping Keywords
│
└── Footer
```

### Backend Architecture

```
server.js (Entry Point)
    │
    ├── Express Configuration
    │   ├── CORS Middleware
    │   ├── Body Parser
    │   ├── URL Encoded
    │   └── Error Handler
    │
    ├── Routes
    │   ├── /api/health → healthCheck()
    │   ├── /api/style/* → styleAnalysisRoutes
    │   │   ├── POST /analyze → geminiService.analyzeClothingImage()
    │   │   ├── POST /profile → geminiService.generateStyleProfile()
    │   │   └── POST /recommendations → geminiService.findSimilarItems()
    │   │
    │   └── /api/wardrobe/* → wardrobeRoutes
    │       ├── GET / → getAllItems()
    │       ├── POST / → addItem()
    │       ├── DELETE /:id → deleteItem()
    │       ├── PATCH /:id/favorite → toggleFavorite()
    │       └── DELETE / → clearAll()
    │
    └── Services
        └── geminiService.js
            ├── GoogleGenerativeAI Client
            ├── analyzeClothingImage(buffer, mimeType)
            ├── generateStyleProfile(items[])
            └── findSimilarItems(analysis)
```

---

## Docker Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     Docker Compose                            │
│                                                               │
│  ┌──────────────────────────┐  ┌──────────────────────────┐ │
│  │  Frontend Container      │  │  Backend Container       │ │
│  │                          │  │                          │ │
│  │  nginx:alpine            │  │  node:18-alpine          │ │
│  │  + React Build           │  │  + Express Server        │ │
│  │                          │  │  + Gemini Client         │ │
│  │  Port: 3000 → 80         │  │  Port: 5001              │ │
│  │  Size: ~25MB             │  │  Size: ~50MB             │ │
│  │                          │  │                          │ │
│  │  Health Check:           │  │  Health Check:           │ │
│  │  GET http://localhost/   │  │  GET /api/health         │ │
│  └──────────────────────────┘  └──────────────────────────┘ │
│              │                            │                  │
│              └──────────┬─────────────────┘                  │
│                         │                                    │
│                 Network: style-finder-network                │
│                                                               │
│  Volumes:                                                     │
│  • uploads/ (persistent storage)                             │
│                                                               │
│  Environment:                                                 │
│  • GEMINI_API_KEY                                            │
│  • NODE_ENV=production                                       │
└──────────────────────────────────────────────────────────────┘
```

---

## CI/CD Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     GitHub Repository                            │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                    Push / Pull Request
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                     GitHub Actions                               │
│                                                                  │
│  ┌──────────────────┐         ┌──────────────────┐             │
│  │  Backend Job     │         │  Frontend Job    │             │
│  │                  │         │                  │             │
│  │  • Setup Node    │         │  • Setup Node    │             │
│  │  • npm ci        │         │  • npm ci        │             │
│  │  • npm test      │         │  • npm test      │             │
│  │  • Build Docker  │         │  • npm build     │             │
│  │  • Upload Image  │         │  • Build Docker  │             │
│  └────────┬─────────┘         └────────┬─────────┘             │
│           │                            │                        │
│           └──────────┬─────────────────┘                        │
│                      │                                          │
│                      ▼                                          │
│           ┌──────────────────────┐                             │
│           │  Integration Job     │                             │
│           │                      │                             │
│           │  • Download Images   │                             │
│           │  • Docker Compose Up │                             │
│           │  • Health Checks     │                             │
│           │  • API Tests         │                             │
│           └──────────┬───────────┘                             │
│                      │                                          │
│                      ▼                                          │
│           ┌──────────────────────┐                             │
│           │  Deploy Job          │                             │
│           │  (main branch only)  │                             │
│           │                      │                             │
│           │  • Load Images       │                             │
│           │  • Push to Registry  │                             │
│           │  • Deploy to Cloud   │                             │
│           └──────────────────────┘                             │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │  Production     │
                   │  Environment    │
                   └─────────────────┘
```

---

## Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Security Layers                              │
│                                                                  │
│  Frontend Security:                                              │
│  • Input validation (file type, size)                           │
│  • XSS protection (React escaping)                              │
│  • HTTPS in production                                          │
│  • Content Security Policy (nginx)                              │
│                                                                  │
│  Backend Security:                                               │
│  • CORS whitelist                                               │
│  • File upload limits (10MB)                                    │
│  • Input sanitization                                           │
│  • Error message sanitization                                   │
│  • Environment variables for secrets                            │
│                                                                  │
│  Docker Security:                                                │
│  • Non-root user                                                │
│  • Minimal base images (Alpine)                                 │
│  • No unnecessary packages                                      │
│  • Health checks                                                │
│                                                                  │
│  API Security:                                                   │
│  • API key in environment variables                             │
│  • Rate limiting (Gemini API)                                   │
│  • Error handling without leaking data                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Deployment Options

### Option 1: Local Development
```
Docker Compose → localhost:3000 & localhost:5001
```

### Option 2: Cloud Deployment (AWS Example)
```
Frontend → S3 + CloudFront
Backend → ECS Fargate Container
Database → RDS PostgreSQL (future)
Images → S3 Bucket
```

### Option 3: Kubernetes (Future)
```
Frontend → Deployment + Service + Ingress
Backend → Deployment + Service
Database → StatefulSet + PV
```

---

## Technology Stack Summary

| Layer              | Technology                    | Purpose                          |
|--------------------|-------------------------------|----------------------------------|
| Frontend           | React 18                      | UI framework                     |
|                    | Axios                         | HTTP client                      |
|                    | React Dropzone                | File upload                      |
| Backend            | Node.js 18                    | Runtime                          |
|                    | Express                       | Web framework                    |
|                    | Multer                        | File handling                    |
| AI                 | Google Gemini 1.5             | Image analysis & style profiling |
| Storage            | In-memory (future: PostgreSQL)| Data persistence                 |
| Testing            | Jest + Supertest              | Unit & integration tests         |
|                    | React Testing Library         | Component tests                  |
| Containerization   | Docker                        | Application packaging            |
|                    | Docker Compose                | Multi-container orchestration    |
| CI/CD              | GitHub Actions                | Automated pipeline               |
| Web Server         | Nginx (production)            | Static file serving              |

---

This architecture diagram provides a comprehensive view of the entire system. Use it in your presentation to explain how all components work together!
