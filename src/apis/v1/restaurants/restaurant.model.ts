import {Document, model, Schema} from 'mongoose';
import {IState} from "../state/state.model";
import {IUser} from "../users/user.model";
import {body, checkExact} from "express-validator";

export interface IRestaurant extends Document {
    name: string;
    slug: string;
    description: string;
    address: string;
    state: IState;
    phone: string;
    email: string;
    website?: string;
    logo?: string;
    coverImage?: string;
    createdBy?: IUser;
    updatedBy?: IUser;
}

const schema = new Schema<IRestaurant>({
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String },
    address: { type: String },
    state: { type: Schema.Types.ObjectId, ref: 'State' },
    phone: { type: String },
    email: { type: String },
    website: { type: String },
    logo: { type: String },
    coverImage: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },

}, {
    timestamps: true,
});

export const validateCreateRestaurant = () => {
    return [
        checkExact([
            body('name').trim().escape().exists().withMessage('Restaurant name is required'),
            body('description').trim().escape().optional(),
            body('address').trim().escape().optional(),
            body('state'),
            body('phone').trim().escape().optional(),
            body('email').trim().escape().optional(),
            body('website').trim().escape().optional(),
            body('logo').trim().escape().optional(),
            body('coverImage').trim().escape().optional(),
            body('createdBy').isMongoId().withMessage('Invalid user id').escape().optional(),
        ], {message: fields => { const [field] = fields; return `${field.path} is not allowed`}})
    ]
}

export const RestaurantModel = model<IRestaurant>('Restaurant', schema);
