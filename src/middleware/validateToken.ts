import { Request, Response, NextFunction } from "express";
import ApiResponse from "../utils/response";
import jwt from "jsonwebtoken";
import {AuthenticatedRequest} from "../utils/requests";
import httpStatus from "http-status";
import log from "../logger";
const logger = log(__filename);

const validateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            ApiResponse.fail({ res, message: 'Token not found', status: httpStatus.UNAUTHORIZED });
        }
        const spitToken = token.split(' ')[1];
        const decoded = jwt.verify(spitToken, process.env.JWT_SECRET);
        // @ts-ignore
        req.user = decoded;
        const updatedCreatedSignature = addCreatedAndUpdatedByStampsToBody(req as AuthenticatedRequest);
        req.body = { ...req.body, ...updatedCreatedSignature}
        next();
    } catch (e) {
        ApiResponse.fail({ res, message: e.message, status: httpStatus.UNAUTHORIZED });
    }
}

const addCreatedAndUpdatedByStampsToBody = (req: AuthenticatedRequest) => {
    try {
        const { user } = req;
        const createdByUpdatedBySignatures: {createdBy?: string, updatedBy?: string} = {};
        // check request method to determine if it is a create or update request
        switch (req.method) {
            case 'POST':
                createdByUpdatedBySignatures.createdBy = user.id;
                break;
            case 'PUT':
                createdByUpdatedBySignatures.updatedBy = user.id;
                break;
        }
        return createdByUpdatedBySignatures;
    } catch (e) {
        logger.error(e.message, e);
    }
}

export default validateToken;
