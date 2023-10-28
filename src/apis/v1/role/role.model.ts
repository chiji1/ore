import mongoose, {Schema} from "mongoose";
const { ObjectId } = Schema.Types;

export interface IRole {
    name: string;
    slug: string;
}

const schema = new Schema<IRole>({
    name: { type: String, required: true },
    slug: { type: String, required: true },
}, {
    timestamps: true,
});

export const RoleModel = mongoose.model<IRole>('Role', schema);
