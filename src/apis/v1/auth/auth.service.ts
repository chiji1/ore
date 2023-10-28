import ApiError from "../../../utils/ApiError";
import {IEmailAuth} from "./auth.model";
import httpStatus from "http-status";
import {IUser, UserModel} from "../users/user.model";
import jwt from "jsonwebtoken";
import {hashPassword} from "../../../utils/helpers";
import {USER_ROLES} from "../../../utils/constants";
import {RoleModel} from "../role/role.model";

export const loginWithEmailService = async (requestBody: IEmailAuth): Promise<{ accessToken, user }> => {
    try {
        const { email, password } = requestBody;
        // find user by email
        const user = await UserModel.findOne({ email }).populate('role');
        if (!user) {
            throw new ApiError({ message: 'User not found', status: httpStatus.NOT_FOUND });
        }
        // compare password
        if (!await user.passwordMatches(password)) {
            throw new ApiError({ message: 'Invalid Credentials', status: httpStatus.BAD_REQUEST });
        }
        // generate token
        const payload = {
            id: user._id,
            email: user.email,
            role: user.role,
        };
        const accessToken = signJWTToken(payload);
        return { accessToken, user: payload };
    } catch (e) {
        throw new ApiError({ message: '!Ooops something went wrong', status: httpStatus.INTERNAL_SERVER_ERROR });
    }
}

export const registerWithEmailService = async (requestBody: IEmailAuth): Promise<{ accessToken, user }> => {
    try {
        const { email, password, state } = requestBody;
        // find user by email
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            throw new ApiError({ message: 'User already exists', status: httpStatus.BAD_REQUEST });
        }
        const hashedPassword = await hashPassword(password);
        const userRole = await RoleModel.findOne({ name: USER_ROLES.USER });
        console.log({ userRole });
        const user = await UserModel.create({ email, password: hashedPassword, role: userRole._id, state });
        if (!user) {
            throw new ApiError({ message: 'Something went wrong, failed to create account', status: httpStatus.INTERNAL_SERVER_ERROR });
        }
        // ideally send email verification link
        // login the user
        return await loginWithEmailService({email, password});
    } catch (e) {
        throw new ApiError({ message: e.message, status: httpStatus.INTERNAL_SERVER_ERROR });
    }
}

export const changePasswordService = async (requestBody: { oldPassword: string, newPassword: string, createdBy?: string }, user: Partial<IUser>) => {
    try {
        const { oldPassword, newPassword } = requestBody;
        // find user by email
        const existingUser = await UserModel.findById(user.id);
        if (!existingUser) {
            throw new ApiError({ message: 'User not found', status: httpStatus.NOT_FOUND });
        }
        // check if new and old password are the same
        if (oldPassword ===  newPassword) {
            throw new ApiError({ message: 'New password cannot be the same as old password', status: httpStatus.BAD_REQUEST });
        }
        // compare password
        if (!await existingUser.passwordMatches(oldPassword)) {
            throw new ApiError({ message: 'Invalid Credentials', status: httpStatus.BAD_REQUEST });
        }
        // update password
        const hashedPassword = await hashPassword(newPassword);
        await existingUser.updateOne({ password: hashedPassword });
        return existingUser;
    } catch (e) {
        throw new ApiError({ message: e.message, status: httpStatus.INTERNAL_SERVER_ERROR });
    }
}

const signJWTToken = (payload: any) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
}
