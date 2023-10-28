import ApiError from "../../../utils/ApiError";
import httpStatus from "http-status";
import {StateModel} from "./state.model";

export const setUpStatesService = async () => {
    try {
        const statesFile = require('./states.json');
        for (const stateObjects of statesFile) {
            const { state, alias, lgas } = stateObjects;
            const foundState = await StateModel.findOne({ slug: alias });
            if (foundState) {
                continue;
            }
            const stateRecord = new StateModel({ name: state, slug: alias});
            await stateRecord.save();
        }
    } catch (e) {
        throw new ApiError({message: e.message, status: httpStatus.INTERNAL_SERVER_ERROR})
    }
}

export const fetchStatesRecordsService = async (): Promise<any> => {
    try {
        const states = await StateModel.find()
            .exec();
        if (!states || states.length === 0) {
            throw new ApiError({message: 'No record found', status: httpStatus.NOT_FOUND});
        }

        return states;
    } catch (e) {
        throw new ApiError({ message: e.message, status: httpStatus.INTERNAL_SERVER_ERROR });
    }
}
