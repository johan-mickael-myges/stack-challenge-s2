// init-mongo.js
db = db.getSiblingDB('ecommerce');

// Create a user
db.createUser({
    user: 'johan',
    pwd: 'johan',
    roles: [{ role: 'readWrite', db: 'ecommerce' }]
});