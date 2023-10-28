import * as path from 'path';
import './logger.patch';
import * as winston from 'winston';

const LOG_PATH = process.env.LOG_PATH || path.resolve( __dirname, '..', '..');

const resolvePath = pathName => path.join(LOG_PATH, pathName);

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.splat(),
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.printf(
            info => `${info.timestamp} ${info.level}: ${info.message}`
        )
    ),
    transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log`
        // - Write all logs error (and below) to `error.log`.
        //
        new winston.transports.File({ filename: resolvePath('error.log'), level: 'error' }),
        new winston.transports.File({ filename: resolvePath('combined.log') }),

    ]
});

const MESSAGE = Symbol.for('message');
//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}
export default absoluteFilePath => {
    const file = path.relative(__dirname, absoluteFilePath);
    // Because this file is in the source code root folder, the above will make all paths relative to it: just the info needed for the log.

    return {
        info: message => logger.info(`[${file}] ${message}`),
        warn: message => logger.warn(`[${file}] ${message}`),
        error: (message, error) =>
            logger.error(
                `[${file}] ${message}${
                    error && error.stack ? error.stack : error || ''
                }`
            ),
        stream: { write: message => logger.info(message.trim()) },
        stopLogging: () => {
            logger.silent = true;
        }
    };
};
