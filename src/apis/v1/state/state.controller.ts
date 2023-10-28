import {AuthenticatedRequest} from "../../../utils/requests";
import ApiResponse from "../../../utils/response";
import {fetchStatesRecordsService, setUpStatesService} from "./state.service";
import {Response} from "express";

export const setUpStates = async (req: AuthenticatedRequest, res: Response) => {
    try {
        await setUpStatesService();
        return ApiResponse.success({ res, payload: {}, message: 'Records returned successfully' });
    } catch (e) {
        return ApiResponse.fail({res, message: e.message})
    }
}

export const fetchStates = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const response = await fetchStatesRecordsService();
        return ApiResponse.success({ res, payload: response, message: 'Records returned successfully' });
    } catch (e) {
        return ApiResponse.fail({res, message: e.message})
    }
}
