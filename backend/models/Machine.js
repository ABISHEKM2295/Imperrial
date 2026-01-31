import mongoose from 'mongoose';

const machineSchema = new mongoose.Schema({
    machine_id: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    machine_type: {
        type: String,
        required: true,
        enum: ['Softflow', 'Winch'],
        trim: true
    },
    capacity_kg: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        required: true,
        enum: ['Running', 'Idle', 'Breakdown'],
        default: 'Idle'
    },
    installation_date: {
        type: Date,
        default: Date.now
    },
    last_maintenance_date: {
        type: Date
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

// Virtual for machine age
machineSchema.virtual('age_years').get(function () {
    const now = new Date();
    const installed = new Date(this.installation_date);
    return Math.floor((now - installed) / (365.25 * 24 * 60 * 60 * 1000));
});

// Method to check if maintenance is due (every 3 months)
machineSchema.methods.isMaintenanceDue = function () {
    if (!this.last_maintenance_date) return true;
    const now = new Date();
    const lastMaintenance = new Date(this.last_maintenance_date);
    const daysSinceLastMaintenance = (now - lastMaintenance) / (24 * 60 * 60 * 1000);
    return daysSinceLastMaintenance > 90; // 3 months
};

const Machine = mongoose.model('Machine', machineSchema);

export default Machine;
