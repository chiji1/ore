import {body, checkExact} from "express-validator";


export interface IGoogleAuth {
    token: string;
}

export interface IEmailAuth {
    email: string;
    password: string;
    state?: string;
}

export const validateLoginWithGoogleBody = () => {
    return [
        body('token').exists().withMessage('Token is required'),
        checkExact([], {message: field => `${field} is not allowed`})
    ]
}

export const validateLoginWithEmailBody = () => {
    return [
        checkExact([
            body('email').exists().withMessage('Email is required'),
            body('password').exists().withMessage('Password is required')
        ], {message: fields => { const [field] = fields; return `${field.path} is not allowed`}})
    ]
}

export const validateRegisterWithEmailBody = (): any[] => {
    return [
        checkExact([
            body('email').exists().isEmail().withMessage('Email is required'),
            body('password').exists().withMessage('Password is required').bail(),
            body('state').exists().withMessage('State is required').isMongoId().bail(),
        ], {message: fields => { const [field] = fields; return `${field.path} is not allowed`}})
    ]
}

export const validateChangePasswordBody = (): any[] => {
    return [
        checkExact([
            body('oldPassword').exists().withMessage('Old password is required'),
            body('newPassword').exists().withMessage('New password is required').bail(),
            body('createdBy').isMongoId().optional()
        ], {message: fields => { const [field] = fields; return `${field.path} is not allowed`}})
    ]
}
