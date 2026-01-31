import mongoose from 'mongoose';

const steamUsageSchema = new mongoose.Schema({
    order_id: {
        type: String,
        required: true,
        trim: true
    },
    machine_id: {
        type: String,
        required: true,
        ref: 'Machine'
    },
    fabric_kg: {
        type: Number,
        required: true,
        min: 0
    },
    steam_used_kg: {
        type: Number,
        required: true,
        min: 0
    },
    batch_time_hr: {
        type: Number,
        required: true,
        min: 0
    },
    shift: {
        type: String,
        required: true,
        enum: ['A', 'B', 'C']
    },
    date: {
        type: Date,
        required: true
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

// Virtual for steam efficiency (steam per kg of fabric)
steamUsageSchema.virtual('steam_efficiency').get(function () {
    return this.fabric_kg > 0 ? (this.steam_used_kg / this.fabric_kg).toFixed(2) : 0;
});

// Virtual for processing rate (kg per hour)
steamUsageSchema.virtual('processing_rate').get(function () {
    return this.batch_time_hr > 0 ? (this.fabric_kg / this.batch_time_hr).toFixed(2) : 0;
});

// Index for faster queries
steamUsageSchema.index({ date: -1, shift: 1 });
steamUsageSchema.index({ machine_id: 1, date: -1 });

const SteamUsage = mongoose.model('SteamUsage', steamUsageSchema);

export default SteamUsage;
