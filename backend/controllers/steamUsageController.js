import SteamUsage from '../models/SteamUsage.js';

// Get all steam usage records
export const getAllSteamUsage = async (req, res) => {
    try {
        const { startDate, endDate, shift, machine_id } = req.query;
        let query = {};

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }
        if (shift) query.shift = shift;
        if (machine_id) query.machine_id = machine_id;

        const records = await SteamUsage.find(query).sort({ date: -1 });
        res.json({
            success: true,
            count: records.length,
            data: records
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get single steam usage record
export const getSteamUsage = async (req, res) => {
    try {
        const record = await SteamUsage.findById(req.params.id);
        if (!record) {
            return res.status(404).json({ success: false, error: 'Record not found' });
        }
        res.json({ success: true, data: record });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Create new steam usage record
export const createSteamUsage = async (req, res) => {
    try {
        const record = await SteamUsage.create(req.body);
        res.status(201).json({ success: true, data: record });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Update steam usage record
export const updateSteamUsage = async (req, res) => {
    try {
        const record = await SteamUsage.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!record) {
            return res.status(404).json({ success: false, error: 'Record not found' });
        }
        res.json({ success: true, data: record });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Delete steam usage record
export const deleteSteamUsage = async (req, res) => {
    try {
        const record = await SteamUsage.findByIdAndDelete(req.params.id);
        if (!record) {
            return res.status(404).json({ success: false, error: 'Record not found' });
        }
        res.json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Bulk create steam usage records
export const bulkCreateSteamUsage = async (req, res) => {
    try {
        const records = await SteamUsage.insertMany(req.body);
        res.status(201).json({
            success: true,
            count: records.length,
            data: records
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
