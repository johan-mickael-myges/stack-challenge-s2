require('dotenv').config({ path: './.env.test' });
const app = require('./app');
const connectDB = require('~config/mongoose');

connectDB();

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
