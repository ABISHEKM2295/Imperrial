import WaterUsage from '../models/WaterUsage.js';

// Get all water usage records
export const getAllWaterUsage = async (req, res) => {
    try {
        const { startDate, endDate, shift, machine_id } = req.query;
        let query = {};

        if (startDate || endDate) {
            query.usage_date = {};
            if (startDate) query.usage_date.$gte = new Date(startDate);
            if (endDate) query.usage_date.$lte = new Date(endDate);
        }
        if (shift) query.shift = shift;
        if (machine_id) query.machine_id = machine_id;

        const records = await WaterUsage.find(query).sort({ usage_date: -1 });
        res.json({
            success: true,
            count: records.length,
            data: records
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get single water usage record
export const getWaterUsage = async (req, res) => {
    try {
        const record = await WaterUsage.findById(req.params.id);
        if (!record) {
            return res.status(404).json({ success: false, error: 'Record not found' });
        }
        res.json({ success: true, data: record });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Create new water usage record
export const createWaterUsage = async (req, res) => {
    try {
        const record = await WaterUsage.create(req.body);
        res.status(201).json({ success: true, data: record });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Update water usage record
export const updateWaterUsage = async (req, res) => {
    try {
        const record = await WaterUsage.findByIdAndUpdate(
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

// Delete water usage record
export const deleteWaterUsage = async (req, res) => {
    try {
        const record = await WaterUsage.findByIdAndDelete(req.params.id);
        if (!record) {
            return res.status(404).json({ success: false, error: 'Record not found' });
        }
        res.json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Bulk create water usage records
export const bulkCreateWaterUsage = async (req, res) => {
    try {
        const records = await WaterUsage.insertMany(req.body);
        res.status(201).json({
            success: true,
            count: records.length,
            data: records
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
