import * as httpStatus from 'http-status';
import * as expressValidation from 'express-validation';
import APIError from '../utils/ApiError';
import log from '../logger';
import * as process from 'process';
import {NextFunction, Request, Response} from "express";

const logger = log(__filename);
/**
 * Error handler. Send stacktrace only during development
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handler = (err, req: Request, res: Response, next: NextFunction) => {
    if (res.finished) {
        logger.info(`FCB-402: Response ended before error could be resolved. ENDPOINT:${req.originalUrl}`);
        return;
    }
    const response = {
        success: false,
        code: err.status,
        message: err.message || httpStatus[err.status],
        errors: err.errors,
        stack: err.stack,
        description: err.description || err.message,
    };
    if (process.env.NODE_ENV !== 'development') {
        delete response.stack;
    }
    res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR);

    const errorMaintenanceCode = new Date().getTime().toString(16).toUpperCase();
    logger.error(`Showed an error page to the user: ${errorMaintenanceCode}. Use this code to find the errors if reported by customers`, err);


    return res.json(response);

};

/**
 * If error is not an instanceOf APIError, convert it.
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const converter = (err: APIError | Error, req: Request, res: Response, next: NextFunction) => {
    let convertedError = err;

     if (!(err instanceof APIError)) {
        convertedError = new APIError({
            message: err.message,
            // @ts-ignore
            status: err.status,
            stack: err.stack,
        });
    }

    return handler(convertedError, req, res, next);
};

/**
 * Catch 404 and forward to error handler
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const notFound = (req: Request, res: Response, next: NextFunction) => {
    const err = new APIError({
        message: 'Not found',
        status: httpStatus.NOT_FOUND,
    });
    return handler(err, req, res, next);
};
