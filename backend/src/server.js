require('dotenv').config({ path: './.env.test' });
const app = require('./app');

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
