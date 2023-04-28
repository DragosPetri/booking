import express from 'express';

import centreRoutes from './centreApi.js';
import userApi from './userApi.js';

const router = express.Router();

// API endpoints
router.use('/centres', centreRoutes);
router.use('/users', userApi);

export default router;
