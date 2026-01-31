import Machine from '../models/Machine.js';

// Get all machines
export const getAllMachines = async (req, res) => {
    try {
        const machines = await Machine.find().sort({ machine_id: 1 });
        res.json({
            success: true,
            count: machines.length,
            data: machines
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get single machine
export const getMachine = async (req, res) => {
    try {
        const machine = await Machine.findOne({ machine_id: req.params.id });
        if (!machine) {
            return res.status(404).json({ success: false, error: 'Machine not found' });
        }
        res.json({ success: true, data: machine });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Create new machine
export const createMachine = async (req, res) => {
    try {
        const machine = await Machine.create(req.body);
        res.status(201).json({ success: true, data: machine });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Update machine
export const updateMachine = async (req, res) => {
    try {
        const machine = await Machine.findOneAndUpdate(
            { machine_id: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!machine) {
            return res.status(404).json({ success: false, error: 'Machine not found' });
        }
        res.json({ success: true, data: machine });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Delete machine
export const deleteMachine = async (req, res) => {
    try {
        const machine = await Machine.findOneAndDelete({ machine_id: req.params.id });
        if (!machine) {
            return res.status(404).json({ success: false, error: 'Machine not found' });
        }
        res.json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get machines by status
export const getMachinesByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        const machines = await Machine.find({ status });
        res.json({
            success: true,
            count: machines.length,
            data: machines
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get machines needing maintenance
export const getMachinesNeedingMaintenance = async (req, res) => {
    try {
        const machines = await Machine.find();
        const needingMaintenance = machines.filter(m => m.isMaintenanceDue());
        res.json({
            success: true,
            count: needingMaintenance.length,
            data: needingMaintenance
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
