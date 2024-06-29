require('module-alias/register');

require('dotenv').config();
const env = process.env.NODE_ENV || 'development';
if (env === 'development') {
    require('dotenv').config({ path: '.env.local' });
} else if (env === 'test') {
    require('dotenv').config({ path: '.env.test' });
} else if (env === 'production') {
    require('dotenv').config({ path: '.env.prod' });
}

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('~middlewares/errorHandler');
const { frontendUrl } = require('~config/config');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
    origin: frontendUrl,
    credentials: true,
}));

app.use(cookieParser());

app.use('/', routes);

app.use(errorHandler);

module.exports = app;