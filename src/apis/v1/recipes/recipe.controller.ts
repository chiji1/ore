import {AuthenticatedRequest} from "../../../utils/requests";
import {Response} from "express";
import ApiResponse from "../../../utils/response";
import {
    addOrRemoveRecipeIngredientService,
    createRecipeRecordService, deleteRecipeRecordService,
    fetchRecipeRecordsService,
    fetchSingleRecipeRecordService,
    updateRecipeRecordService
} from "./recipe.service";

export const fetchRecipeRecords = async (req: AuthenticatedRequest, res: Response) => {
    try {
        // @ts-ignore
        const response = await fetchRecipeRecordsService(req.query);
        return ApiResponse.success({ res, payload: response, message: 'Records returned successfully' });
    } catch (e) {
        return ApiResponse.fail({res, message: e.message})
    }
}

export const fetchSingleRecipeRecord = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { recipeId } = req.params;
        const response = await fetchSingleRecipeRecordService(recipeId);
        return ApiResponse.success({ res, payload: response, message: 'Records returned successfully' });
    } catch (e) {
        return ApiResponse.fail({res, message: e.message})
    }
}

export const createRecipeRecord = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const response = await createRecipeRecordService(req.body, req.file);
        return ApiResponse.success({ res, payload: response, message: 'Records returned successfully' });
    } catch (e) {
        return ApiResponse.fail({res, message: e.message})
    }
}

export const updateRecipeRecord = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { recipeId } = req.params;
        const response = await updateRecipeRecordService(recipeId, req.body, req.file);
        return ApiResponse.success({ res, payload: response, message: 'Records returned successfully' });
    } catch (e) {
        return ApiResponse.fail({res, message: e.message})
    }
}

export const deleteRecipeRecord = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { recipeId } = req.params;
        const response = await deleteRecipeRecordService(recipeId);
        return ApiResponse.success({ res, payload: response, message: 'Records returned successfully' });
    } catch (e) {
        return ApiResponse.fail({res, message: e.message})
    }
}

export const addOrRemoveRecipeIngredient = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { recipeId, operation } = req.params;
        const { ingredient } = req.body;
        const response = await addOrRemoveRecipeIngredientService(recipeId, ingredient, operation);
        return ApiResponse.success({ res, payload: response, message: 'Records returned successfully' });
    } catch (e) {
        return ApiResponse.fail({res, message: e.message})
    }
}
