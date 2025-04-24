# Backend Dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install && npm install -g nodemon
RUN npm install dotenv

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]
