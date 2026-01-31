import express from 'express';
import {
    getAllWaterUsage,
    getWaterUsage,
    createWaterUsage,
    updateWaterUsage,
    deleteWaterUsage,
    bulkCreateWaterUsage
} from '../controllers/waterUsageController.js';

const router = express.Router();

router.route('/')
    .get(getAllWaterUsage)
    .post(createWaterUsage);

router.route('/bulk')
    .post(bulkCreateWaterUsage);

router.route('/:id')
    .get(getWaterUsage)
    .put(updateWaterUsage)
    .delete(deleteWaterUsage);

export default router;
