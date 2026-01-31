# Imperrial Analytics - Textile Manufacturing Data Analysis System

A comprehensive MERN stack application for analyzing textile manufacturing operations at Imperrial Group of Companies, focusing on process efficiency and water inventory management.

## 🎯 Features

### Process Efficiency Analysis
- **Steam Usage Monitoring**: Track steam consumption per machine, shift, and batch
- **Fabric Quality Metrics**: Monitor fabric efficiency and rejection rates
- **Machine Utilization**: Real-time machine status and performance tracking
- **Shift-wise Analysis**: Compare performance across different shifts (A/B/C)

### Water Inventory Management
- **Water Usage Tracking**: Monitor fresh and recycled water consumption
- **Recycling Efficiency**: Calculate and visualize water recycling percentages
- **Cost Analysis**: Track water usage costs and savings from recycling
- **Environmental Impact**: Support sustainability initiatives with detailed water metrics

### Interactive Dashboards
- Real-time KPI monitoring
- Beautiful charts and visualizations using Recharts
- Machine status overview
- Daily/weekly/monthly trend analysis
- Customizable date range filters

## 🛠️ Tech Stack

### Backend
- **Node.js** & **Express.js**: RESTful API server
- **MongoDB**: NoSQL database for flexible data storage
- **Mongoose**: ODM for MongoDB
- **ES6 Modules**: Modern JavaScript syntax

### Frontend
- **React 18**: Modern UI library
- **Vite**: Fast build tool and dev server
- **React Router**: Client-side routing
- **Recharts**: Beautiful, responsive charts
- **Lucide React**: Modern icon library
- **Axios**: HTTP client for API calls

## 📁 Project Structure

```
imperrial-analytics/
├── backend/
│   ├── controllers/          # Request handlers
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API routes
│   ├── utils/               # Utilities (data seeding, etc.)
│   ├── server.js            # Express server
│   ├── package.json
│   └── .env                 # Environment variables
│
└── frontend/
    ├── src/
    │   ├── components/      # Reusable components
    │   ├── pages/           # Page components
    │   ├── services/        # API service layer
    │   ├── App.jsx          # Main app component
    │   └── main.jsx         # Entry point
    ├── package.json
    └── vite.config.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd d:/ABI/projects/consuldency/imperrial-analytics
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure Environment Variables**
   
   Edit `backend/.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/imperrial-analytics
   JWT_SECRET=your_secret_key
   NODE_ENV=development
   ```

5. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running on your system
   mongod
   ```

6. **Seed the Database** (Optional - for testing)
   ```bash
   cd backend
   npm run seed
   ```
   This will create:
   - 8 machines (5 Softflow, 3 Winch)
   - 500 steam usage records
   - 500 water usage records
   - 500 fabric efficiency records
   - Data spanning the last 6 months

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Server will run on `http://localhost:5000`

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   App will run on `http://localhost:5173`

3. **Access the Application**
   
   Open your browser and navigate to `http://localhost:5173`

## 📊 API Endpoints

### Machines
- `GET /api/machines` - Get all machines
- `GET /api/machines/:id` - Get single machine
- `POST /api/machines` - Create new machine
- `PUT /api/machines/:id` - Update machine
- `DELETE /api/machines/:id` - Delete machine
- `GET /api/machines/status/:status` - Get machines by status
- `GET /api/machines/maintenance/due` - Get machines needing maintenance

### Steam Usage
- `GET /api/steam-usage` - Get all steam usage records (with filters)
- `POST /api/steam-usage` - Create new record
- `POST /api/steam-usage/bulk` - Bulk create records

### Water Usage
- `GET /api/water-usage` - Get all water usage records (with filters)
- `POST /api/water-usage` - Create new record
- `POST /api/water-usage/bulk` - Bulk create records

### Fabric Efficiency
- `GET /api/fabric-efficiency` - Get all fabric efficiency records
- `POST /api/fabric-efficiency` - Create new record
- `POST /api/fabric-efficiency/bulk` - Bulk create records

### Analytics
- `GET /api/analytics/dashboard` - Dashboard overview KPIs
- `GET /api/analytics/steam-efficiency` - Steam efficiency analytics
- `GET /api/analytics/water-management` - Water management analytics
- `GET /api/analytics/fabric-quality` - Fabric quality analytics
- `GET /api/analytics/machine-utilization` - Machine utilization analytics

## 📱 Application Pages

1. **Dashboard** - Overview with KPIs, machine status, and today's summary
2. **Steam Efficiency** - Steam usage trends, machine comparison, shift analysis
3. **Water Management** - Water usage breakdown, recycling metrics, cost analysis
4. **Fabric Quality** - Efficiency trends, rejection rates, production volume
5. **Machine Performance** - Machine status cards, utilization metrics
6. **Data Entry** - Forms to input new production data

## 🎨 Design Features

- **Modern UI**: Glassmorphism effects, gradient backgrounds
- **Responsive**: Works on desktop, tablet, and mobile
- **Interactive Charts**: Hover effects, tooltips, legends
- **Real-time Updates**: Refresh button to fetch latest data
- **Color-coded Status**: Visual indicators for machine status
- **Date Filters**: Customizable date ranges for analytics

## 📈 Key Metrics Tracked

### Steam Efficiency
- Steam consumption per kg of fabric
- Machine-wise steam efficiency
- Shift-wise performance
- Daily trends and forecasts

### Water Management
- Fresh vs recycled water ratio
- Water consumption per kg fabric
- Recycling efficiency percentage
- Cost savings from recycling

### Fabric Quality
- Fabric yield percentage (output/input)
- Rejection rate
- Quality trends over time
- Waste percentage

### Machine Utilization
- Machine uptime percentage
- Capacity utilization rate
- Breakdown frequency
- Maintenance scheduling

## 🔒 Data Models

### Machine
- machine_id, machine_type, capacity_kg, status
- installation_date, last_maintenance_date

### Steam Usage
- order_id, machine_id, fabric_kg, steam_used_kg
- batch_time_hr, shift, date

### Water Usage
- order_id, machine_id, fabric_kg
- fresh_water_ltr, recycled_water_ltr
- usage_date, shift

### Fabric Efficiency
- order_id, fabric_input_kg, fabric_output_kg
- rejection_kg, date

## 🤝 Contributing

This project is developed for Imperrial Group of Companies. For internal use only.

## 📄 License

Proprietary - Imperrial Group of Companies

## 👥 About Imperrial Group

Imperrial Group of Companies is a leading textile manufacturing company in Erode, Tamil Nadu, specializing in:
- Dyeing (750+ tons/month capacity)
- Knitting (100+ circular machines)
- Fabric Manufacturing (Cotton, Viscose, Polyester)
- Cutting (100,000 pieces/month)

With a strong focus on sustainability through advanced water recycling (3-stage RO process) and effluent treatment systems.

---

**Developed with ❤️ for sustainable textile manufacturing**
