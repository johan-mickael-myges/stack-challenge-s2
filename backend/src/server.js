require('dotenv').config({ path: './.env.test' });
const app = require('./app');
const connectDB = require('~config/mongoose');

connectDB();

const PORT = 8000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
