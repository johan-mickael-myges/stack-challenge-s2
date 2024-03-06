import {MongoClient} from "mongodb";

async function connect(client: MongoClient): Promise<string> {
    try {
        await client.connect();
        return "Connected to the database";
    } catch (e) {
        console.error(e);
        return "Failed to connect to the database";
    }
}

async function close(client: MongoClient): Promise<string> {
    try {
        await client.close();
        return "Closed the connection to the database";
    } catch (e) {
        console.error(e);
        return "Failed to close the connection to the database";
    }
}

export { connect, close };