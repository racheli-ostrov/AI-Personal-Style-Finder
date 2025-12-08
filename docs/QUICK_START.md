# Quick Start Guide - AI Personal Style Finder

## Prerequisites Checklist
- [ ] Node.js 18 or higher installed
- [ ] Docker Desktop installed and running
- [ ] Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))
- [ ] Git installed

---

## 🚀 Quick Start (5 minutes)

### Step 1: Get the Code
```powershell
cd C:\Users\The user\Desktop\final_project
```

### Step 2: Configure Environment Variables

**Backend:**
```powershell
cd backend
Copy-Item .env.example .env
# Edit .env and add your GEMINI_API_KEY
notepad .env
```

**Frontend:**
```powershell
cd ..\frontend
Copy-Item .env.example .env
# Default settings should work, but verify API URL
notepad .env
```

**Docker Compose:**
```powershell
cd ..
Copy-Item .env.example .env
# Add your GEMINI_API_KEY
notepad .env
```

### Step 3: Run with Docker (Easiest!)

```powershell
# From project root
docker-compose up --build
```

Wait for:
```
✓ Backend container healthy
✓ Frontend container healthy
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/api/health

---

## 🛠️ Development Setup (Without Docker)

### Backend

```powershell
# Terminal 1
cd C:\Users\The user\Desktop\final_project\backend

# Install dependencies
npm install

# Run in development mode
npm run dev
```

Should see:
```
🚀 Server is running on port 5000
📊 Environment: development
```

### Frontend

```powershell
# Terminal 2
cd C:\Users\The user\Desktop\final_project\frontend

# Install dependencies
npm install

# Start development server
npm start
```

Should open browser automatically at http://localhost:3000

---

## 🧪 Running Tests

### Backend Tests
```powershell
cd backend

# Run tests once with coverage
npm test

# Run tests in watch mode
npm run test:watch
```

**Expected output:**
```
PASS  tests/server.test.js
PASS  tests/wardrobe.test.js

Test Suites: 2 passed, 2 total
Tests:       8 passed, 8 total
Coverage:    70% lines
```

### Frontend Tests
```powershell
cd frontend

# Run tests once with coverage
npm test

# Run tests in watch mode
npm run test:watch
```

**Expected output:**
```
PASS  src/App.test.js
PASS  src/components/WardrobeGallery.test.js

Test Suites: 2 passed, 2 total
Tests:       5 passed, 5 total
Coverage:    65% lines
```

---

## 📝 Usage Guide

### 1. Upload Your First Item

1. Click or drag an image of clothing onto the upload area
2. Supported formats: JPG, PNG, WEBP
3. Max size: 10MB
4. Wait for AI analysis (5-10 seconds)

### 2. View Analysis Results

The AI will identify:
- Item type (shirt, pants, dress, etc.)
- Colors (primary and secondary)
- Style category (casual, formal, sporty, etc.)
- Fabric type (estimated)
- Formality level
- Suitable seasons
- Distinctive features

### 3. Build Your Wardrobe

- Items are automatically saved to your wardrobe
- Click the heart icon to mark favorites
- Click "Remove" to delete items
- View all items in the gallery

### 4. Generate Style Profile

Once you have 3+ items:
1. Click "Generate My Style Profile"
2. AI analyzes your entire wardrobe
3. View your:
   - Dominant style
   - Color palette preferences
   - Style persona description
   - Wardrobe strengths and gaps
   - Shopping recommendations

---

## 🐛 Troubleshooting

### Docker Issues

**Problem: "docker: command not found"**
```powershell
# Check if Docker is installed
docker --version

# If not installed, download from:
# https://www.docker.com/products/docker-desktop
```

**Problem: "Cannot connect to Docker daemon"**
- Start Docker Desktop
- Wait for it to fully start
- Try again

**Problem: Port already in use**
```powershell
# Check what's using the ports
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Kill the process or change ports in docker-compose.yml
```

### Backend Issues

**Problem: "GEMINI_API_KEY is not configured"**
- Make sure you created `.env` file in backend folder
- Add: `GEMINI_API_KEY=your-gemini-api-key`
- Restart the server

**Problem: "npm ci failed"**
```powershell
# Delete node_modules and try again
Remove-Item -Recurse -Force node_modules
npm install
```

**Problem: Tests failing**
```powershell
# Make sure you're not running the server
# Tests start their own server instance
npm test
```

### Frontend Issues

**Problem: "Failed to fetch"**
- Check backend is running on port 5000
- Check REACT_APP_API_URL in frontend/.env
- Check CORS settings in backend

**Problem: Image upload fails**
- Check file size (max 10MB)
- Check file format (JPG, PNG, WEBP only)
- Check backend logs for errors

**Problem: Gemini API errors**
- Check API key is valid
- Check API quota hasn't been exceeded
- Try with a smaller image

### Common Errors

**Error: "Rate limit exceeded"**
- Gemini API has rate limits
- Wait a few minutes and try again
- Consider upgrading API plan

**Error: "Network request failed"**
- Check internet connection
- Check firewall settings
- Check backend is running

---

## 🔧 Configuration

### Backend Environment Variables

```env
# Required
GEMINI_API_KEY=your-gemini-api-key

# Optional (with defaults)
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend Environment Variables

```env
# Optional (with defaults)
REACT_APP_API_URL=http://localhost:5000/api
```

### Docker Compose Environment

```env
# Required
GEMINI_API_KEY=your-gemini-api-key
```

---

## 📊 API Endpoints

### Health Check
```
GET http://localhost:5000/api/health
```

### Analyze Image
```
POST http://localhost:5000/api/style/analyze
Content-Type: multipart/form-data
Body: image file
```

### Generate Style Profile
```
POST http://localhost:5000/api/style/profile
Content-Type: application/json
Body: { "wardrobeItems": [...] }
```

### Get Wardrobe
```
GET http://localhost:5000/api/wardrobe
```

### Add to Wardrobe
```
POST http://localhost:5000/api/wardrobe
Content-Type: application/json
Body: { "analysis": {...}, "imageData": "..." }
```

### Delete from Wardrobe
```
DELETE http://localhost:5000/api/wardrobe/:id
```

### Toggle Favorite
```
PATCH http://localhost:5000/api/wardrobe/:id/favorite
```

---

## 🎨 Demo Preparation Tips

### Before Your Presentation:

1. **Test Everything**
   ```powershell
   # Start fresh
   docker-compose down
   docker-compose up --build
   
   # Test upload
   # Test wardrobe
   # Test profile generation
   ```

2. **Prepare Sample Images**
   - Have 5-10 good quality clothing photos ready
   - Variety: shirts, pants, dresses, shoes
   - Different styles: casual, formal, sporty
   - Clear images, good lighting

3. **Pre-load Wardrobe** (optional)
   - Upload 3-4 items before presentation
   - Have profile already generated
   - Shows full functionality faster

4. **Check API Quota**
   - Visit Google Cloud Console
   - Check remaining Gemini API calls
   - Each image = 1 API call
   - Each profile = 1 API call

5. **Backup Plan**
   - Take screenshots of successful results
   - Have error scenarios prepared
   - Know how to explain if API is slow

### During Demo:

1. **Show the WOW Factor**
   - Upload a stylish item
   - Show instant AI analysis
   - Highlight accuracy of detection
   - Show personalization

2. **Explain As You Go**
   - "This is calling Gemini API"
   - "AI is analyzing colors and patterns"
   - "Results are saved to virtual wardrobe"

3. **Handle Errors Gracefully**
   - If API is slow: "This shows real-time processing"
   - If error occurs: "This is why we have error handling"
   - Have backup screenshots ready

---

## 📦 Stopping the Application

### Docker
```powershell
# Stop and remove containers
docker-compose down

# Stop, remove containers, and delete volumes
docker-compose down -v

# Stop, remove everything including images
docker-compose down --rmi all -v
```

### Development Mode
- Press `Ctrl+C` in both terminal windows
- Servers will stop gracefully

---

## 🔄 Updating the Application

```powershell
# Pull latest changes
git pull

# Backend - update dependencies
cd backend
npm install

# Frontend - update dependencies
cd ..\frontend
npm install

# Rebuild Docker images
cd ..
docker-compose build

# Start updated version
docker-compose up
```

---

## 📈 Performance Tips

### For Faster Uploads:
- Use smaller images (< 2MB)
- Compress images before upload
- Use JPEG instead of PNG when possible

### For Faster AI Processing:
- Gemini 1.5 Flash is already the fastest model
- Consider caching results (future feature)
- Batch process multiple items (future feature)

### For Better Results:
- Use clear, well-lit photos
- Focus on single item per photo
- Avoid cluttered backgrounds
- Show full item when possible

---

## 🆘 Getting Help

If you encounter issues:

1. **Check Logs**
   ```powershell
   # Docker logs
   docker-compose logs backend
   docker-compose logs frontend
   
   # Development logs
   # Check terminal output
   ```

2. **Check Documentation**
   - README.md - Full project overview
   - ARCHITECTURE.md - System design
   - PRESENTATION_SCRIPT.md - Demo guide

3. **Common Solutions**
   - Restart Docker containers
   - Clear browser cache
   - Delete node_modules and reinstall
   - Check .env files are configured

---

## ✅ Pre-Presentation Checklist

- [ ] Docker Desktop is running
- [ ] All containers are healthy
- [ ] Frontend loads at http://localhost:3000
- [ ] Backend health check works
- [ ] Gemini API key is valid
- [ ] Sample images are ready
- [ ] Upload and analysis work
- [ ] Wardrobe displays correctly
- [ ] Profile generation works
- [ ] Internet connection is stable
- [ ] Backup screenshots prepared
- [ ] Presentation script reviewed

---

**You're ready to present! Good luck! 🚀**
