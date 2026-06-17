# Build stage for production-ready, or just dev environment.
# As per requirements, we'll setup a basic dev container that can be run with docker-compose
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
