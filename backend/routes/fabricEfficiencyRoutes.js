import express from 'express';
import {
    getAllFabricEfficiency,
    getFabricEfficiency,
    createFabricEfficiency,
    updateFabricEfficiency,
    deleteFabricEfficiency,
    bulkCreateFabricEfficiency
} from '../controllers/fabricEfficiencyController.js';

const router = express.Router();

router.route('/')
    .get(getAllFabricEfficiency)
    .post(createFabricEfficiency);

router.route('/bulk')
    .post(bulkCreateFabricEfficiency);

router.route('/:orderId')
    .get(getFabricEfficiency)
    .put(updateFabricEfficiency)
    .delete(deleteFabricEfficiency);

export default router;
