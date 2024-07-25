FROM node:20-alpine

WORKDIR /app

RUN npm install -g nodemon

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8081

CMD ["npm", "run", "dev"]