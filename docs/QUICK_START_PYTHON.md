# Quick Start Guide - Python Backend

## 🐍 Prerequisites

- Python 3.11 or higher
- pip (Python package manager)
- Google Gemini API key

## 📦 Installation

### 1. Clone and Navigate
```bash
cd final_project/backend-python
```

### 2. Create Virtual Environment (Recommended)
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment
```bash
# Copy example env file
cp .env.example .env

# Edit .env and add your Gemini API key
GEMINI_API_KEY=your-gemini-api-key
```

## 🚀 Running the Application

### Development Mode
```bash
python app.py
```

Server will run on `http://localhost:5001`

### Production Mode
```bash
gunicorn --bind 0.0.0.0:5001 --workers 4 --timeout 120 "app:create_app()"
```

## 🧪 Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=. --cov-report=html

# Run specific test
pytest tests/test_wardrobe_service.py -v
```

## 🐋 Docker

### Build and Run
```bash
docker build -t style-finder-backend .
docker run -p 5001:5001 --env-file .env style-finder-backend
```

### Using Docker Compose (Full Stack)
```bash
# From project root
docker-compose up --build
```

## 📍 API Endpoints

### Health Check
```bash
GET http://localhost:5001/api/health
```

### Style Analysis
```bash
# Analyze image
POST http://localhost:5001/api/style/analyze
Content-Type: multipart/form-data
Body: image=<file>

# Generate profile
POST http://localhost:5001/api/style/profile

# Get recommendations
GET http://localhost:5001/api/style/recommendations/:id
```

### Wardrobe Management
```bash
# Get all items
GET http://localhost:5001/api/wardrobe

# Add item
POST http://localhost:5001/api/wardrobe

# Delete item
DELETE http://localhost:5001/api/wardrobe/:id

# Toggle favorite
PATCH http://localhost:5001/api/wardrobe/:id/favorite

# Get statistics
GET http://localhost:5001/api/wardrobe/statistics

# Clear wardrobe
DELETE http://localhost:5001/api/wardrobe
```

## 🛠️ Troubleshooting

### Issue: Module not found
```bash
# Make sure virtual environment is activated
# Reinstall dependencies
pip install -r requirements.txt
```

### Issue: Gemini API errors
```bash
# Check your API key in .env
# Verify key at: https://makersuite.google.com/app/apikey
```

### Issue: Port already in use
```bash
# Windows
netstat -ano | findstr :5001
taskkill /PID <process_id> /F

# Linux/Mac
lsof -ti:5001 | xargs kill -9
```

## 📊 Project Structure

```
backend-python/
├── app.py                    # Main Flask application
├── requirements.txt          # Python dependencies
├── .env.example             # Environment template
├── Dockerfile               # Docker configuration
├── pytest.ini              # Test configuration
├── routes/                 # URL routing
│   ├── style_analysis.py
│   └── wardrobe.py
├── controllers/           # Request handlers
│   ├── style_analysis_controller.py
│   └── wardrobe_controller.py
├── services/             # Business logic
│   ├── gemini_service.py
│   ├── wardrobe_service.py
│   └── style_analysis_service.py
└── tests/               # Unit tests
    ├── conftest.py
    ├── test_app.py
    └── test_wardrobe_service.py
```

## 🎓 Next Steps

1. **Frontend**: Run the React frontend from `final_project/frontend`
2. **Read Architecture**: Check `docs/BACKEND_ARCHITECTURE_PYTHON.md`
3. **Run Tests**: Ensure all tests pass with `pytest`
4. **Deploy**: Use Docker or cloud platform

## 💡 Tips

- Use virtual environment to avoid dependency conflicts
- Set `NODE_ENV=development` for debug mode
- Check logs for detailed error messages
- Use `pytest -v` for verbose test output
