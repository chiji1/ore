import express from "express";
import { updateUserRecord} from "./user.controller";
import validateToken from "../../../middleware/validateToken";
import {validate} from "../../../middleware/validate";
import {validateUpdateUser} from "./user.model";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function (req: any, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
});
const upload = multer({storage});

router.put('/', [validateToken, upload.fields([{name: 'avatar', maxCount: 1}, {name: 'profileImage', maxCount: 1}]), validate(validateUpdateUser())], updateUserRecord);


export default router;
