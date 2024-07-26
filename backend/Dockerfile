FROM node:alpine

WORKDIR /app/backend

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install -g nodemon

CMD sh -c "npm install && npm start"

EXPOSE 8000
