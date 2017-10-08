import { Request, Response } from 'express';
import * as passport from 'passport';

import { DB, UserDocument } from '../db';

import { sendJSONResponse } from './utils';

export const profileHandler = (db: DB) => (req: Request, res: Response) => {
    if (
        !req.headers.Authorization
        || req.headers.Authorization.split(' ').length < 2
    ) {
        console.error('Missing Auth header');
        sendJSONResponse(res, 401, {message: 'Missing/ill-formed authorization header'});
        return;
    }
    const jwt = req.headers.Authorization.split(' ')[1];
    let payload = jwt.split('.')[1];
    payload = atob(payload);
    payload = JSON.parse(payload);
    this.db.findUserByEmail(payload.email).subscribe(
        user => {
            const name = user.get('name');
            const email = user.get('email');
            console.log('User identified as: ', name);
            sendJSONResponse(res, 200, {name, email});
        },
        err => {
            console.error('Error while authenticating user', err);
            sendJSONResponse(res, 401, {message: 'Authentication failed'});
        }
    );
};
