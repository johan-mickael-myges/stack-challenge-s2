const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // Assurez-vous que le chemin est correct

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/users', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
