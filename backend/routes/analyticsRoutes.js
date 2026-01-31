import express from 'express';
import {
    getDashboardOverview,
    getSteamEfficiencyAnalytics,
    getWaterManagementAnalytics,
    getFabricQualityAnalytics,
    getMachineUtilizationAnalytics
} from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/dashboard', getDashboardOverview);
router.get('/steam-efficiency', getSteamEfficiencyAnalytics);
router.get('/water-management', getWaterManagementAnalytics);
router.get('/fabric-quality', getFabricQualityAnalytics);
router.get('/machine-utilization', getMachineUtilizationAnalytics);

export default router;
