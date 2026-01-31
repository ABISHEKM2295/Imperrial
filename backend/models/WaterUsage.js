import mongoose from 'mongoose';

const waterUsageSchema = new mongoose.Schema({
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
    fresh_water_ltr: {
        type: Number,
        required: true,
        min: 0
    },
    recycled_water_ltr: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    usage_date: {
        type: Date,
        required: true
    },
    shift: {
        type: String,
        required: true,
        enum: ['A', 'B', 'C']
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

// Virtual for total water used
waterUsageSchema.virtual('total_water_ltr').get(function () {
    return this.fresh_water_ltr + this.recycled_water_ltr;
});

// Virtual for recycling percentage
waterUsageSchema.virtual('recycling_percentage').get(function () {
    const total = this.fresh_water_ltr + this.recycled_water_ltr;
    return total > 0 ? ((this.recycled_water_ltr / total) * 100).toFixed(2) : 0;
});

// Virtual for water consumption per kg fabric
waterUsageSchema.virtual('water_per_kg').get(function () {
    return this.fabric_kg > 0 ? ((this.fresh_water_ltr + this.recycled_water_ltr) / this.fabric_kg).toFixed(2) : 0;
});

// Index for faster queries
waterUsageSchema.index({ usage_date: -1, shift: 1 });
waterUsageSchema.index({ machine_id: 1, usage_date: -1 });

const WaterUsage = mongoose.model('WaterUsage', waterUsageSchema);

export default WaterUsage;
