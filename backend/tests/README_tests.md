# הפעלת בדיקות וכיסוי קוד

## הפעלת כל הבדיקות (יחידה ואינטגרציה)

1. ודא שאתה בתיקיית backend:

```
cd backend
```

2. הפעל את כל הבדיקות:

```
pytest
```

3. הפעל בדיקות עם דוח כיסוי קוד:

```
pytest --cov=app --cov-report=html
```

- דוח כיסוי ייווצר בתיקיית `htmlcov`. פתח את `htmlcov/index.html` בדפדפן כדי לראות את הכיסוי.

## דרישות שבוצעו
- בדיקות יחידה: `tests/test_wardrobe_service.py`
- בדיקות אינטגרציה: `tests/test_wardrobe_integration.py`
- דוח כיסוי קוד: `htmlcov/index.html`

אין צורך בבדיקות E2E, Cypress, או בדיקות מול Gemini.
