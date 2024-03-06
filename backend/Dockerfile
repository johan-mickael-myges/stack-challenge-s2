FROM node:alpine

WORKDIR /app

COPY . .

RUN npm install

ENTRYPOINT ["npm"]

CMD ["start"]

EXPOSE 3000
