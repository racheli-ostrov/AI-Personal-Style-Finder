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


# מנקה משתני proxy ומסיר קובץ .npmrc לפני התקנת serve
RUN rm -f /root/.npmrc /app/.npmrc || true \
	&& unset http_proxy https_proxy HTTP_PROXY HTTPS_PROXY npm_config_proxy npm_config_https_proxy \
	&& npm install -g serve

# מגדיר הפורט שבו השרת ירוץ
ENV PORT=80

# פקודת הרצה
CMD ["serve", "-s", "build", "-l", "80"]
