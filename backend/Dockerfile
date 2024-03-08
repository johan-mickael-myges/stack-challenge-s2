FROM node:alpine

WORKDIR /app/backend

COPY . .

RUN npm install

ENTRYPOINT ["npm"]

CMD ["start"]

EXPOSE 8000
