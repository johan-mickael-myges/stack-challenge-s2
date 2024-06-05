import express from 'express';
import routes from './routes';
import { connect as connectMongodb} from './config/database/mongoose';
import { connect as connectPostgres } from './config/database/sequelize';
import loadFixtures from './fixtures';

const app = express();
const cors = require('cors');

app.use(cors());
app.use('/api', routes);

connectMongodb();

connectPostgres();
loadFixtures();

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});