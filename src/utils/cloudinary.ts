import {v2 as cloudinary} from 'cloudinary';
import * as fs from "fs";
import {Request} from "express";

export class CloudinaryActions {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: <string>process.env.CLOUDINARY_API_SECRET,
            secure: true
        });
    }

    public async uploadImageBuffer(file: Request['file'], imageName: string): Promise<{ secure_url: string }> {
        try {
            const cloudinaryUpload = await cloudinary.uploader.upload(file.path,{
                public_id: `investor-images/${imageName}`,
                overwrite: true,
                invalidate: true,
                resource_type: 'image',
            });
            // delete file from disk
            fs.unlinkSync(file.path);

            return cloudinaryUpload;

        } catch (e) {
            throw new Error(e.message);
        }
    }
}
