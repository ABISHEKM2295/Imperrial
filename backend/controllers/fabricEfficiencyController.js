import FabricEfficiency from '../models/FabricEfficiency.js';

// Get all fabric efficiency records
export const getAllFabricEfficiency = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let query = {};

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const records = await FabricEfficiency.find(query).sort({ date: -1 });
        res.json({
            success: true,
            count: records.length,
            data: records
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get single fabric efficiency record
export const getFabricEfficiency = async (req, res) => {
    try {
        const record = await FabricEfficiency.findOne({ order_id: req.params.orderId });
        if (!record) {
            return res.status(404).json({ success: false, error: 'Record not found' });
        }
        res.json({ success: true, data: record });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Create new fabric efficiency record
export const createFabricEfficiency = async (req, res) => {
    try {
        const record = await FabricEfficiency.create(req.body);
        res.status(201).json({ success: true, data: record });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Update fabric efficiency record
export const updateFabricEfficiency = async (req, res) => {
    try {
        const record = await FabricEfficiency.findOneAndUpdate(
            { order_id: req.params.orderId },
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

// Delete fabric efficiency record
export const deleteFabricEfficiency = async (req, res) => {
    try {
        const record = await FabricEfficiency.findOneAndDelete({ order_id: req.params.orderId });
        if (!record) {
            return res.status(404).json({ success: false, error: 'Record not found' });
        }
        res.json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Bulk create fabric efficiency records
export const bulkCreateFabricEfficiency = async (req, res) => {
    try {
        const records = await FabricEfficiency.insertMany(req.body);
        res.status(201).json({
            success: true,
            count: records.length,
            data: records
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
