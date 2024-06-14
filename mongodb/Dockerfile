FROM mongo:latest

COPY ./init-mongo.js /docker-entrypoint-initdb.d/

RUN chmod +x /docker-entrypoint-initdb.d/init-mongo.js

EXPOSE 27017