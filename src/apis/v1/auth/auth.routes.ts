import express from "express";
import {loginWithEmail, registerWithEmail, changePasswordAuthenticated} from "./auth.controller";
import {
    validateChangePasswordBody,
    validateLoginWithEmailBody,
    validateRegisterWithEmailBody
} from "./auth.model";
import {validate} from "../../../middleware/validate";
import validateToken from "../../../middleware/validateToken";

const router = express.Router();

router
    .post('/login', [validate(validateLoginWithEmailBody())], loginWithEmail);

router
    .post('/register', [validate(validateRegisterWithEmailBody())], registerWithEmail);

router
    .post('/change-password', [validateToken, validate(validateChangePasswordBody())], changePasswordAuthenticated);


export default router
