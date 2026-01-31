import { useState, useEffect } from 'react';
import { getMachines, createSteamUsage, createWaterUsage, createFabricEfficiency } from '../services/api';
import { Save, Plus } from 'lucide-react';
import './DataEntry.css';

const DataEntry = () => {
    const [machines, setMachines] = useState([]);
    const [activeTab, setActiveTab] = useState('steam');
    const [formData, setFormData] = useState({
        order_id: '',
        machine_id: '',
        fabric_kg: '',
        steam_used_kg: '',
        batch_time_hr: '',
        shift: 'A',
        date: new Date().toISOString().split('T')[0],
        fresh_water_ltr: '',
        recycled_water_ltr: '',
        fabric_input_kg: '',
        fabric_output_kg: '',
        rejection_kg: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchMachines();
    }, []);

    const fetchMachines = async () => {
        try {
            const response = await getMachines();
            setMachines(response.data.data);
        } catch (error) {
            console.error('Error fetching machines:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        try {
            if (activeTab === 'steam') {
                await createSteamUsage({
                    order_id: formData.order_id,
                    machine_id: formData.machine_id,
                    fabric_kg: parseFloat(formData.fabric_kg),
                    steam_used_kg: parseFloat(formData.steam_used_kg),
                    batch_time_hr: parseFloat(formData.batch_time_hr),
                    shift: formData.shift,
                    date: formData.date
                });
            } else if (activeTab === 'water') {
                await createWaterUsage({
                    order_id: formData.order_id,
                    machine_id: formData.machine_id,
                    fabric_kg: parseFloat(formData.fabric_kg),
                    fresh_water_ltr: parseFloat(formData.fresh_water_ltr),
                    recycled_water_ltr: parseFloat(formData.recycled_water_ltr),
                    usage_date: formData.date,
                    shift: formData.shift
                });
            } else if (activeTab === 'fabric') {
                await createFabricEfficiency({
                    order_id: formData.order_id,
                    fabric_input_kg: parseFloat(formData.fabric_input_kg),
                    fabric_output_kg: parseFloat(formData.fabric_output_kg),
                    rejection_kg: parseFloat(formData.rejection_kg),
                    date: formData.date
                });
            }

            setMessage({ type: 'success', text: 'Data saved successfully!' });
            // Reset form
            setFormData({
                ...formData,
                order_id: '',
                fabric_kg: '',
                steam_used_kg: '',
                batch_time_hr: '',
                fresh_water_ltr: '',
                recycled_water_ltr: '',
                fabric_input_kg: '',
                fabric_output_kg: '',
                rejection_kg: ''
            });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save data. Please check your inputs.' });
            console.error('Error saving data:', error);
        }
    };

    return (
        <div className="data-entry-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Data Entry</h1>
                    <p className="page-subtitle">Record production data</p>
                </div>
            </div>

            <div className="entry-container">
                {/* Tabs */}
                <div className="tabs">
                    <button
                        className={`tab ${activeTab === 'steam' ? 'active' : ''}`}
                        onClick={() => setActiveTab('steam')}
                    >
                        Steam Usage
                    </button>
                    <button
                        className={`tab ${activeTab === 'water' ? 'active' : ''}`}
                        onClick={() => setActiveTab('water')}
                    >
                        Water Usage
                    </button>
                    <button
                        className={`tab ${activeTab === 'fabric' ? 'active' : ''}`}
                        onClick={() => setActiveTab('fabric')}
                    >
                        Fabric Efficiency
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="entry-form">
                    {message.text && (
                        <div className={`message ${message.type}`}>
                            {message.text}
                        </div>
                    )}

                    {/* Common Fields */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Order ID *</label>
                            <input
                                type="text"
                                name="order_id"
                                value={formData.order_id}
                                onChange={handleChange}
                                required
                                placeholder="e.g., ORD-1001"
                            />
                        </div>

                        <div className="form-group">
                            <label>Date *</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Steam Usage Fields */}
                    {activeTab === 'steam' && (
                        <>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Machine *</label>
                                    <select
                                        name="machine_id"
                                        value={formData.machine_id}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Machine</option>
                                        {machines.map((m) => (
                                            <option key={m.machine_id} value={m.machine_id}>
                                                {m.machine_id} - {m.machine_type}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Shift *</label>
                                    <select
                                        name="shift"
                                        value={formData.shift}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="A">Shift A</option>
                                        <option value="B">Shift B</option>
                                        <option value="C">Shift C</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Fabric (kg) *</label>
                                    <input
                                        type="number"
                                        name="fabric_kg"
                                        value={formData.fabric_kg}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        step="0.01"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Steam Used (kg) *</label>
                                    <input
                                        type="number"
                                        name="steam_used_kg"
                                        value={formData.steam_used_kg}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        step="0.01"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Batch Time (hours) *</label>
                                    <input
                                        type="number"
                                        name="batch_time_hr"
                                        value={formData.batch_time_hr}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        step="0.1"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Water Usage Fields */}
                    {activeTab === 'water' && (
                        <>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Machine *</label>
                                    <select
                                        name="machine_id"
                                        value={formData.machine_id}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Machine</option>
                                        {machines.map((m) => (
                                            <option key={m.machine_id} value={m.machine_id}>
                                                {m.machine_id} - {m.machine_type}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Shift *</label>
                                    <select
                                        name="shift"
                                        value={formData.shift}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="A">Shift A</option>
                                        <option value="B">Shift B</option>
                                        <option value="C">Shift C</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Fabric (kg) *</label>
                                    <input
                                        type="number"
                                        name="fabric_kg"
                                        value={formData.fabric_kg}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        step="0.01"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Fresh Water (liters) *</label>
                                    <input
                                        type="number"
                                        name="fresh_water_ltr"
                                        value={formData.fresh_water_ltr}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        step="0.01"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Recycled Water (liters) *</label>
                                    <input
                                        type="number"
                                        name="recycled_water_ltr"
                                        value={formData.recycled_water_ltr}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Fabric Efficiency Fields */}
                    {activeTab === 'fabric' && (
                        <div className="form-row">
                            <div className="form-group">
                                <label>Fabric Input (kg) *</label>
                                <input
                                    type="number"
                                    name="fabric_input_kg"
                                    value={formData.fabric_input_kg}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            <div className="form-group">
                                <label>Fabric Output (kg) *</label>
                                <input
                                    type="number"
                                    name="fabric_output_kg"
                                    value={formData.fabric_output_kg}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            <div className="form-group">
                                <label>Rejection (kg) *</label>
                                <input
                                    type="number"
                                    name="rejection_kg"
                                    value={formData.rejection_kg}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        </div>
                    )}

                    <button type="submit" className="submit-btn">
                        <Save size={20} />
                        Save Data
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DataEntry;
