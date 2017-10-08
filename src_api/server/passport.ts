import { DB, UserDocument } from '../db';
import { Request, Response } from 'express';
import * as passport from 'passport';
import { Strategy } from 'passport-local';


const validationStrategy = (db: DB) => (username, password, done) => {
    db.findUserByEmail(username).subscribe(
        (users: UserDocument) => {
            if (!users[0].validPassword(password)) {
                return done(null, false, {message: 'Password error'});
            }

            return done(null, users[0]);
        },
        err => done(err),
    );
};

export const registerPassportStrategy = (db: DB) => {
    const strategy = new Strategy({usernameField: 'email'}, validationStrategy(db));
    passport.use(strategy);
};
