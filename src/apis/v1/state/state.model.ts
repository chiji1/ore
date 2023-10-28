import mongoose, { Schema, Types } from 'mongoose';
const { ObjectId } = Types;

export interface IState {
    name: string;
    slug?: string;
    country?: any;
    createdAt?: Date;
    updatedAt?: Date;

}

const schema = new Schema<IState>({
    name: { type: String, required: true },
    slug: { type: String },
    country: { type: ObjectId, ref: 'Country' },
}, {
    timestamps: true,
});

schema.pre('save', function(next) {
    // @ts-ignore
    this.updatedAt = Date.now();
    next();
});

export const StateModel = mongoose.model<IState>('State', schema);
