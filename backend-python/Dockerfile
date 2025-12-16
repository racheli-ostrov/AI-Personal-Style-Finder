# Image בסיסי עם Python
FROM python:3.11-slim

# יוצא תיקייה לעבודה במיכל
WORKDIR /app

# מעתיק קבצים של תלותיות תחילה (לשיפור cache)
COPY requirements.txt .

# מתקין את התלויות תוך התעלמות מבעיות SSL
RUN pip install --no-cache-dir --trusted-host pypi.org --trusted-host files.pythonhosted.org -r requirements.txt

# מעתיק את שאר הקוד
COPY . .

# מגדיר הפורט שבו השרת ירוץ
ENV PORT=5001

# פקודת הרצה של השרת
CMD ["python", "app.py"]
