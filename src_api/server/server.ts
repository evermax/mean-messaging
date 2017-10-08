import * as express from 'express';
import { createServer, Server } from 'http';
import * as socketio from 'socket.io';
import * as mongoose from 'mongoose';

import { IOServer } from './ioserver';

import { MyMongoDB, DB } from '../db';

import {
    registerHandler,
    loginHandler,
} from './authentication';

import { profileHandler } from './profile';

export class MyServer {
    db: DB;
    app: express.Express;
    server: Server;
    io: IOServer;
    constructor(db: DB) {
        this.db = db;

        this.app = express();
        this.registerRouter();
        this.server = createServer(this.app);

        this.registerIOServer();
    }

    private registerRouter() {
        const router = express.Router();
        router.use('/register', registerHandler(this.db));
        router.use('/login', loginHandler(this.db));
        router.use('/profile', profileHandler(this.db));
        this.app.use('/api/v1', router);
    }

    private registerIOServer() {
        this.io = new IOServer(this.server, this.db);
    }

    listen(port: number) {
        this.server.listen(port);
    }
}
