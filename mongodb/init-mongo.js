// init-mongo.js
db = db.getSiblingDB('moonshine');

// Create a user
db.createUser({
    user: 'group3',
    pwd: '123456789',
    roles: [{ role: 'readWrite', db: 'moonshine' }]
});