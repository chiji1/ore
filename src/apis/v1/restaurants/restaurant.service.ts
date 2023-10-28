import {IRestaurant, RestaurantModel} from "./restaurant.model";
import {IUser} from "../users/user.model";
import ApiError from "../../../utils/ApiError";
import httpStatus from "http-status";
import {CloudinaryActions} from "../../../utils/cloudinary";
import {generateSlug} from "../../../utils/helpers";

export const fetchRestaurantRecordsService = async (params: { limit?: number; skip?: number, state?: string }): Promise<IRestaurant[]> => {
    try {
        // generate filter object
        const filter = {} as any;
        if (params.state) {
            filter.state = params.state;
        }
        const RestaurantRecords = await RestaurantModel.find(filter)
            .limit(params.limit ?? 10)
            .skip(params.skip ?? 0)
            .populate('state');
        if (!RestaurantRecords) {
            throw new ApiError({ message: 'No records found', status: httpStatus.NOT_FOUND});
        }

        return RestaurantRecords;
    } catch (e) {
        throw new ApiError({ message: e.message, status: e.status || httpStatus.INTERNAL_SERVER_ERROR});
    }
}

export const fetchSingleRestaurantRecordService = async (params: any, user: Partial<IUser>): Promise<IRestaurant> => {
    try {
        const RestaurantRecord = await RestaurantModel.findById(params.restaurantId).populate('state');
        if (!RestaurantRecord) {
            throw new ApiError({ message: 'No record found', status: httpStatus.NOT_FOUND});
        }

        return RestaurantRecord;
    } catch (e) {
        throw new ApiError({ message: e.message, status: e.status || httpStatus.INTERNAL_SERVER_ERROR});
    }
}

export const createRestaurantRecordService = async (payload: Partial<IRestaurant>, files?: { [p: string]: Express.Multer.File[] } | Express.Multer.File[]): Promise<IRestaurant> => {
    try {
        // check if restaurant with name in state is already in the database
        const existingRestaurant = await RestaurantModel.findOne({ name: payload.name, state: payload.state });
        if (existingRestaurant) {
            throw new ApiError({ message: 'Restaurant already exists', status: httpStatus.BAD_REQUEST});
        }
        payload.slug = generateSlug(payload.name);
        const createPayload = {} as Partial<IRestaurant>;
        for (const [key, value] of Object.entries(payload)) {
            if (value) {
                createPayload[key] = value;
                if (key === 'name') {
                    createPayload.slug = generateSlug(value);
                }
            }
        }
        // check if logo or coverImage exists then upload to cloudinary
        if (files) {
            for (const [key, value] of Object.entries(files)) {
                if (value) {
                    const cloudinary = new CloudinaryActions();
                    // @ts-ignore
                    const cloudinaryResponse = await cloudinary.uploadImageBuffer(value[0], `${key}${Date.now()}`);
                    // @ts-ignore
                    createPayload[key] = cloudinaryResponse.secure_url;
                }
            }
        }
        console.log({ createPayload });
        const newRestaurantRecord = new RestaurantModel(createPayload);
        const savedRestaurantRecord = await newRestaurantRecord.save();
        if (!savedRestaurantRecord) {
            throw new ApiError({ message: 'Could not create record', status: httpStatus.INTERNAL_SERVER_ERROR});
        }

        return savedRestaurantRecord;
    } catch (e) {
        throw new ApiError({ message: e.message, status: e.status || httpStatus.INTERNAL_SERVER_ERROR});
    }
}

export const updateRestaurantRecordService = async (payload: Partial<IRestaurant>, restaurantId: string, files?: { [p: string]: Express.Multer.File[] } | Express.Multer.File[]): Promise<IRestaurant> => {
    try {
        const recordExists = await RestaurantModel.findById(restaurantId);
        if (!recordExists) {
            throw new ApiError({ message: 'No record found', status: httpStatus.NOT_FOUND});
        }
        const updatePayload = {};
        for (const [key, value] of Object.entries(payload)) {
            if (value) {
                updatePayload[key] = value;
            }
        }

        // check if logo or coverImage exists then upload to cloudinary
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

        const updateRestaurant = await RestaurantModel.findOneAndUpdate({_id: restaurantId}, updatePayload, { new: true });
        if (!updateRestaurant) {
            throw new ApiError({ message: 'There was an error updating this information', status: httpStatus.NOT_FOUND});
        }

        return updateRestaurant;
    } catch (e) {
        throw new ApiError({ message: e.message, status: e.status || httpStatus.INTERNAL_SERVER_ERROR});
    }
}

export const deleteRestaurantRecordService = async (params: any, user: Partial<IUser>): Promise<IRestaurant> => {
    try {
        const RestaurantRecord = await RestaurantModel.findByIdAndDelete(params.restaurantId);
        if (!RestaurantRecord) {
            throw new ApiError({ message: 'No record found', status: httpStatus.NOT_FOUND});
        }

        return RestaurantRecord;
    } catch (e) {
        throw new ApiError({ message: e.message, status: e.status || httpStatus.INTERNAL_SERVER_ERROR});
    }
}
