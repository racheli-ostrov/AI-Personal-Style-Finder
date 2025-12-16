# בוחר image בסיסי עם Node
FROM node:20-alpine

# יוצא תיקייה לעבודה
WORKDIR /app

# מעתיק קבצי package.json וקבצי lock
COPY package*.json ./

# מתקין תלותיות
RUN npm install

# מעתיק את שאר הקבצים
COPY . .

# בונה את אפליקציית React
RUN npm run build

# מריץ שרת קטן עבור הקבצים המובנים (serve)
RUN npm install -g serve

# מגדיר הפורט שבו השרת ירוץ
ENV PORT=80

# פקודת הרצה
CMD ["serve", "-s", "build", "-l", "80"]
