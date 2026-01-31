# Quick Start Guide - Imperrial Analytics

## ✅ Setup Complete!

Your MERN stack application is ready to use. Here's what to do:

## 🚀 Running the Application

### Backend Server (Already Running ✓)
The backend is running on **http://localhost:5000**

To verify:
- Open browser: http://localhost:5000/api/health
- Should see: `{"status":"OK","message":"Imperrial Analytics API is running"}`

### Frontend Application (Already Running ✓)
The frontend is running on **http://localhost:5173**

**The page should now show the Imperrial Analytics dashboard!**

If you still see the Vite template:
1. Stop the frontend dev server (Ctrl+C)
2. Restart it: `npm run dev`
3. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

## 📊 What You Should See

1. **Purple gradient background**
2. **Sidebar navigation** on the left with:
   - Dashboard
   - Steam Efficiency
   - Water Management
   - Fabric Quality
   - Machines
   - Data Entry

3. **Dashboard page** showing:
   - 4 KPI cards (Production, Active Machines, Water Recycling, Efficiency)
   - Machine status (Running/Idle/Breakdown)
   - Today's summary

## 🎯 Quick Test

1. **Navigate to Dashboard** - See KPIs and machine status
2. **Click "Steam Efficiency"** - View charts and trends
3. **Click "Water Management"** - See water usage breakdown
4. **Click "Data Entry"** - Try adding new data

## 🔧 Troubleshooting

### Issue: Still seeing Vite template
**Solution:**
```bash
# Stop frontend (Ctrl+C)
# Then restart:
cd frontend
npm run dev
```
Hard refresh browser (Ctrl+Shift+R)

### Issue: "Cannot connect to backend"
**Solution:**
```bash
# Check if MongoDB is running
mongod

# Check if backend is running
cd backend
npm run dev
```

### Issue: No data showing
**Solution:**
```bash
# Re-seed the database
cd backend
npm run seed
```

## 📱 Navigation Guide

### Dashboard
- Overview of all metrics
- Real-time machine status
- Today's production summary

### Steam Efficiency
- Daily steam usage trends
- Machine-wise comparison
- Shift performance analysis

### Water Management
- Fresh vs recycled water breakdown
- Daily consumption trends
- Machine-wise water usage

### Fabric Quality
- Efficiency percentage trends
- Rejection rate tracking
- Production volume

### Machine Performance
- Machine status cards
- Utilization metrics
- Performance details

### Data Entry
- Add new steam usage data
- Add water usage records
- Add fabric efficiency data

## 🎨 Features to Try

1. **Date Filters**: Change date ranges on analytics pages
2. **Refresh Data**: Click refresh button on dashboard
3. **Add Data**: Use Data Entry page to add new records
4. **View Charts**: Hover over charts to see details

## 📞 Need Help?

Check the main README.md for:
- Full API documentation
- Database schema details
- Deployment instructions
- Advanced features

---

**Enjoy your data analysis system! 🎉**
