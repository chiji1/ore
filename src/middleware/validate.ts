import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import ApiResponse from "../utils/response";
import httpStatus from "http-status";
export const validate = (validations: any[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all(validations.map((validation) => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        } else {
            console.log({
                errors: errors.array(),
            })
            return ApiResponse.fail({ res, message: formatErrorAsString(errors.array()), status: httpStatus.BAD_REQUEST });
        }

    };
};

const formatErrorAsString = (error: any[]) => {
    console.log({ error: JSON.stringify(error) });
    return error.map((err) => `${ err?.fields ? err.fields[0]?.path : err.path }: ${err.msg}`).join(', ');
}
