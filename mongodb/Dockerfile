FROM mongo:latest

ENV MONGO_INITDB_ROOT_USERNAME=root
ENV MONGO_INITDB_ROOT_PASSWORD=example
ENV MONGO_INITDB_DATABASE=ecommerce

COPY ./init-mongo.js /docker-entrypoint-initdb.d/

RUN chmod +x /docker-entrypoint-initdb.d/init-mongo.js

EXPOSE 27017