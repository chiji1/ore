import ApiError from "../../../utils/ApiError";
import httpStatus from "http-status";
import {IIngredients, IRecipe, RecipeModel} from "./recipe.model";
import {Query} from "mongoose";
import {CloudinaryActions} from "../../../utils/cloudinary";
import moment from "moment";
import {generateSlug} from "../../../utils/helpers";

export const fetchRecipeRecordsService = async (query: {name: string, limit: number, skip: number}) => {
    try {
        const filter = {} as any;
        if (query.name) {
            filter.name = query.name;
        }
        const records = await RecipeModel.find(filter)
            .limit(query.limit ?? 10)
            .skip(query.skip ?? 0)
            .exec();

        if (!records || records.length === 0) {
            throw new ApiError({message: 'No records found', status: httpStatus.NOT_FOUND});
        }

        return records;
    } catch (e) {
        throw new ApiError({message: e.message, status: httpStatus.INTERNAL_SERVER_ERROR});
    }
}

export const fetchSingleRecipeRecordService = async (recipeId: string) => {
    try {
        const record = await RecipeModel.findById(recipeId).exec();
        if (!record) {
            throw new ApiError({message: 'No record found', status: httpStatus.NOT_FOUND});
        }

        return record;
    } catch (e) {
        throw new ApiError({message: e.message, status: httpStatus.INTERNAL_SERVER_ERROR});
    }
}

export const createRecipeRecordService = async (payload: Partial<IRecipe>, file: Express.Multer.File) => {
    try {
        payload.slug = generateSlug(payload.name);
        const existingRecipe = await RecipeModel.findOne({ slug: payload.slug });
        if (existingRecipe) {
            throw new ApiError({ message: 'Recipe already exists', status: httpStatus.BAD_REQUEST});
        }
        payload.slug = generateSlug(payload.name);
        const createPayload = {} as Partial<IRecipe>;
        for (const [key, value] of Object.entries(payload)) {
            if (value) {
                createPayload[key] = value;
            }
        }

        if (file) {
            const cloudinary = new CloudinaryActions();
            const cloudinaryResponse = await cloudinary.uploadImageBuffer(file, `${payload.name}${moment().format()}`);
            createPayload['coverImage'] = cloudinaryResponse.secure_url;
        }


        const recipe = new RecipeModel(createPayload);
        const record = await recipe.save();
            await RecipeModel.create(createPayload);
        if (!record) {
            throw new ApiError({message: 'No record found', status: httpStatus.NOT_FOUND});
        }

        return record;
    } catch (e) {
        throw new ApiError({ message: e.message, status: httpStatus.INTERNAL_SERVER_ERROR });
    }
}

export const updateRecipeRecordService = async (recipeId: string, payload: Partial<IRecipe>, file: Express.Multer.File) => {
    try {
        const recordExists = await RecipeModel.findById(recipeId).exec();
        if (!recordExists) {
            throw new ApiError({message: 'No record found', status: httpStatus.NOT_FOUND});
        }
        const updatePayload = {} as Partial<IRecipe>;
        for (const [key, value] of Object.entries(payload)) {
            if (value) {
                updatePayload[key] = value;
                if (key === 'name') {
                    updatePayload.slug = generateSlug(value);
                }
            }
        }

        if (file) {
            const cloudinary = new CloudinaryActions();
            const cloudinaryResponse = await cloudinary.uploadImageBuffer(file, `${payload.name}${moment().format()}`);
            updatePayload['coverImage'] = cloudinaryResponse.secure_url;
        }

        const record = await RecipeModel.findByIdAndUpdate(recipeId, updatePayload, {new: true}).exec();
        if (!record) {
            throw new ApiError({message: 'There was an error updating record', status: httpStatus.INTERNAL_SERVER_ERROR});
        }

        return record;
    } catch (e) {
        throw new ApiError({ message: e.message, status: httpStatus.INTERNAL_SERVER_ERROR });
    }
}

export const deleteRecipeRecordService = async (recipeId: string) => {
    try {
        const record = await RecipeModel.findByIdAndDelete(recipeId);
        if (!record) {
            throw new ApiError({message: 'No record found', status: httpStatus.NOT_FOUND});
        }

        return record;
    } catch (e) {
        throw new ApiError({ message: e.message, status: httpStatus.INTERNAL_SERVER_ERROR });
    }
}


export const addOrRemoveRecipeIngredientService = async (recipeId: string, ingredient: IIngredients, operation: string) => {
    try {
        const recipe = await RecipeModel.findById(recipeId);
        if (!recipe) {
            throw new ApiError({message: 'No record found', status: httpStatus.NOT_FOUND});
        }
        if (operation === 'add') {
            recipe.ingredients.push(ingredient);
            await recipe.save();
            return recipe;
        }
        if (operation === 'remove') {
            const ingredientIndex = recipe.ingredients.findIndex((item) => item.name === ingredient.name);
            if (ingredientIndex === -1) {
                throw new ApiError({message: 'Ingredient not found', status: httpStatus.NOT_FOUND});
            }
            recipe.ingredients.splice(ingredientIndex, 1);
            await recipe.save();
            return recipe;
        }
    } catch (e) {
        throw new ApiError({ message: e.message, status: httpStatus.INTERNAL_SERVER_ERROR });
    }
}
