import { Document, Schema } from 'mongoose';

import { Observable, Subject } from 'rxjs/Rx';

export interface UserDocument extends Document {
    setPassword: (pwd: string) => void;
    validPassword: (pwd: string) => boolean;
    generateToken: () => string;
}

export interface DB {
    createUser(name: string, email: string, password: string): Observable<string>;
    createMessage(author: Schema.Types.ObjectId, message: string): Observable<any>;
    findUserByEmail(email: string): Observable<Document>;
}
