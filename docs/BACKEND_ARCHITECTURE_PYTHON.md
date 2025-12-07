# Backend Architecture - Python/Flask

## 🏗️ MVC Pattern Implementation

This backend uses the **MVC (Model-View-Controller)** pattern with Python and Flask:

```
backend-python/
├── app.py                 # Main Flask application
├── routes/               # URL routing (Blueprint)
│   ├── style_analysis.py
│   └── wardrobe.py
├── controllers/          # Request handlers
│   ├── style_analysis_controller.py
│   └── wardrobe_controller.py
├── services/            # Business logic
│   ├── gemini_service.py
│   ├── wardrobe_service.py
│   └── style_analysis_service.py
└── tests/              # Unit tests (pytest)
```

## 📊 Architecture Flow

```
HTTP Request
    ↓
Flask Blueprint (routes/)
    ↓
Controller (controllers/)
    ↓
Service (services/)
    ↓
Gemini AI / Data Storage
    ↓
Response
```

## 🔍 Layer Responsibilities

### **Routes (Flask Blueprints)**
- **What**: Map URLs to controller functions
- **Example**: `@wardrobe_bp.route('/', methods=['GET'])`
- **Purpose**: Define which URL calls which controller method

### **Controllers**
- **What**: Handle HTTP requests and responses
- **Responsibilities**:
  - Validate request data
  - Call appropriate service methods
  - Format responses as JSON
  - Handle errors and return proper status codes

### **Services**
- **What**: Business logic and data operations
- **Responsibilities**:
  - Implement core features
  - Interact with Gemini AI
  - Manage wardrobe data
  - Validate business rules

## 📝 Example Request Flow

### Analyzing an Image

```python
# 1. Route (routes/style_analysis.py)
@style_analysis_bp.route('/analyze', methods=['POST'])
async def analyze_image():
    return await style_analysis_controller.analyze_image()

# 2. Controller (controllers/style_analysis_controller.py)
async def analyze_image(self):
    file = request.files['image']
    result = await style_analysis_service.analyze_image(...)
    return jsonify({'success': True, 'data': result})

# 3. Service (services/style_analysis_service.py)
async def analyze_image(self, image_data, mime_type, image_info):
    analysis = await gemini_service.analyze_clothing_image(...)
    return {'analysis': analysis, 'imageInfo': image_info}

# 4. Gemini Service (services/gemini_service.py)
async def analyze_clothing_image(self, image_data, mime_type):
    response = self.model.generate_content([prompt, image])
    return json.loads(response.text)
```

## 🎯 Key Differences from Node.js Version

| Aspect | Node.js | Python |
|--------|---------|--------|
| **Framework** | Express.js | Flask |
| **Routing** | Router objects | Blueprints |
| **Async** | async/await (native) | async/await (asyncio) |
| **AI SDK** | @google/generative-ai | google-generativeai |
| **Testing** | Jest | pytest |
| **Package Manager** | npm | pip |
| **Config** | package.json | requirements.txt |

## 🧪 Testing Strategy

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=. --cov-report=html

# Run specific test file
pytest tests/test_wardrobe_service.py
```

### Test Structure
- `tests/test_app.py` - Flask application tests
- `tests/test_wardrobe_service.py` - Wardrobe service unit tests
- `conftest.py` - pytest configuration and fixtures

## 🚀 Running the Backend

### Development
```bash
# Install dependencies
pip install -r requirements.txt

# Run development server
python app.py
```

### Production (with Gunicorn)
```bash
gunicorn --bind 0.0.0.0:5000 --workers 4 app:create_app()
```

### Docker
```bash
docker build -t style-finder-backend .
docker run -p 5000:5000 --env-file .env style-finder-backend
```

## 🔧 Configuration

Create `.env` file:
```bash
GEMINI_API_KEY=your_api_key_here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 📚 Dependencies

- **Flask** - Web framework
- **flask-cors** - CORS support
- **google-generativeai** - Gemini AI SDK
- **python-dotenv** - Environment variables
- **gunicorn** - Production WSGI server
- **pytest** - Testing framework

## ✅ Benefits of This Architecture

1. **Separation of Concerns**: Each layer has a clear responsibility
2. **Testability**: Easy to test each layer independently
3. **Maintainability**: Changes are isolated to specific layers
4. **Scalability**: Can easily add new routes, controllers, and services
5. **Pythonic**: Follows Python and Flask best practices
