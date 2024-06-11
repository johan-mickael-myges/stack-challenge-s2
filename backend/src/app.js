const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const db = require('./models');

const app = express();
app.use(errorHandler);
app.use(cors());
app.use('/api', routes);

const PORT = 8000;
const run = () => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

db.sequelize.sync().then(() => run());