import ApiError from "../../../utils/ApiError";
import httpStatus from "http-status";
import {RecipeModel} from "../recipes/recipe.model";
import {RestaurantModel} from "../restaurants/restaurant.model";

export const fetchFullTextRecordsService = async (query: any) => {
    try {
        const { text } = query;
        const restaurantRecords = await RestaurantModel.aggregate([
            {
                $search: {
                    "index": "restaurantIndex",
                    "text": {
                        "query": text,
                        "path": {
                            "wildcard": "*",
                        },
                        "fuzzy": {}
                    }
                }
            }
        ]).exec();

        const recipeRecords = await RecipeModel.aggregate([
            {
                $search: {
                    "index": "recipeIndex",
                    "text": {
                        "query": text,
                        "path": ["name", "description", "ingredients.name"],
                        "fuzzy": {}
                    },
                }
            }
        ]).exec();

        return { recipeRecords, restaurantRecords };
    } catch (e) {
        throw new ApiError({message: e.message, status: httpStatus.INTERNAL_SERVER_ERROR});
    }
}
