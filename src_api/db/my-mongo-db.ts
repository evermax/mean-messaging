import {
    Mongoose,
    MongooseThenable,
    Model,
    Document,
    Schema,
} from 'mongoose';

import { Observable, Subject } from 'rxjs/Rx';

import {
  userSchema,
  messageSchema,
} from '../models/schemas';

import { DB, UserDocument } from './interface';

function handleError(err) {
    console.error(err);
}

export class MyMongoDB implements DB {
    private mongoose: Mongoose;
    private User: Model<Document>;
    private Message: Model<Document>;

    constructor(url) {
        this.mongoose = new Mongoose();
        (<any> this.mongoose).Promise = global.Promise;
        this.mongoose.connect(url, { useMongoClient: true, promiseLibrary: global.Promise });
        this.mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
        this.createModels();
    }

    private createModels() {
        this.mongoose.model('User', userSchema);
        this.mongoose.model('Message', messageSchema);
        this.User = this.mongoose.model('User');
        this.Message = this.mongoose.model('Message');
    }

    createUser(name: string, email: string, password: string): Observable<string> {
        const jwtSubject = new Subject<string>();

        const user = new this.User({
            name,
            email,
            joiningDate: Date.now(),
        });

        user.get('setPassword')(password);

        user.save(err => {
            if (err) {
                return jwtSubject.error(err);
            }
            jwtSubject.next(user.get('generateToken')());
        });

        return jwtSubject;
    }

    createMessage(author: Schema.Types.ObjectId, message: string): Observable<any> {
        const subj = new Subject();
        const msg = new this.Message({
            message,
            author,
        });

        msg.save(err => {
            if (err) {
                return subj.error(err);
            }
            return subj.next();
        });

        return subj;
    }

    findUserByEmail(email: string): Observable<Document> {
        const subject = new Subject<Document>();

        this.User.find({email}, (err, users: Document[]) => {
            if (err) {
                return subject.error(err);
            }
            if (!users.length) {
                return subject.error('User not found');
            }
            subject.next(users[0]);
        });

        return subject;
    }
}
