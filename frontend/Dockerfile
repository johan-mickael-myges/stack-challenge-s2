FROM node:alpine

WORKDIR /app/frontend

COPY . .

RUN npm install

ENTRYPOINT ["npm"]

CMD ["run", "dev"]

EXPOSE 5173