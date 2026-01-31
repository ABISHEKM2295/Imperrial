import express from 'express';
import {
    getAllSteamUsage,
    getSteamUsage,
    createSteamUsage,
    updateSteamUsage,
    deleteSteamUsage,
    bulkCreateSteamUsage
} from '../controllers/steamUsageController.js';

const router = express.Router();

router.route('/')
    .get(getAllSteamUsage)
    .post(createSteamUsage);

router.route('/bulk')
    .post(bulkCreateSteamUsage);

router.route('/:id')
    .get(getSteamUsage)
    .put(updateSteamUsage)
    .delete(deleteSteamUsage);

export default router;
