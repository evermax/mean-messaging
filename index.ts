import { MyServer } from './src_api/server';
import { MyMongoDB } from './src_api/db';

const port = process.env.PORT || 3000;
const dburl = process.env.DB_URL || 'mongodb://localhost/test';
console.log('Starting server on port: ', port);

const db = new MyMongoDB(dburl);

const server = new MyServer(db);
server.listen(port);
