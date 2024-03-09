FROM node:alpine

WORKDIR /app/backend

COPY package*.json ./

RUN npm install

COPY . .

ENTRYPOINT ["npm"]

CMD ["start"]

EXPOSE 8000
