# תיעוד: מימוש תמיכה במשתמשים מרובים

## סקירה כללית
המערכת עודכנה לתמוך בארון בגדים נפרד לכל משתמש, עם אימות והפניה אוטומטית להרשמה עבור משתמשים לא מחוברים.

## שינויים שבוצעו

### 1. עדכון Frontend - שכבת API (`frontend/src/services/api.js`)

#### פונקציות עזר חדשות:
```javascript
// קבלת userId מ-localStorage
const getUserId = () => {
  const user = localStorage.getItem('user');
  if (!user) return null;
  try {
    return JSON.parse(user).id;
  } catch {
    return null;
  }
};

// בדיקת אימות והשלכת שגיאה אם אין משתמש מחובר
const requireAuth = () => {
  const userId = getUserId();
  if (!userId) {
    throw new Error('AUTH_REQUIRED');
  }
  return userId;
};
```

#### עדכון קריאות API:
כל הפונקציות ב-`wardrobeAPI` ו-`styleAPI` עודכנו להוסיף `userId`:

- **wardrobeAPI**:
  - `getAll()` - שולח userId ב-query params
  - `addItem()` - שולח userId בגוף הבקשה
  - `deleteItem()` - שולח userId ב-query params
  - `toggleFavorite()` - שולח userId ב-query params
  - `clearAll()` - שולח userId ב-query params

- **styleAPI**:
  - `analyzeImage()` - שולח userId ב-FormData
  - `generateProfile()` - שולח userId בגוף הבקשה
  - `getRecommendations()` - שולח userId בגוף הבקשה

### 2. עדכון Backend - שכבת Service (`backend-python/services/wardrobe_service.py`)

#### שינוי מבנה הנתונים:
```python
# לפני:
self.wardrobe: List[Dict] = []
self.item_id_counter = 1

# אחרי:
self.wardrobes: Dict[str, Dict] = {}
# מבנה: {userId: {items: [], counter: int}}
```

#### פונקציה חדשה:
```python
def _get_user_wardrobe(self, user_id: str) -> Dict:
    """Get or create wardrobe for specific user"""
    if user_id not in self.wardrobes:
        self.wardrobes[user_id] = {
            'items': [],
            'counter': 1
        }
    return self.wardrobes[user_id]
```

#### עדכון כל המתודות:
כל המתודות עודכנו לקבל `user_id` כפרמטר ראשון:
- `get_all_items(user_id)` - מחזיר בגדים למשתמש ספציפי
- `add_item(user_id, image_info, analysis)` - מוסיף בגד למשתמש ספציפי
- `delete_item(user_id, item_id)` - מוחק בגד של משתמש ספציפי
- `toggle_favorite(user_id, item_id)` - משנה סטטוס favorite למשתמש ספציפי
- `clear_wardrobe(user_id)` - מנקה ארון של משתמש ספציפי
- `get_statistics(user_id)` - מחזיר סטטיסטיקות למשתמש ספציפי

### 3. עדכון Backend - שכבת Controller (`backend-python/controllers/wardrobe_controller.py`)

כל האנדפוינטים עודכנו לבדוק נוכחות של `userId`:

```python
def get_all_items(self):
    user_id = request.args.get('userId')
    if not user_id:
        return jsonify({
            'success': False,
            'error': 'User ID is required'
        }), 401
    
    items = wardrobe_service.get_all_items(user_id)
    return jsonify({'success': True, 'data': items}), 200
```

דוגמאות לכל האנדפוינטים:
- **GET** `/api/wardrobe/` - דורש `userId` ב-query params
- **POST** `/api/wardrobe/` - דורש `userId` בגוף הבקשה
- **DELETE** `/api/wardrobe/:id` - דורש `userId` ב-query params
- **PATCH** `/api/wardrobe/:id/favorite` - דורש `userId` ב-query params
- **DELETE** `/api/wardrobe/` - דורש `userId` ב-query params
- **GET** `/api/wardrobe/statistics` - דורש `userId` ב-query params

### 4. עדכון Backend - שכבת Analysis (`backend-python/controllers/style_analysis_controller.py`)

```python
def analyze_image(self):
    # קבלת userId מה-FormData
    user_id = request.form.get('userId')
    if not user_id:
        return jsonify({
            'success': False,
            'error': 'User ID is required'
        }), 401
    
    # הוספה לארון עם userId
    wardrobe_item = wardrobe_service.add_item(
        user_id,
        image_info,
        result['analysis']
    )
```

### 5. עדכון Frontend - רכיב App (`frontend/src/App.tsx`)

#### שמירה וטעינה של משתמש:
```typescript
// טעינת משתמש מ-localStorage בהפעלה
useEffect(() => {
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    try {
      setUser(JSON.parse(savedUser));
    } catch (e) {
      console.error('Failed to parse saved user:', e);
      localStorage.removeItem('user');
    }
  }
}, []);

// טעינת ארון רק כשיש משתמש
useEffect(() => {
  if (user) {
    loadWardrobe();
  } else {
    setLoading(false);
    setWardrobeItems([]);
  }
}, [user]);
```

#### טיפול בשגיאות אימות:
```typescript
const handleAuthRequired = (): void => {
  showNotification('Please sign in to continue', 'info');
  setShowLogin(true);
};

const loadWardrobe = async (): Promise<void> => {
  try {
    const result = await wardrobeAPI.getAll();
    if (result.success) {
      setWardrobeItems(result.data);
    }
  } catch (error: any) {
    if (error.message === 'AUTH_REQUIRED') {
      handleAuthRequired();
    } else {
      showNotification('Failed to load wardrobe', 'error');
    }
  }
};
```

#### שמירת משתמש בהתחברות:
```typescript
const handleLoginSuccess = (userData: any) => {
  setUser(userData);
  localStorage.setItem('user', JSON.stringify(userData));
  setShowLogin(false);
  showNotification(`Welcome back, ${userData.name}! 👋`, 'success');
};

const handleLogout = () => {
  setUser(null);
  localStorage.removeItem('user');
  setWardrobeItems([]);
  showNotification('Logged out successfully', 'info');
};
```

### 6. עדכון Frontend - רכיב ImageUpload (`frontend/src/components/ImageUpload.tsx`)

הוספת טיפול באימות:
```typescript
interface ImageUploadProps {
  onAnalysisComplete?: (analysis: any) => void;
  onAuthRequired?: () => void;  // חדש
}

// טיפול בשגיאת אימות
catch (err: any) {
  if (err.message === 'AUTH_REQUIRED') {
    setError('Please sign in to upload clothing items');
    if (onAuthRequired) {
      setTimeout(() => onAuthRequired(), 1500);
    }
  } else {
    setError(err.response?.data?.error || 'Failed to analyze image.');
  }
}
```

## זרימת העבודה החדשה

### משתמש לא מחובר:
1. משתמש פותח את האתר
2. רואה ארון בגדים ריק
3. מנסה להעלות תמונה או לצלם
4. מקבל הודעה: "Please sign in to upload clothing items"
5. מועבר אוטומטית למסך ההרשמה

### משתמש מחובר:
1. משתמש נכנס דרך Google OAuth
2. המערכת שומרת את פרטי המשתמש ב-localStorage
3. כל הבקשות כוללות את ה-userId
4. הארון מציג רק את הבגדים של המשתמש
5. בהתנתקות - הארון מתרוקן והמשתמש נמחק מ-localStorage

## מבנה נתונים

### Frontend - localStorage:
```json
{
  "user": {
    "id": "google_user_id_12345",
    "name": "John Doe",
    "email": "john@example.com",
    "picture": "https://...",
    "provider": "google"
  }
}
```

### Backend - Memory Structure:
```python
{
  "google_user_id_12345": {
    "items": [
      {
        "id": 1,
        "imageInfo": {...},
        "imageData": "data:image/jpeg;base64,...",
        "analysis": {...},
        "addedAt": "2025-12-08T...",
        "favorite": false
      }
    ],
    "counter": 2
  },
  "google_user_id_67890": {
    "items": [...],
    "counter": 5
  }
}
```

## קודי שגיאה

### Frontend:
- **AUTH_REQUIRED** - נזרק כאשר אין userId ב-localStorage

### Backend:
- **401 Unauthorized** - מוחזר כאשר חסר userId בבקשה
- **404 Not Found** - פריט לא נמצא לאותו משתמש
- **500 Internal Server Error** - שגיאת שרת כללית

## בדיקות מומלצות

1. ✅ נסה להעלות תמונה ללא התחברות - צריך להפנות להרשמה
2. ✅ התחבר דרך Google - צריך לראות הודעת ברוכים הבאים
3. ✅ העלה מספר בגדים - צריכים להופיע בארון
4. ✅ התנתק - הארון צריך להתרוקן
5. ✅ התחבר שוב - הבגדים צריכים לחזור
6. ✅ פתח בחלון פרטי עם משתמש אחר - כל משתמש רואה ארון נפרד
7. ✅ נסה למחוק/לסמן כמועדף בגדים - צריך לעבוד רק על הבגדים שלך

## הערות חשובות

⚠️ **אחסון זמני**: הנתונים מאוחסנים בזיכרון RAM של השרת ויאבדו עם הפסקת השרת.
לסביבת ייצור, יש להוסיף מסד נתונים (MongoDB, PostgreSQL וכו').

🔒 **אבטחה**: יש להוסיף אימות בצד השרת (JWT tokens) לסביבת ייצור.
כרגע הסתמכות על userId שנשלח מהלקוח - לא מספיק מאובטח לייצור.

📱 **localStorage**: נשמר רק בדפדפן ספציפי. משתמש שנכנס ממכשיר אחר יצטרך להתחבר מחדש.

🔄 **Refresh**: ריענון הדף לא מוציא את המשתמש החוצה בזכות שמירה ב-localStorage.

## צעדים הבאים (אופציונלי)

1. הוספת מסד נתונים לשמירת קבועה
2. מימוש JWT authentication בצד השרת
3. הוספת refresh tokens
4. הוספת validation על userId בשרת
5. הוספת rate limiting למניעת שימוש לרעה
6. הוספת logging למעקב אחר פעולות משתמשים

---

תאריך עדכון: 8 בדצמבר 2025
