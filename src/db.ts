import mongoose, { Connection, ConnectOptions } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
// import bluebird from 'bluebird';
import log from './logger';

const logger = log(__filename);

let connection: Connection;
let connectionString: string;

let debugHandler: any = true;
if (process.env.NODE_ENV === 'production') {
    debugHandler = (coll, method, query, doc) => {
        const info = `db.${coll}.${method}(${JSON.stringify(query)}, ${JSON.stringify(doc)});`;
        logger.info(info);
    };
}

mongoose.set('debug', debugHandler);

/**
 * Connect to mongo db
 *
 * @returns {object} Mongoose connection
 * @public
 */
export const initMongoose = async (): Promise<void> => {
    logger.info('Opening mongoose');
    const options: ConnectOptions = {
        keepAlive: true,
    };
    await mongoose.connect(process.env.MONGODB_URI, options);
    logger.info('mongoDB connected...');

    connection = mongoose.connection;
    connectionString = process.env.MONGODB_URI;
};

export const initTestMongoose = async (): Promise<MongoMemoryServer> => {
    mongoose.set('debug', false);
    logger.info('Opening mongoose');
    const options: ConnectOptions = {
    };
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    await mongoose.connect(uri, options);
    logger.info('Test mongoDB connected...');

    connection = mongoose.connection;
    connectionString = uri;
    return mongod;
};

export function getMongooseConnection(): Connection {
    if (connection) {
        return connection;
    }

    return mongoose.connection;
}

export function getConnectionString(): string {
    return connectionString || process.env.MONGODB_URI;
}
