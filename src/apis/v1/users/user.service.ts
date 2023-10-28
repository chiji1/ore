import moment from "moment";
import ApiError from "../../../utils/ApiError";
import httpStatus from "http-status";
import {IUser, UserModel} from "./user.model";
import {CloudinaryActions} from "../../../utils/cloudinary";

interface updatePayloadInterface {
    firstname?: string,
    lastname?: string,
    nickname?: string,
    avatar?: string,
    profileImage?: string,
    subscription?: string,
    createdBy?: string,
    updatedBy?: string
}

export const updateUserService = async (data: updatePayloadInterface, user: Partial<IUser>, files?: { [p: string]: Express.Multer.File[] } | Express.Multer.File[]) => {
    try {
        const updatePayload = {};
        for (const [key, value] of Object.entries(data)) {
            if (value) {
                updatePayload[key] = value;
            }
        }
        if (files) {
            for (const [key, value] of Object.entries(files)) {
                if (value) {
                    const cloudinary = new CloudinaryActions();
                    // @ts-ignore
                    const cloudinaryResponse = await cloudinary.uploadImageBuffer(value[0], `${key}${user.id}`);
                    // @ts-ignore
                    updatePayload[key] = cloudinaryResponse.secure_url;
                }
            }
        }

        // find user and update
        const updateUser = await UserModel.findOneAndUpdate({_id: user.id}, updatePayload, { new: true }).lean();
        if (!updateUser) {
            throw new ApiError({ message: 'No user found', status: httpStatus.NOT_FOUND});
        }
        return updateUser;
    } catch (e) {
        throw new ApiError({message: e.message, status: httpStatus.INTERNAL_SERVER_ERROR});
    }
}

export const addOrRemovePeopleAsConnectionService = async (user: Partial<IUser>, personId: string, operation: string) => {
    try {
        const userData = await UserModel.findById(user.id);
        console.log({ userData });
        if (operation === 'add') {
            // @ts-ignore
            if (userData?.connections.includes(personId)) {
                throw new ApiError({ message: 'Person already exists', status: httpStatus.CONFLICT});
            }
            // @ts-ignore
            userData.connections.push(personId);
        }
        if (operation === 'remove') {
            // @ts-ignore
            userData.connections = userData.connections.filter((connection: string) => String(connection) !== String(personId)) as string[];
        }
        await userData.save();
        return userData;
    } catch (e) {
        throw new ApiError({message: e.message, status: e.error || httpStatus.INTERNAL_SERVER_ERROR});
    }
}
