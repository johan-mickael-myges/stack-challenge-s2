const express = require('express');
const jwt = require("jsonwebtoken");

const { register } = require('../../controllers/authentification/inscriptionController');

const router = express.Router();

router.post('/', register);

module.exports = router;
