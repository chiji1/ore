import {AuthenticatedRequest} from "../../../utils/requests";
import ApiResponse from "../../../utils/response";
import {fetchFullTextRecordsService} from "./search.service";
import {Response} from "express";

export const fetchFullTextRecords = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { query } = req;
        const response = await fetchFullTextRecordsService(query);
        return ApiResponse.success({res, payload: response, message: 'Success'});
    } catch (e) {
        return ApiResponse.fail({res, message: e.message, status: e.status});
    }
}
