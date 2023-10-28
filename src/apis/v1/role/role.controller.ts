import ApiResponse from "../../../utils/response";
import { Request, Response } from "express";
import {createRolesRecordService, fetchRolesRecordsService} from "./role.service";

export const fetchRolesRecords = async (req: Request, res: Response) => {
    try {
        const { params } = req;
        const response = await fetchRolesRecordsService(params);
        return ApiResponse.success({ res, payload: response, message: 'Records returned successfully' });
    } catch (e) {
        return ApiResponse.fail({ res, message: e.message });
    }
}

export const createRolesRecord = async (req: Request, res: Response) => {
    try {
        const { body } = req;
        const response = await createRolesRecordService(body);
        return ApiResponse.success({ res, payload: response, message: 'Role created successfully' });
    } catch (e) {
        return ApiResponse.fail({ res, message: e.message });
    }
}
