import express from "express";
import { createRecipeRecord, deleteRecipeRecord, fetchRecipeRecords, updateRecipeRecord, fetchSingleRecipeRecord, addOrRemoveRecipeIngredient } from "./recipe.controller";
import validateToken from "../../../middleware/validateToken";
import {validate} from "../../../middleware/validate";
import {validateCreateRecipe} from "./recipe.model";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function (req: any, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
});
const upload = multer({storage});

router.route('/')
    .get([validateToken], fetchRecipeRecords)
    .post([validateToken, upload.single('coverImage'), validate(validateCreateRecipe())], createRecipeRecord);

router.get('/:recipeId', [validateToken], fetchSingleRecipeRecord);
router.put('/:recipeId', [validateToken], updateRecipeRecord);
router.delete('/:recipeId', [validateToken], deleteRecipeRecord);

router.put('/:recipeId/ingredients/:operation', [validateToken], addOrRemoveRecipeIngredient);

export default router;
