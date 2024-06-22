require('module-alias/register');
require('dotenv').config();
require('dotenv').config({
    path: '.env.local',
});

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('~middlewares/errorHandler');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use('/', routes);

app.use(errorHandler);

module.exports = app;