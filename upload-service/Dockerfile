FROM node:18

# Update system packages & install git
RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get install -y git \
    && apt-get clean

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "start"]

