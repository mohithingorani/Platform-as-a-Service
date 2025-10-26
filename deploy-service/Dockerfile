FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Install Vite globally
RUN npm install -g vite@^6.4.1

# Copy source code
COPY . .

# Build the application
RUN npm run build

CMD ["npm", "start"]