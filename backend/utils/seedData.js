import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Machine from '../models/Machine.js';
import SteamUsage from '../models/SteamUsage.js';
import WaterUsage from '../models/WaterUsage.js';
import FabricEfficiency from '../models/FabricEfficiency.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB error:', err));

// Helper function to generate random date within range
const randomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper function to get random element from array
const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Sample data
const seedData = async () => {
    try {
        // Clear existing data
        await Machine.deleteMany({});
        await SteamUsage.deleteMany({});
        await WaterUsage.deleteMany({});
        await FabricEfficiency.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Create machines
        const machines = [
            { machine_id: 'SF-001', machine_type: 'Softflow', capacity_kg: 500, status: 'Running', installation_date: new Date('2020-01-15'), last_maintenance_date: new Date('2025-12-01') },
            { machine_id: 'SF-002', machine_type: 'Softflow', capacity_kg: 500, status: 'Running', installation_date: new Date('2020-03-20'), last_maintenance_date: new Date('2025-11-15') },
            { machine_id: 'SF-003', machine_type: 'Softflow', capacity_kg: 450, status: 'Idle', installation_date: new Date('2021-06-10'), last_maintenance_date: new Date('2025-10-20') },
            { machine_id: 'SF-004', machine_type: 'Softflow', capacity_kg: 500, status: 'Running', installation_date: new Date('2021-08-05'), last_maintenance_date: new Date('2026-01-10') },
            { machine_id: 'SF-005', machine_type: 'Softflow', capacity_kg: 450, status: 'Breakdown', installation_date: new Date('2022-02-12'), last_maintenance_date: new Date('2025-09-05') },
            { machine_id: 'WN-001', machine_type: 'Winch', capacity_kg: 300, status: 'Running', installation_date: new Date('2019-05-20'), last_maintenance_date: new Date('2025-12-20') },
            { machine_id: 'WN-002', machine_type: 'Winch', capacity_kg: 300, status: 'Running', installation_date: new Date('2020-07-15'), last_maintenance_date: new Date('2025-11-25') },
            { machine_id: 'WN-003', machine_type: 'Winch', capacity_kg: 350, status: 'Idle', installation_date: new Date('2021-11-30'), last_maintenance_date: new Date('2025-12-28') }
        ];

        await Machine.insertMany(machines);
        console.log('✅ Created 8 machines');

        // Generate data for last 6 months
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 6);

        const shifts = ['A', 'B', 'C'];
        const steamRecords = [];
        const waterRecords = [];
        const fabricRecords = [];
        let orderCounter = 1000;

        // Generate 500 records
        for (let i = 0; i < 500; i++) {
            const date = randomDate(startDate, endDate);
            const machine = randomElement(machines.filter(m => m.status !== 'Breakdown'));
            const shift = randomElement(shifts);
            const orderId = `ORD-${orderCounter++}`;

            // Fabric amount (60-90% of machine capacity)
            const fabricKg = Math.floor(machine.capacity_kg * (0.6 + Math.random() * 0.3));

            // Steam usage (1.2-2.0 kg steam per kg fabric, Softflow is more efficient)
            const steamPerKg = machine.machine_type === 'Softflow'
                ? 1.2 + Math.random() * 0.5
                : 1.5 + Math.random() * 0.5;
            const steamUsed = Math.floor(fabricKg * steamPerKg);

            // Batch time (2-6 hours)
            const batchTime = 2 + Math.random() * 4;

            steamRecords.push({
                order_id: orderId,
                machine_id: machine.machine_id,
                fabric_kg: fabricKg,
                steam_used_kg: steamUsed,
                batch_time_hr: parseFloat(batchTime.toFixed(2)),
                shift: shift,
                date: date
            });

            // Water usage (15-25 liters per kg fabric)
            const waterPerKg = 15 + Math.random() * 10;
            const totalWater = fabricKg * waterPerKg;

            // Recycling percentage (50-80%)
            const recyclingPct = 0.5 + Math.random() * 0.3;
            const recycledWater = Math.floor(totalWater * recyclingPct);
            const freshWater = Math.floor(totalWater - recycledWater);

            waterRecords.push({
                order_id: orderId,
                machine_id: machine.machine_id,
                fabric_kg: fabricKg,
                fresh_water_ltr: freshWater,
                recycled_water_ltr: recycledWater,
                usage_date: date,
                shift: shift
            });

            // Fabric efficiency (92-98% efficiency)
            const fabricInput = fabricKg;
            const efficiencyPct = 0.92 + Math.random() * 0.06;
            const fabricOutput = Math.floor(fabricInput * efficiencyPct);

            // Rejection (1-4% of input)
            const rejectionPct = 0.01 + Math.random() * 0.03;
            const rejection = Math.floor(fabricInput * rejectionPct);

            fabricRecords.push({
                order_id: orderId,
                fabric_input_kg: fabricInput,
                fabric_output_kg: fabricOutput,
                rejection_kg: rejection,
                date: date
            });
        }

        await SteamUsage.insertMany(steamRecords);
        console.log('✅ Created 500 steam usage records');

        await WaterUsage.insertMany(waterRecords);
        console.log('✅ Created 500 water usage records');

        await FabricEfficiency.insertMany(fabricRecords);
        console.log('✅ Created 500 fabric efficiency records');

        console.log('\n🎉 Database seeded successfully!');
        console.log('📊 Summary:');
        console.log(`   - Machines: ${machines.length}`);
        console.log(`   - Steam Usage Records: ${steamRecords.length}`);
        console.log(`   - Water Usage Records: ${waterRecords.length}`);
        console.log(`   - Fabric Efficiency Records: ${fabricRecords.length}`);
        console.log(`   - Date Range: ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
