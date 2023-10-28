import { IRole } from "../role/role.model";
import { Document, Schema, model} from "mongoose";
import * as bcrypt from 'bcryptjs';
import {body, checkExact} from "express-validator";
export interface IUser extends Document {
    firstName?: string;
    lastName?: string;
    profileImage: string;
    email: string;
    password: string;
    role: IRole;
    createdBy?: IUser;
    updatedBy?: IUser;

    //methods
    shrink: () => any;
    passwordMatches: (password: string) => Promise<boolean>
}

export const validateUpdateUser = () => {
    return [
        checkExact([
            body('firstName').trim().escape().optional(),
            body('lastName').trim().escape().optional(),
            body('nickname').trim().escape().optional(),
            body('avatar').trim().escape().optional(),
            body('profileImage').trim().escape().optional(),
            body('jobTitle').trim().escape().optional(),
            body('website').trim().escape().optional(),
            body('country').trim().escape().optional(),
            body('bio').trim().escape().optional(),
            body('phone').trim().escape().optional(),
            body( 'updatedBy').isMongoId().withMessage('Invalid user id').escape().optional(),
        ], {message: fields => { const [field] = fields; return `${field.path} is not allowed`}})
    ]
}

const schema = new Schema<IUser>({
    firstName: { type: String },
    lastName: { type: String },
    profileImage: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: Schema.Types.ObjectId, ref: 'Role' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true,
});

schema.method({
    shrink() {
        const transformed = {};
        const fields = ['id', 'email', 'createdAt'];

        fields.forEach(field => {
            transformed[field] = this[field];
        });

        return transformed;
    },
    async passwordMatches(password: string): Promise<boolean> {
        return await bcrypt.compare(password, this.password);
    }
})

export const UserModel = model<IUser>('User', schema);
