import express from 'express';
import routes from './routes';
import { connect } from './config/database/mongoose';
import seedDatabase  from './scripts/seedDatabase';

const app = express();
const cors = require('cors');

app.use(cors());
app.use('/api', routes);

connect();
seedDatabase(); //a supprimer plus tard


const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});