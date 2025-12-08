# AI Personal Style Finder - Python Edition 🐍

> **Full-Stack AI Web Application** | Academic Final Project  
> **Tech Stack**: Python + Flask + React + Gemini AI + Docker

---

## 🎯 Project Overview

An intelligent fashion assistant that analyzes your clothing photos using **Google's Gemini AI**, builds your digital wardrobe, and provides personalized style recommendations.

**Key Features:**
- 📸 AI-powered clothing analysis (type, color, style, fabric)
- 👕 Digital wardrobe management
- 🎨 Personalized style profile generation
- 💡 Smart outfit recommendations
- ⭐ Favorite items tracking

---

## 🏗️ Architecture

### Backend: Python + Flask
- **MVC Pattern**: Routes → Controllers → Services
- **AI Integration**: Google Gemini 1.5 Flash
- **Testing**: pytest with 40%+ coverage
- **API**: RESTful JSON endpoints

### Frontend: React 18
- Modern component-based UI
- Drag & drop image upload
- Real-time AI analysis
- Responsive design

### DevOps
- **Docker**: Multi-stage builds
- **CI/CD**: GitHub Actions (Python + React tests)
- **Deployment**: Ready for cloud platforms

---

## 🚀 Quick Start

### Prerequisites
```bash
Python 3.11+
Node.js 18+
Docker (optional)
Gemini API key
```

### 1. Backend Setup (Python)
```bash
cd backend-python
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Linux/Mac

pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Add your GEMINI_API_KEY

python app.py
```
**Backend runs on**: `http://localhost:5000`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm start
```
**Frontend runs on**: `http://localhost:3000`

### 3. Docker (Full Stack)
```bash
# From project root
docker-compose up --build
```

---

## 📂 Project Structure

```
final_project/
├── backend-python/          # Flask Backend (NEW!)
│   ├── app.py              # Main Flask app
│   ├── routes/            # URL routing (Blueprints)
│   │   ├── style_analysis.py
│   │   └── wardrobe.py
│   ├── controllers/       # Request handlers
│   │   ├── style_analysis_controller.py
│   │   └── wardrobe_controller.py
│   ├── services/         # Business logic
│   │   ├── gemini_service.py         # Gemini AI
│   │   ├── wardrobe_service.py       # Data management
│   │   └── style_analysis_service.py # Style logic
│   ├── tests/           # pytest tests
│   ├── requirements.txt # Python dependencies
│   ├── Dockerfile      # Python container
│   └── pytest.ini     # Test config
│
├── frontend/                # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ImageUpload.js      # Drag & drop
│   │   │   ├── WardrobeGallery.js  # Item display
│   │   │   └── StyleProfile.js     # AI profile
│   │   ├── services/
│   │   │   └── api.js             # Axios API client
│   │   └── App.js
│   ├── package.json
│   └── Dockerfile
│
├── docs/
│   ├── BACKEND_ARCHITECTURE_PYTHON.md  # MVC explanation
│   ├── QUICK_START_PYTHON.md          # Setup guide
│   └── PRESENTATION_SCRIPT.md         # 15-min presentation
│
├── .github/workflows/
│   └── ci-cd.yml          # Python + React CI/CD
│
├── docker-compose.yml     # Full stack orchestration
└── README.md             # This file
```

---

## 🔌 API Endpoints

### Style Analysis
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/style/analyze` | Analyze clothing image |
| `POST` | `/api/style/profile` | Generate style profile |
| `GET` | `/api/style/recommendations/:id` | Get outfit suggestions |

### Wardrobe Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/wardrobe` | Get all items |
| `POST` | `/api/wardrobe` | Add new item |
| `DELETE` | `/api/wardrobe/:id` | Delete item |
| `PATCH` | `/api/wardrobe/:id/favorite` | Toggle favorite |
| `GET` | `/api/wardrobe/statistics` | Get stats |

---

## 🧪 Testing

### Backend (Python)
```bash
cd backend-python
pytest                    # Run all tests
pytest --cov=.           # With coverage
pytest -v                # Verbose output
```

**Test Coverage**: 40%+ (statements, branches, functions)

### Frontend
```bash
cd frontend
npm test
```

---

## 🐋 Docker Deployment

### Build Images
```bash
docker-compose build
```

### Run Full Stack
```bash
docker-compose up
```

### Access
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

---

## 🎨 Technology Stack

### Backend
- **Language**: Python 3.11
- **Framework**: Flask 3.0
- **AI**: Google Gemini 1.5 Flash
- **Testing**: pytest + pytest-cov
- **Server**: Gunicorn (production)

### Frontend
- **Framework**: React 18
- **HTTP Client**: Axios
- **File Upload**: React Dropzone
- **Styling**: CSS3

### DevOps
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Testing**: Automated test pipeline
- **Deployment**: Cloud-ready (Azure, AWS, GCP)

---

## 📖 Documentation

- **[Backend Architecture (Python)](docs/BACKEND_ARCHITECTURE_PYTHON.md)**: MVC pattern explained
- **[Quick Start Guide](docs/QUICK_START_PYTHON.md)**: Detailed setup
- **[Presentation Script](docs/PRESENTATION_SCRIPT.md)**: 15-minute demo
- **[Original Node.js Backend](backend/)**: Reference implementation

---

## 🔧 Configuration

### Backend `.env`
```bash
GEMINI_API_KEY=your-gemini-api-key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Get Gemini API Key
1. Visit: https://makersuite.google.com/app/apikey
2. Create new API key
3. Add to `.env` file

---

## 🎓 Academic Project Requirements

✅ **Full-Stack Application**: Python backend + React frontend  
✅ **AI Integration**: Gemini API for image analysis  
✅ **Professional Architecture**: MVC pattern with clear separation  
✅ **Testing**: pytest with meaningful coverage  
✅ **DevOps**: Docker + CI/CD pipeline  
✅ **Documentation**: Comprehensive guides  
✅ **Presentation Ready**: 15-minute demo script included  

---

## 🚀 Deployment Options

### Local Development
```bash
python app.py (backend)
npm start (frontend)
```

### Docker
```bash
docker-compose up --build
```

### Cloud Platforms
- **Azure App Service**: Python + React
- **AWS Elastic Beanstalk**: Docker
- **Google Cloud Run**: Container deployment
- **Heroku**: Python buildpack

---

## 🐛 Troubleshooting

### Python Issues
```bash
# Virtual environment not activated
venv\Scripts\activate

# Dependencies not installed
pip install -r requirements.txt

# Module not found
pip install --upgrade pip
```

### API Key Issues
```bash
# Verify key in .env
cat .env | grep GEMINI_API_KEY

# Test with curl
curl -X GET http://localhost:5000/api/health
```

### Port Conflicts
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <pid> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

---

## 👥 Team & Presentation

**Project Type**: Pairs Final Project  
**Presentation**: 15 minutes in English  
**Demo Flow**:
1. Architecture overview (MVC + AI)
2. Live demo: Upload → Analyze → Wardrobe → Profile
3. Code walkthrough: Python services + Gemini integration
4. Testing & DevOps pipeline
5. Q&A

---

## 📝 License

Academic project for educational purposes.

---

## 🌟 Highlights

- **Production-Ready**: Professional MVC architecture
- **AI-Powered**: Real Gemini API integration
- **Well-Tested**: 40%+ code coverage
- **Fully Documented**: Architecture + setup guides
- **DevOps Pipeline**: Automated testing + deployment
- **Portfolio-Worthy**: Impressive for job interviews

---

## 📞 Support

For issues or questions:
1. Check documentation in `docs/`
2. Review test files for usage examples
3. Check GitHub Actions for CI/CD logs

---

**Built with ❤️ using Python, Flask, React, and Google Gemini AI**
