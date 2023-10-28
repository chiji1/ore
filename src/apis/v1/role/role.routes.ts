import express from "express";
import { createRolesRecord, fetchRolesRecords } from "./role.controller";
import validateToken from "../../../middleware/validateToken";

const router = express.Router();

router.get('/', [], fetchRolesRecords);
router.post('/', [validateToken], createRolesRecord);

export default router;
