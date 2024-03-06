import { MongoClient } from "mongodb";

const uri: string = "mongodb://mongodb:27017/todos";

const options: object = {};

const client: MongoClient = new MongoClient(uri, options);

export default client;

