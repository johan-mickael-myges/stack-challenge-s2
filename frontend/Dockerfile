FROM node:alpine

WORKDIR /app/frontend

COPY package*.json ./

RUN npm install

COPY . .

ENTRYPOINT ["npm"]

CMD ["run", "dev"]

EXPOSE 5173