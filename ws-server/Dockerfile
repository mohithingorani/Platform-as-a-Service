FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./

COPY . .

RUN npm run build


EXPOSE 8080

# Run the built JS
CMD ["node", "dist/index.js"]
