# Backend Architecture - MVC Pattern

## 📐 Architecture Overview

The backend follows a **layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                    Client Request                       │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                   ROUTES LAYER                          │
│  • Define URL endpoints                                 │
│  • Map URLs to controller methods                       │
│  • Handle middleware (multer, validation)               │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                CONTROLLER LAYER                         │
│  • Receive HTTP requests                                │
│  • Validate input                                       │
│  • Call appropriate service methods                     │
│  • Format HTTP responses                                │
│  • Handle HTTP errors                                   │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                  SERVICE LAYER                          │
│  • Business logic                                       │
│  • Data processing                                      │
│  • External API calls (Gemini)                          │
│  • Data transformations                                 │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                    DATA LAYER                           │
│  • In-memory storage (wardrobe array)                   │
│  • Future: Database integration                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── server.js                    # Express app setup
│   │
│   ├── routes/                      # ROUTES LAYER
│   │   ├── styleAnalysis.js         # Style analysis endpoints
│   │   └── wardrobe.js              # Wardrobe management endpoints
│   │
│   ├── controllers/                 # CONTROLLER LAYER
│   │   ├── styleAnalysisController.js   # Style analysis request handlers
│   │   └── wardrobeController.js        # Wardrobe request handlers
│   │
│   ├── services/                    # SERVICE LAYER
│   │   ├── geminiService.js         # Gemini AI integration
│   │   ├── styleAnalysisService.js  # Style analysis business logic
│   │   └── wardrobeService.js       # Wardrobe business logic
│   │
│   └── models/                      # DATA MODELS (future)
│       └── (Database models will go here)
│
└── tests/                           # TESTS
    ├── server.test.js               # Server integration tests
    ├── wardrobeService.test.js      # Service unit tests
    ├── wardrobeController.test.js   # Controller integration tests
    └── wardrobe.test.js             # Legacy tests
```

---

## 🔄 Request Flow Example

### Example: Analyzing a Clothing Image

```
1. CLIENT REQUEST
   POST /api/style/analyze
   Content-Type: multipart/form-data
   Body: { image: <file> }

2. ROUTES LAYER (styleAnalysis.js)
   • Receives request at POST /analyze
   • Multer middleware processes file upload
   • Routes to: styleAnalysisController.analyzeImage()

3. CONTROLLER LAYER (styleAnalysisController.js)
   • Validates: req.file exists
   • Extracts: imageBuffer, mimeType, imageInfo
   • Calls: styleAnalysisService.analyzeImage(...)
   • Formats response: { success: true, data: {...} }
   • Handles errors: returns 400/500 with error message

4. SERVICE LAYER (styleAnalysisService.js)
   • Business logic: prepare image for AI
   • Calls: geminiService.analyzeClothingImage(...)
   • Enhances result with additional info
   • Returns structured data

5. GEMINI SERVICE (geminiService.js)
   • Converts image to base64
   • Creates AI prompt
   • Calls Gemini API
   • Parses JSON response
   • Returns analysis object

6. RESPONSE TO CLIENT
   {
     "success": true,
     "data": {
       "analysis": { itemType, colors, style, ... },
       "imageInfo": { originalName, size, mimeType }
     }
   }
```

---

## 📋 Layer Responsibilities

### 🔹 Routes Layer
**File Location**: `src/routes/`

**Responsibilities**:
- Define URL endpoints
- Map URLs to controller methods
- Configure middleware (multer, authentication, etc.)
- Define route parameters

**Example**:
```javascript
// routes/styleAnalysis.js
router.post('/analyze', 
  upload.single('image'),  // Middleware
  styleAnalysisController.analyzeImage.bind(styleAnalysisController)
);
```

**Key Principle**: Routes should be thin - just mapping URLs to controllers.

---

### 🔹 Controller Layer
**File Location**: `src/controllers/`

**Responsibilities**:
- Receive and validate HTTP requests
- Extract data from req.body, req.params, req.query
- Call appropriate service methods
- Format responses (success/error)
- Set HTTP status codes
- Handle HTTP-specific errors

**Example**:
```javascript
// controllers/wardrobeController.js
async addItem(req, res) {
  try {
    // 1. Validate input
    const { analysis, imageData } = req.body;
    if (!analysis) {
      return res.status(400).json({
        error: { message: 'Analysis data is required' }
      });
    }

    // 2. Call service
    const newItem = wardrobeService.addItem(analysis, imageData);

    // 3. Format response
    res.status(201).json({
      success: true,
      data: newItem
    });
  } catch (error) {
    // 4. Handle errors
    console.error('Error in addItem:', error);
    res.status(500).json({
      error: { message: 'Failed to add item to wardrobe' }
    });
  }
}
```

**Key Principle**: Controllers should NOT contain business logic - they delegate to services.

---

### 🔹 Service Layer
**File Location**: `src/services/`

**Responsibilities**:
- Implement business logic
- Process and transform data
- Call external APIs
- Perform calculations and validations
- Interact with data layer
- Be reusable and testable

**Example**:
```javascript
// services/wardrobeService.js
addItem(analysis, imageData) {
  // Business logic: create new item with metadata
  const newItem = {
    id: Date.now().toString(),
    analysis,
    imageData,
    addedAt: new Date().toISOString(),
    favorite: false
  };

  // Data operation
  wardrobe.push(newItem);
  
  return newItem;
}
```

**Key Principle**: Services contain the "how" of your application - the actual logic.

---

## 🎯 Benefits of This Architecture

### 1. **Separation of Concerns**
- Each layer has a single responsibility
- Changes in one layer don't affect others
- Easier to understand and maintain

### 2. **Testability**
- Services can be unit tested independently
- Controllers can be integration tested
- Routes define the API contract

### 3. **Reusability**
- Services can be called from multiple controllers
- Same service logic for different endpoints
- Easy to add new features

### 4. **Maintainability**
- Clear structure for new developers
- Easy to locate code
- Consistent patterns throughout

### 5. **Scalability**
- Easy to add new endpoints
- Simple to switch data sources
- Can add caching, authentication, etc.

---

## 📝 Code Organization Rules

### Routes Should:
✅ Define URL patterns  
✅ Configure middleware  
✅ Map to controller methods  
❌ NOT contain business logic  
❌ NOT directly access services  
❌ NOT handle data processing  

### Controllers Should:
✅ Validate HTTP input  
✅ Call service methods  
✅ Format HTTP responses  
✅ Handle HTTP errors  
❌ NOT contain business logic  
❌ NOT directly access data  
❌ NOT call external APIs  

### Services Should:
✅ Implement business logic  
✅ Process data  
✅ Call external APIs  
✅ Be testable independently  
❌ NOT know about HTTP (req/res)  
❌ NOT set status codes  
❌ NOT format responses  

---

## 🧪 Testing Strategy

### Unit Tests (Services)
Test business logic in isolation:
```javascript
// tests/wardrobeService.test.js
test('should add item with correct fields', () => {
  const item = wardrobeService.addItem({ itemType: 'shirt' }, null);
  expect(item).toHaveProperty('id');
  expect(item.favorite).toBe(false);
});
```

### Integration Tests (Controllers)
Test HTTP endpoints:
```javascript
// tests/wardrobeController.test.js
test('POST /api/wardrobe should add item', async () => {
  const response = await request(app)
    .post('/api/wardrobe')
    .send({ analysis: { itemType: 'shirt' } });
  
  expect(response.status).toBe(201);
  expect(response.body.success).toBe(true);
});
```

---

## 🔮 Future Enhancements

### 1. Database Layer
Add models for database interaction:
```
services/
  └── wardrobeService.js  ──calls──>  models/
                                        └── WardrobeModel.js
```

### 2. Middleware Layer
Add reusable middleware:
```
middleware/
  ├── authentication.js
  ├── validation.js
  └── errorHandler.js
```

### 3. DTOs (Data Transfer Objects)
Add input/output validation:
```
dto/
  ├── CreateWardrobeItemDto.js
  └── StyleAnalysisResponseDto.js
```

---

## 📚 Key Takeaways

1. **Routes** = "Which URL goes where?"
2. **Controllers** = "Handle the request, call the service, send response"
3. **Services** = "Do the actual work"

This architecture makes the code:
- ✅ Professional
- ✅ Maintainable
- ✅ Testable
- ✅ Scalable
- ✅ Easy to understand

Perfect for presentations and job interviews! 🎯
