FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm ci   # faster and reproducible

COPY . .
RUN npm run build

CMD ["npm", "start"]
