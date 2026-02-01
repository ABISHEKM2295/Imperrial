import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add interceptor to include token in requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth
export const signup = (data) => api.post('/auth/signup', data);
export const login = (data) => api.post('/auth/login', data);
export const getCurrentUser = () => api.get('/auth/me');

// Machines
export const getMachines = () => api.get('/machines');
export const createMachine = (data) => api.post('/machines', data);
export const updateMachine = (id, data) => api.put(`/machines/${id}`, data);
export const deleteMachine = (id) => api.delete(`/machines/${id}`);

// Steam Usage
export const getSteamUsage = (params) => api.get('/steam-usage', { params });
export const createSteamUsage = (data) => api.post('/steam-usage', data);
export const updateSteamUsage = (id, data) => api.put(`/steam-usage/${id}`, data);
export const deleteSteamUsage = (id) => api.delete(`/steam-usage/${id}`);

// Water Usage
export const getWaterUsage = (params) => api.get('/water-usage', { params });
export const createWaterUsage = (data) => api.post('/water-usage', data);
export const updateWaterUsage = (id, data) => api.put(`/water-usage/${id}`, data);
export const deleteWaterUsage = (id) => api.delete(`/water-usage/${id}`);

// Fabric Efficiency
export const getFabricEfficiency = (params) => api.get('/fabric-efficiency', { params });
export const createFabricEfficiency = (data) => api.post('/fabric-efficiency', data);
export const updateFabricEfficiency = (id, data) => api.put(`/fabric-efficiency/${id}`, data);
export const deleteFabricEfficiency = (id) => api.delete(`/fabric-efficiency/${id}`);

// Analytics
export const getDashboardOverview = () => api.get('/analytics/dashboard');
export const getSteamEfficiencyAnalytics = (params) => api.get('/analytics/steam-efficiency', { params });
export const getWaterManagementAnalytics = (params) => api.get('/analytics/water-management', { params });
export const getFabricQualityAnalytics = (params) => api.get('/analytics/fabric-quality', { params });
export const getMachineUtilization = (params) => api.get('/analytics/machine-utilization', { params });

export default api;
