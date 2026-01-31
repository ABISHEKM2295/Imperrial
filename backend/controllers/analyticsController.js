import SteamUsage from '../models/SteamUsage.js';
import WaterUsage from '../models/WaterUsage.js';
import FabricEfficiency from '../models/FabricEfficiency.js';
import Machine from '../models/Machine.js';

// Dashboard Overview - KPIs
export const getDashboardOverview = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Machine status counts
        const machineStats = await Machine.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Today's production
        const todayProduction = await SteamUsage.aggregate([
            {
                $match: { date: { $gte: today } }
            },
            {
                $group: {
                    _id: null,
                    total_fabric_kg: { $sum: '$fabric_kg' },
                    total_steam_kg: { $sum: '$steam_used_kg' },
                    batch_count: { $sum: 1 }
                }
            }
        ]);

        // Today's water usage
        const todayWater = await WaterUsage.aggregate([
            {
                $match: { usage_date: { $gte: today } }
            },
            {
                $group: {
                    _id: null,
                    total_fresh_water: { $sum: '$fresh_water_ltr' },
                    total_recycled_water: { $sum: '$recycled_water_ltr' }
                }
            }
        ]);

        // Average efficiency this month
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const avgEfficiency = await FabricEfficiency.aggregate([
            {
                $match: { date: { $gte: monthStart } }
            },
            {
                $group: {
                    _id: null,
                    avg_efficiency: {
                        $avg: {
                            $multiply: [
                                { $divide: ['$fabric_output_kg', '$fabric_input_kg'] },
                                100
                            ]
                        }
                    },
                    avg_rejection_rate: {
                        $avg: {
                            $multiply: [
                                { $divide: ['$rejection_kg', '$fabric_input_kg'] },
                                100
                            ]
                        }
                    }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                machines: machineStats,
                today_production: todayProduction[0] || {},
                today_water: todayWater[0] || {},
                month_efficiency: avgEfficiency[0] || {}
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Steam Efficiency Analytics
export const getSteamEfficiencyAnalytics = async (req, res) => {
    try {
        const { startDate, endDate, machine_id, shift } = req.query;
        let matchQuery = {};

        if (startDate || endDate) {
            matchQuery.date = {};
            if (startDate) matchQuery.date.$gte = new Date(startDate);
            if (endDate) matchQuery.date.$lte = new Date(endDate);
        }
        if (machine_id) matchQuery.machine_id = machine_id;
        if (shift) matchQuery.shift = shift;

        // Average steam efficiency by machine
        const byMachine = await SteamUsage.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: '$machine_id',
                    avg_steam_per_kg: {
                        $avg: { $divide: ['$steam_used_kg', '$fabric_kg'] }
                    },
                    total_fabric: { $sum: '$fabric_kg' },
                    total_steam: { $sum: '$steam_used_kg' },
                    batch_count: { $sum: 1 }
                }
            },
            { $sort: { avg_steam_per_kg: 1 } }
        ]);

        // Daily trends
        const dailyTrends = await SteamUsage.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
                    total_fabric: { $sum: '$fabric_kg' },
                    total_steam: { $sum: '$steam_used_kg' },
                    avg_efficiency: {
                        $avg: { $divide: ['$steam_used_kg', '$fabric_kg'] }
                    }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Shift-wise comparison
        const byShift = await SteamUsage.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: '$shift',
                    avg_steam_per_kg: {
                        $avg: { $divide: ['$steam_used_kg', '$fabric_kg'] }
                    },
                    total_fabric: { $sum: '$fabric_kg' },
                    batch_count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            success: true,
            data: {
                by_machine: byMachine,
                daily_trends: dailyTrends,
                by_shift: byShift
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Water Management Analytics
export const getWaterManagementAnalytics = async (req, res) => {
    try {
        const { startDate, endDate, machine_id, shift } = req.query;
        let matchQuery = {};

        if (startDate || endDate) {
            matchQuery.usage_date = {};
            if (startDate) matchQuery.usage_date.$gte = new Date(startDate);
            if (endDate) matchQuery.usage_date.$lte = new Date(endDate);
        }
        if (machine_id) matchQuery.machine_id = machine_id;
        if (shift) matchQuery.shift = shift;

        // Overall water statistics
        const overallStats = await WaterUsage.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: null,
                    total_fresh_water: { $sum: '$fresh_water_ltr' },
                    total_recycled_water: { $sum: '$recycled_water_ltr' },
                    total_fabric: { $sum: '$fabric_kg' }
                }
            },
            {
                $project: {
                    total_fresh_water: 1,
                    total_recycled_water: 1,
                    total_water: { $add: ['$total_fresh_water', '$total_recycled_water'] },
                    recycling_percentage: {
                        $multiply: [
                            {
                                $divide: [
                                    '$total_recycled_water',
                                    { $add: ['$total_fresh_water', '$total_recycled_water'] }
                                ]
                            },
                            100
                        ]
                    },
                    water_per_kg: {
                        $divide: [
                            { $add: ['$total_fresh_water', '$total_recycled_water'] },
                            '$total_fabric'
                        ]
                    }
                }
            }
        ]);

        // Daily water trends
        const dailyTrends = await WaterUsage.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$usage_date' } },
                    fresh_water: { $sum: '$fresh_water_ltr' },
                    recycled_water: { $sum: '$recycled_water_ltr' }
                }
            },
            {
                $project: {
                    fresh_water: 1,
                    recycled_water: 1,
                    total_water: { $add: ['$fresh_water', '$recycled_water'] },
                    recycling_pct: {
                        $multiply: [
                            {
                                $divide: [
                                    '$recycled_water',
                                    { $add: ['$fresh_water', '$recycled_water'] }
                                ]
                            },
                            100
                        ]
                    }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Machine-wise water consumption
        const byMachine = await WaterUsage.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: '$machine_id',
                    total_fresh: { $sum: '$fresh_water_ltr' },
                    total_recycled: { $sum: '$recycled_water_ltr' },
                    total_fabric: { $sum: '$fabric_kg' }
                }
            },
            {
                $project: {
                    total_fresh: 1,
                    total_recycled: 1,
                    water_per_kg: {
                        $divide: [
                            { $add: ['$total_fresh', '$total_recycled'] },
                            '$total_fabric'
                        ]
                    },
                    recycling_pct: {
                        $multiply: [
                            {
                                $divide: [
                                    '$total_recycled',
                                    { $add: ['$total_fresh', '$total_recycled'] }
                                ]
                            },
                            100
                        ]
                    }
                }
            },
            { $sort: { water_per_kg: 1 } }
        ]);

        // Shift-wise analysis
        const byShift = await WaterUsage.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: '$shift',
                    total_fresh: { $sum: '$fresh_water_ltr' },
                    total_recycled: { $sum: '$recycled_water_ltr' }
                }
            },
            {
                $project: {
                    total_fresh: 1,
                    total_recycled: 1,
                    recycling_pct: {
                        $multiply: [
                            {
                                $divide: [
                                    '$total_recycled',
                                    { $add: ['$total_fresh', '$total_recycled'] }
                                ]
                            },
                            100
                        ]
                    }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            success: true,
            data: {
                overall: overallStats[0] || {},
                daily_trends: dailyTrends,
                by_machine: byMachine,
                by_shift: byShift
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Fabric Quality Analytics
export const getFabricQualityAnalytics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let matchQuery = {};

        if (startDate || endDate) {
            matchQuery.date = {};
            if (startDate) matchQuery.date.$gte = new Date(startDate);
            if (endDate) matchQuery.date.$lte = new Date(endDate);
        }

        // Overall quality metrics
        const overallMetrics = await FabricEfficiency.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: null,
                    total_input: { $sum: '$fabric_input_kg' },
                    total_output: { $sum: '$fabric_output_kg' },
                    total_rejection: { $sum: '$rejection_kg' },
                    avg_efficiency: {
                        $avg: {
                            $multiply: [
                                { $divide: ['$fabric_output_kg', '$fabric_input_kg'] },
                                100
                            ]
                        }
                    },
                    avg_rejection_rate: {
                        $avg: {
                            $multiply: [
                                { $divide: ['$rejection_kg', '$fabric_input_kg'] },
                                100
                            ]
                        }
                    }
                }
            }
        ]);

        // Daily trends
        const dailyTrends = await FabricEfficiency.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
                    total_input: { $sum: '$fabric_input_kg' },
                    total_output: { $sum: '$fabric_output_kg' },
                    total_rejection: { $sum: '$rejection_kg' }
                }
            },
            {
                $project: {
                    total_input: 1,
                    total_output: 1,
                    total_rejection: 1,
                    efficiency_pct: {
                        $multiply: [
                            { $divide: ['$total_output', '$total_input'] },
                            100
                        ]
                    },
                    rejection_pct: {
                        $multiply: [
                            { $divide: ['$total_rejection', '$total_input'] },
                            100
                        ]
                    }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            success: true,
            data: {
                overall: overallMetrics[0] || {},
                daily_trends: dailyTrends
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Machine Utilization Analytics
export const getMachineUtilizationAnalytics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let matchQuery = {};

        if (startDate || endDate) {
            matchQuery.date = {};
            if (startDate) matchQuery.date.$gte = new Date(startDate);
            if (endDate) matchQuery.date.$lte = new Date(endDate);
        }

        // Get all machines
        const machines = await Machine.find();

        // Usage by machine
        const usageByMachine = await SteamUsage.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: '$machine_id',
                    total_batches: { $sum: 1 },
                    total_fabric: { $sum: '$fabric_kg' },
                    total_hours: { $sum: '$batch_time_hr' }
                }
            }
        ]);

        // Combine with machine capacity
        const utilization = machines.map(machine => {
            const usage = usageByMachine.find(u => u._id === machine.machine_id) || {
                total_batches: 0,
                total_fabric: 0,
                total_hours: 0
            };

            return {
                machine_id: machine.machine_id,
                machine_type: machine.machine_type,
                capacity_kg: machine.capacity_kg,
                status: machine.status,
                total_batches: usage.total_batches,
                total_fabric: usage.total_fabric,
                total_hours: usage.total_hours,
                avg_fabric_per_batch: usage.total_batches > 0
                    ? (usage.total_fabric / usage.total_batches).toFixed(2)
                    : 0,
                capacity_utilization_pct: machine.capacity_kg > 0
                    ? ((usage.total_fabric / (usage.total_batches * machine.capacity_kg)) * 100).toFixed(2)
                    : 0
            };
        });

        res.json({
            success: true,
            data: utilization
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
