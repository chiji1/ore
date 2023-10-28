import express from "express";
import { setUpStates, fetchStates } from "./state.controller";

const router = express.Router();

router.get('/', [], fetchStates);
router.get('/setup', [], setUpStates);

export default router;
