import { Request, Response } from 'express';
import * as passport from 'passport';

import { DB, UserDocument } from '../db';
import { sendJSONResponse } from './utils';

export const registerHandler = (db: DB) => (req: Request, res: Response) => {
    const name: string = req.body.name;
    const email: string = req.body.email;
    const password: string = req.body.password;

    if (!name || !email || !password) {
        sendJSONResponse(res, 400, {'message': 'Missing required fields'});
    }

    db.createUser(name, email, password).subscribe(
        jwt => {
            sendJSONResponse(res, 200, {jwt});
        },
        err => {
            console.error('Server side error on register endpoint: ', err);
            sendJSONResponse(res, 500, {'message': 'Server side error'});
        },
        () => {
            console.error('Complete called on register endpoint: this should not happen.');
            sendJSONResponse(res, 500, {'message': 'Server side error'});
        }
    );
};

export const loginHandler = (db: DB) => (req: Request, res: Response) => {
    const email: string = req.body.email;
    const password: string = req.body.password;

    if (!email || !password) {
        sendJSONResponse(res, 400, {'message': 'Missing required fields'});
    }

    passport.authenticate('local', (err, user: UserDocument, info) => {
        if (err) {
            return sendJSONResponse(res, 404, err);
        }

        if (user) {
            const token = user.generateToken();
            return sendJSONResponse(res, 200, {token});
        } else {
            return sendJSONResponse(res, 401, info);
        }
    })(req, res, undefined);
};
