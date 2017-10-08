import * as socketio from 'socket.io';
import { Server } from 'http';
import * as passport from 'passport';
import { Document } from 'mongoose';

import { DB } from '../db';

const EventList = {
    Server: {
        Connection: 'connection',
        Disconnection: 'disconnect',
    },
    Status: {
        Joined: 'joined',
        Left: 'left',
    },
    Receive: {
        Message: 'received/message',
    },
    Send: {
        Message: 'send/message',
    }
};

export class IOServer {
    server: SocketIO.Server;

    constructor(server: Server, private db: DB) {
        this.server = socketio(server, {
            path: '/msgs',
        });

        this.registerEvents();
    }

    registerEvents() {
        this.server.on(EventList.Server.Connection, (socket: SocketIO.Socket) => {
            this.handleConnection(socket);
        });
    }

    handleConnection(socket: SocketIO.Socket) {
        console.log('New connection: ', socket);

        if (
            !socket.request.headers.Authorization
            || socket.request.headers.Authorization.split(' ').length < 2
        ) {
            console.error('Missing Auth header');
            socket.disconnect();
            return;
        }
        const jwt = socket.request.headers.Authorization.split(' ')[1];
        let payload = jwt.split('.')[1];
        payload = atob(payload);
        payload = JSON.parse(payload);
        this.db.findUserByEmail(payload.email).subscribe(
            user => {
                const name = user.get('name');
                console.log('User identified as: ', name);

                this.annonceUserConnection(name);

                socket.on(EventList.Receive.Message, data => {
                    this.handleMessage(socket, user, data);
                });

                socket.on(EventList.Server.Disconnection, () => {
                    this.annonceUserDisconnection(name);
                });
            },
            err => {
                console.error('Error while authenticating user', err);
                socket.disconnect(true);
            }
        );
    }

    handleMessage(socket: SocketIO.Socket, user: Document, data) {
        console.log('New message: ', data, ' from ', user);

        this.db.createMessage(user._id, data.message).subscribe(
            () => {
                this.server.emit(EventList.Send.Message, {
                    message: data.message,
                });
            },
            error => {
                console.error('Error while persisting message: ', error, user, data);
            },
        );
    }

    annonceUserConnection(name: string) {
        this.server.emit(EventList.Status.Joined, {
            username: name,
        });
    }

    annonceUserDisconnection(name: string) {
        this.server.emit(EventList.Status.Left, {
            username: name,
        });
    }
}
