import ApiResponse from "../../../utils/response";
import {Request, Response} from "express";
import {
    changePasswordService,
    loginWithEmailService,
    registerWithEmailService
} from "./auth.service";
import httpStatus from "http-status";
import {AuthenticatedRequest} from "../../../utils/requests";

export const loginWithEmail = async (req: Request, res: Response) => {
    try {
        const response = await loginWithEmailService(req.body);
        return ApiResponse.success({ res, payload: response, message: 'Login successful' });
    } catch (e) {
        return ApiResponse.fail({ res, message: e.message });
    }
}

export const registerWithEmail = async (req: Request, res: Response) => {
    try {
        const response = await registerWithEmailService(req.body);
        return ApiResponse.success({ res, payload: response, message: 'Registration successful' });
    } catch (e) {
        return ApiResponse.fail({ res, message: e.message });
    }
}

export const changePasswordAuthenticated = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const response =  await changePasswordService(req.body, req.user);
        return ApiResponse.success({ res, payload: response, message: 'Password changed successfully' });
    } catch (e) {
        return ApiResponse.fail({ res, message: e.message || httpStatus.INTERNAL_SERVER_ERROR });
    }
}
