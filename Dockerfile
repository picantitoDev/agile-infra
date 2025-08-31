FROM node:22-alpine
WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma
RUN npm ci --omit=dev && npx prisma generate

COPY . .
EXPOSE 3000
CMD ["node", "app.js"]
