import express from 'express';
import {
    getAllMachines,
    getMachine,
    createMachine,
    updateMachine,
    deleteMachine,
    getMachinesByStatus,
    getMachinesNeedingMaintenance
} from '../controllers/machineController.js';

const router = express.Router();

router.route('/')
    .get(getAllMachines)
    .post(createMachine);

router.route('/status/:status')
    .get(getMachinesByStatus);

router.route('/maintenance/due')
    .get(getMachinesNeedingMaintenance);

router.route('/:id')
    .get(getMachine)
    .put(updateMachine)
    .delete(deleteMachine);

export default router;
