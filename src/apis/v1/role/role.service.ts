import ApiError from "../../../utils/ApiError";
import httpStatus from "http-status";
import {RoleModel} from "./role.model";
import {generateSlug} from "../../../utils/helpers";

export const fetchRolesRecordsService = async (params): Promise<any> => {
    try {
        // check ip address to prevent abuse

        const people = await RoleModel.find({})
            .exec();
        if (!people || people.length === 0) {
            throw new ApiError({message: 'No record found', status: httpStatus.NOT_FOUND});
        }

        return people;
    } catch (e) {
        throw new ApiError({ message: e.message, status: httpStatus.INTERNAL_SERVER_ERROR });
    }
}

export const createRolesRecordService = async (requestBody: any): Promise<any> => {
    try {
        const { name } = requestBody;
        const slug = generateSlug(name);
        return await RoleModel.create({ name, slug });
    } catch (e) {
        throw new ApiError({ message: e.message, status: httpStatus.INTERNAL_SERVER_ERROR });
    }
}
