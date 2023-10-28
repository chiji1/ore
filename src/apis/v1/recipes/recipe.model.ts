import {IUser} from "../users/user.model";
import {Schema, Document, model} from "mongoose";
import {body, checkExact} from "express-validator";

export interface IRecipe extends Document {
    name: string;
    slug: string;
    description: string;
    coverImage: string;
    ingredients: IIngredients[];
    instructions: string;
    price: number;
    createdBy?: IUser;
    updatedBy?: IUser;
}

export interface IIngredients {
    name: string;
    calories: number;
}

const ingredientsSchema = new Schema<IIngredients>({
    name: { type: String, required: true },
    calories: { type: Number, required: true },
});

const schema = new Schema<IRecipe>({
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String },
    coverImage: { type: String },
    ingredients: [ingredientsSchema],
    instructions: { type: String },
    price: { type: Number },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true,
});

export const validateCreateRecipe = () => {
    return [
        checkExact([
            body('name').trim().escape().exists().withMessage('Recipe name is required'),
            body('description').trim().escape().optional(),
            body('coverImage').trim().escape().optional(),
            body('ingredients').isArray().withMessage('Ingredients must be an array'),
            body('instructions').trim().escape().optional(),
            body('price').isNumeric().withMessage('Price must be a number'),
            body('createdBy').isMongoId().withMessage('Invalid user id').escape().optional(),
        ], {message: fields => { const [field] = fields; return `${field.path} is not allowed`}})
    ]
}

export const RecipeModel = model<IRecipe>('Recipe', schema);
