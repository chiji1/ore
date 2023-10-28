import express from "express";
import { fetchRestaurantRecords, fetchSingleRestaurantRecord, createRestaurantRecord, updateRestaurantRecord, deleteRestaurantRecord } from "./restaurant.controller";
import validateToken from "../../../middleware/validateToken";
import {validate} from "../../../middleware/validate";
import {validateCreateRestaurant} from "./restaurant.model";
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

router.route('/')
    .get([validateToken], fetchRestaurantRecords)
    .post([validateToken, upload.fields([{name: 'logo', maxCount: 1}, {name: 'coverImage', maxCount: 1}]), validate(validateCreateRestaurant())], createRestaurantRecord);

router.get('/:restaurantId', [], fetchSingleRestaurantRecord);
router.put('/:restaurantId', [], updateRestaurantRecord);
router.delete('/:restaurantId', [], deleteRestaurantRecord);

export default router;
