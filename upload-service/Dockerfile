FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev  # faster and reproducible

COPY . .
RUN npm run build

CMD ["npm", "start"]
