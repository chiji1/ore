import {AuthenticatedRequest} from "../../../utils/requests";
import ApiResponse from "../../../utils/response";
import httpStatus from "http-status";
import { Response } from "express";
import {
    createRestaurantRecordService, deleteRestaurantRecordService,
    fetchRestaurantRecordsService,
    fetchSingleRestaurantRecordService, updateRestaurantRecordService
} from "./restaurant.service";

export const fetchRestaurantRecords = async (req: AuthenticatedRequest, res: Response): Promise<ApiResponse> => {
    try {
        const response = await fetchRestaurantRecordsService(req.query);
        return ApiResponse.success({ res, payload: response, message: 'Records returned successfully' });
    } catch (e) {
        return ApiResponse.fail({res, message: e.message})
    }
}


export const fetchSingleRestaurantRecord = async (req: AuthenticatedRequest, res: Response): Promise<ApiResponse> => {
    try {
        const { user } = req;
        const response = await fetchSingleRestaurantRecordService(req.params, user);
        return ApiResponse.success({ res, payload: response, message: 'Records returned successfully' });
    } catch (e) {
        return ApiResponse.fail({res, message: e.message})
    }
}

export const createRestaurantRecord = async (req: AuthenticatedRequest, res: Response): Promise<ApiResponse> => {
    try {
        const response = await createRestaurantRecordService(req.body, req.files);
        return ApiResponse.success({ res, payload: response, message: 'Records returned successfully' });
    } catch (e) {
        return ApiResponse.fail({res, message: e.message, status: e.status ?? httpStatus.INTERNAL_SERVER_ERROR})
    }
}

export const updateRestaurantRecord = async (req: AuthenticatedRequest, res: Response): Promise<ApiResponse> => {
    try {
        const { user } = req;
        const { restaurantId } = req.params;
        const response = await updateRestaurantRecordService(req.body, restaurantId, req.files);
        return ApiResponse.success({ res, payload: response, message: 'Records returned successfully' });
    } catch (e) {
        return ApiResponse.fail({res, message: e.message, status: e.status ?? httpStatus.INTERNAL_SERVER_ERROR})
    }
}

export const deleteRestaurantRecord = async (req: AuthenticatedRequest, res: Response): Promise<ApiResponse> => {
    try {
        const { user } = req;
        const response = await deleteRestaurantRecordService(req.params, user);
        return ApiResponse.success({ res, payload: response, message: 'Records removed successfully' });
    } catch (e) {
        return ApiResponse.fail({res, message: e.message, status: e.status ?? httpStatus.INTERNAL_SERVER_ERROR})
    }
}
