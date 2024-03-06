import express from 'express';
import routes from './routes';
import {connect} from "./config/database/utils";
import client from "./config/database/client";

connect(client)
    .then(r => console.log(r))
    .catch(e => console.error(e));

const app = express();
app.use('/api', routes);

const port = 8000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});