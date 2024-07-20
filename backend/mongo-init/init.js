use shop;

db.createUser({
    user: 'layalin',
    pwd: 'layalin',
    roles: [{
        role: 'readWrite',
        db: 'shop'
    }]
});
