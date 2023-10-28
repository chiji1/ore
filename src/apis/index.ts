import routes from './v1';
import express from 'express';

const router = express.Router();

router.use('/v1', routes);

export default router;
