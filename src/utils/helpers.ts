import {Request} from "express";
import * as bcrypt from "bcryptjs";
import * as path from "path";
import * as fs from "fs";
import {v2 as cloudinary} from 'cloudinary';
import log from "../logger";

const logger = log(__filename);

export function getRequestIp(request: Request) {
    return request.ip;
}

export const titleCase = (str: string) => {
    return str
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

export const hashPassword = async (password: string): Promise<any> => {
    const genSalt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS) || 10);
    return await bcrypt.hash(password, genSalt);
}

export const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/ /g, '-');
}
