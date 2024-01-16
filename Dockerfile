FROM node:16.20.2-buster

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8084

CMD ["npm", "run", "dev"]