import {AuthenticatedRequest} from "../../../utils/requests";
import {Response} from "express";
import ApiResponse from "../../../utils/response";
import {updateUserService} from "./user.service";
import httpStatus from "http-status";

export const updateUserRecord = async (req: AuthenticatedRequest, res: Response): Promise<ApiResponse> => {
    try {
        const { user } = req;
        console.log({ body: req.body });
        console.log({ files: req.files });
        const response = await updateUserService(req.body, user, req.files);
        return ApiResponse.success({ res, payload: response, message: 'User updated successfully', status: httpStatus.OK });
    } catch (e) {
        return ApiResponse.fail({res, message: e.message})
    }
}
