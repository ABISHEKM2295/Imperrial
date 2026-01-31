const mongoose = require('mongoose');
const SteamUsage = require('./models/SteamUsage');
const WaterUsage = require('./models/WaterUsage');

mongoose.connect('mongodb://localhost:27017/imperrial_analytics')
    .then(async () => {
        console.log('Connected to MongoDB');

        const today = new Date();
        today.setHours(8, 0, 0, 0); // 8 AM today

        // Add steam usage for today
        const steamRecords = [
            {
                order_id: 'ORD-TODAY-001',
                machine_id: 'SF-001',
                fabric_kg: 450,
                steam_used_kg: 630,
                batch_time_hr: 4.5,
                shift: 'A',
                date: today
            },
            {
                order_id: 'ORD-TODAY-002',
                machine_id: 'SF-002',
                fabric_kg: 480,
                steam_used_kg: 672,
                batch_time_hr: 4.8,
                shift: 'A',
                date: today
            },
            {
                order_id: 'ORD-TODAY-003',
                machine_id: 'WN-001',
                fabric_kg: 320,
                steam_used_kg: 544,
                batch_time_hr: 5.2,
                shift: 'B',
                date: today
            }
        ];

        await SteamUsage.insertMany(steamRecords);
        console.log('✅ Added', steamRecords.length, 'steam usage records for today');

        // Add water usage for today
        const waterRecords = [
            {
                order_id: 'ORD-TODAY-001',
                machine_id: 'SF-001',
                fabric_kg: 450,
                fresh_water_liters: 4500,
                recycled_water_liters: 9000,
                date: today
            },
            {
                order_id: 'ORD-TODAY-002',
                machine_id: 'SF-002',
                fabric_kg: 480,
                fresh_water_liters: 4800,
                recycled_water_liters: 9600,
                date: today
            },
            {
                order_id: 'ORD-TODAY-003',
                machine_id: 'WN-001',
                fabric_kg: 320,
                fresh_water_liters: 3200,
                recycled_water_liters: 6400,
                date: today
            }
        ];

        await WaterUsage.insertMany(waterRecords);
        console.log('✅ Added', waterRecords.length, 'water usage records for today');

        console.log('\n🎉 Today\'s data added successfully!');
        console.log('📊 Total fabric processed today:', steamRecords.reduce((sum, r) => sum + r.fabric_kg, 0), 'kg');
        console.log('💧 Total water used today:', waterRecords.reduce((sum, r) => sum + r.fresh_water_liters + r.recycled_water_liters, 0), 'liters');

        process.exit(0);
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
