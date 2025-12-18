# בדיקות אוטומטיות וכיסוי

## Backend (Python)
להריץ את כל הבדיקות:
```
pytest backend-python/tests
```
להריץ עם דוח כיסוי:
```
pytest --cov=backend-python backend-python/tests
```

## Frontend (React)
להריץ את כל הבדיקות:
```
npm test
```
להריץ עם דוח כיסוי:
```
npm test -- --coverage
```

דוחות coverage יופיעו בתיקיות coverage/htmlcov (backend) ו־frontend/coverage (frontend).
# AI Personal Style Finder 👗✨

![Architecture](./docs/architecture-diagram.png)

## 🎯 Project Overview

**AI Personal Style Finder** is a production-level web application that uses AI to analyze clothing items from a user's wardrobe and provide personalized style recommendations. Built with React, Node.js, and Google Gemini AI.

### Target Users
- Fashion enthusiasts who want to understand their personal style
### Key Features
- 📸 **Image Upload & Analysis** - Upload clothing photos for AI-powered analysis
---
## 🏗️ System Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│  React Frontend │◄───────►│  Node.js API    │◄───────►│  Gemini AI API  │
│  (Port 3000)    │   REST  │  (Port 5001)    │   AI    │  (Google)       │
│                 │         │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
        │                           │
        │                           │
        ▼                           ▼
┌─────────────────┐         ┌─────────────────┐
│  Docker         │         │  In-Memory      │
│  Container      │         │  Storage        │
└─────────────────┘         └─────────────────┘
```

### Components

#### Frontend (React)
- **Image Upload Component** - Drag & drop interface with react-dropzone
#### Backend (Node.js + Express) - MVC Architecture
**Routes Layer** - URL endpoint definitions
- `/api/style/*` - Style analysis endpoints
**Controller Layer** - Request handling
- `styleAnalysisController.js` - Handles AI analysis requests
**Service Layer** - Business logic
- `geminiService.js` - Gemini AI integration
**Architecture Benefits**:
- Clear separation of concerns
#### AI Integration (Gemini API)
- **Image Analysis** - Identifies clothing type, colors, patterns, fabric
---
## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd final_project
```

2. **Set up environment variables**

Backend:
```bash
cd backend
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

Frontend:
```bash
cd frontend
cp .env.example .env
# Edit .env if needed (default: http://localhost:5001/api)
```

3. **Install dependencies**

Backend:
```bash
cd backend
npm install
```

Frontend:
```bash
cd frontend
npm install
```

---
## 🏃 Running the Application

### Option 1: Docker (Recommended)

```bash
# From project root
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

docker-compose up --build
```

- Frontend: http://localhost:3000
### Option 2: Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

---
## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test              # Run tests once
npm run test:watch    # Watch mode
```

### Frontend Tests
```bash
cd frontend
npm test              # Run tests with coverage
npm run test:watch    # Watch mode
```

### Integration Tests
Docker Compose includes health checks that validate both services are running correctly.

---
## 🐳 Docker Configuration

### Backend Dockerfile
- Base: `node:18-alpine`
### Frontend Dockerfile
- Multi-stage build
### Docker Compose
- Orchestrates frontend + backend
---
## 🔄 CI/CD Pipeline

GitHub Actions workflow includes:

1. **Backend Job**
   - Install dependencies
   - Run tests with coverage
   - Build Docker image
   - Upload artifacts

2. **Frontend Job**
   - Install dependencies
   - Run tests with coverage
   - Build React app
   - Build Docker image
   - Upload artifacts

3. **Integration Job**
   - Load Docker images
   - Start with docker-compose
   - Health check validation
   - API endpoint testing

4. **Deploy Job** (on main branch)
   - Load production images
   - Deploy to cloud (customizable)

### Setting up CI/CD

1. Push code to GitHub
2. Add `GEMINI_API_KEY` to GitHub Secrets
3. Pipeline runs automatically on push/PR

---
## 📊 API Documentation

### Health Check
```
GET /api/health
Response: { status: "healthy", message: "...", timestamp: "..." }
```

### Analyze Image
```
POST /api/style/analyze
Content-Type: multipart/form-data
Body: { image: <file> }
Response: { success: true, data: { analysis: {...}, imageInfo: {...} } }
```

### Generate Style Profile
```
POST /api/style/profile
Body: { wardrobeItems: [...] }
Response: { success: true, data: { dominantStyle, colorPalette, ... } }
```

### Get Wardrobe
```
GET /api/wardrobe
Response: { success: true, data: [...], count: N }
```

### Add to Wardrobe
```
POST /api/wardrobe
Body: { analysis: {...}, imageData: "..." }
Response: { success: true, data: {...} }
```

---
## 🎓 Technology Stack

### Frontend
- **React 18** - UI framework
### Backend
- **Node.js 18** - Runtime
### DevOps
- **Docker** - Containerization
---
## 🎤 Presentation Guide

### Demo Flow (5 minutes)
1. **Introduction** - Problem statement and target users
2. **Live Demo**
   - Upload clothing image
   - Show AI analysis results
   - Display wardrobe gallery
   - Generate style profile
   - Show recommendations

### Technical Explanation (7 minutes)
3. **Architecture Overview** - System components diagram
4. **AI Integration** - Gemini API workflow and prompts
5. **Backend** - Express routes and service architecture
6. **Frontend** - React components and state management
7. **Testing** - Unit tests, integration tests, coverage
8. **Docker** - Containerization strategy
9. **CI/CD** - GitHub Actions pipeline walkthrough

### Reflection (3 minutes)
10. **Challenges** - What was difficult and how you solved it
11. **Failures** - What didn't work initially
12. **Key Learnings** - Most important technical takeaways
13. **Future Improvements** - What would you add next

---
## 🚧 Challenges & Solutions

### Challenge 1: Gemini API Response Parsing
**Problem**: Gemini sometimes returns non-JSON formatted responses
**Solution**: Regex extraction to find JSON within response text

### Challenge 2: Image Size Limits
**Problem**: Large images caused slow uploads and timeouts
**Solution**: 10MB file size limit + client-side validation

### Challenge 3: Docker Networking
**Problem**: Frontend couldn't reach backend in containers
**Solution**: Proper CORS configuration + docker-compose networking

---
## 📈 Future Improvements

- [ ] **Database Integration** - PostgreSQL for persistent storage
---
## 👥 Contributors

**Your Names Here**
- Partner 1: [Role/Responsibilities]
---
## 📄 License

MIT License - See LICENSE file for details

---
## 🙏 Acknowledgments

- Google Gemini AI for powerful image analysis
---
**Built with ❤️ for Final Project 2024**

[שורה ריקה לבדיקה]
---
