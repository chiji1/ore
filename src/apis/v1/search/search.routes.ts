import express from "express";

import { fetchFullTextRecords } from "./search.controller";

const router = express.Router();

router.route('/')
    .get([], fetchFullTextRecords);


export default router;
