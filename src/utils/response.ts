import { Response } from 'express';
interface ISuccess {
    res: Response,
    payload: {} | [],
    message?: string,
    status?: number
}

interface IFail {
    res: Response,
    message?: string,
    status?: number
}

export default class ApiResponse {
    public static success({res, payload, message, status}: ISuccess) {
        return res.status(status || 200).json({
            success: true,
            payload,
            message: message || 'Success'
        });
    }

    public static fail({ res, message, status}: IFail) {
        return res.status(status || 500).json({
            success: false,
            message: message || 'Error'
        });
    }
}
