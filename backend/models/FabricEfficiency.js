import mongoose from 'mongoose';

const fabricEfficiencySchema = new mongoose.Schema({
    order_id: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    fabric_input_kg: {
        type: Number,
        required: true,
        min: 0
    },
    fabric_output_kg: {
        type: Number,
        required: true,
        min: 0
    },
    rejection_kg: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

// Virtual for efficiency percentage
fabricEfficiencySchema.virtual('efficiency_percentage').get(function () {
    return this.fabric_input_kg > 0 ? ((this.fabric_output_kg / this.fabric_input_kg) * 100).toFixed(2) : 0;
});

// Virtual for rejection rate
fabricEfficiencySchema.virtual('rejection_rate').get(function () {
    return this.fabric_input_kg > 0 ? ((this.rejection_kg / this.fabric_input_kg) * 100).toFixed(2) : 0;
});

// Virtual for waste percentage
fabricEfficiencySchema.virtual('waste_percentage').get(function () {
    const accounted = this.fabric_output_kg + this.rejection_kg;
    const waste = this.fabric_input_kg - accounted;
    return this.fabric_input_kg > 0 ? ((waste / this.fabric_input_kg) * 100).toFixed(2) : 0;
});

// Pre-save validation
fabricEfficiencySchema.pre('save', function (next) {
    if (this.fabric_output_kg + this.rejection_kg > this.fabric_input_kg) {
        next(new Error('Output + Rejection cannot exceed Input'));
    }
    next();
});

// Index for faster queries
fabricEfficiencySchema.index({ date: -1 });
fabricEfficiencySchema.index({ order_id: 1 });

const FabricEfficiency = mongoose.model('FabricEfficiency', fabricEfficiencySchema);

export default FabricEfficiency;
