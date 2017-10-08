import { Schema } from 'mongoose';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

export const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    hash: String,
    salt: String,
    joiningDate: Date,
});

userSchema.methods.setPassword = (password: string) => {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.validPassword = (password: string) => {
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
};

userSchema.methods.generateJwt = () => {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign(JSON.stringify({
        _id: this._id,
        email: this.email,
        name: this.name,
        exp: expiry.getTime() / 1000,
    }), 'MY_SECRET');
};

export const messageSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: Date,
        default: Date.now(),
    }
});
