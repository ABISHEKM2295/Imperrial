import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../services/api';
import { User, Mail, Lock, Building2, UserPlus } from 'lucide-react';
import './Signup.css';

const Signup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
        department: 'Other'
    });

    const departments = ['Production', 'Quality', 'Maintenance', 'Management', 'Other'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            setError('Name is required');
            return false;
        }
        if (formData.name.trim().length < 2) {
            setError('Name must be at least 2 characters');
            return false;
        }
        if (!formData.email.trim()) {
            setError('Email is required');
            return false;
        }
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
            setError('Please enter a valid email');
            return false;
        }
        if (!formData.password) {
            setError('Password is required');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        if (formData.password !== formData.passwordConfirm) {
            setError('Passwords do not match');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await signup(formData);
            
            if (response.data.success) {
                // Store token in localStorage
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
                // Redirect to dashboard
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Sign up failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-wrapper">
                <div className="signup-box">
                    <div className="signup-header">
                        <h1>Imperrial Analytics</h1>
                        <p>Textile Manufacturing System</p>
                    </div>

                    <form onSubmit={handleSubmit} className="signup-form">
                        <h2>Create Account</h2>
                        
                        {error && <div className="error-message">{error}</div>}

                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <div className="input-wrapper">
                                <User size={18} />
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-wrapper">
                                <Mail size={18} />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your@email.com"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="department">Department</label>
                            <div className="input-wrapper">
                                <Building2 size={18} />
                                <select
                                    id="department"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    disabled={loading}
                                >
                                    {departments.map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-wrapper">
                                <Lock size={18} />
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="passwordConfirm">Confirm Password</label>
                            <div className="input-wrapper">
                                <Lock size={18} />
                                <input
                                    type="password"
                                    id="passwordConfirm"
                                    name="passwordConfirm"
                                    value={formData.passwordConfirm}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="signup-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-small"></span>
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    <UserPlus size={18} />
                                    Sign Up
                                </>
                            )}
                        </button>
                    </form>

                    <div className="signup-footer">
                        <p>Already have an account? <Link to="/login">Login here</Link></p>
                    </div>
                </div>

                <div className="signup-background">
                    <div className="gradient-blob gradient-1"></div>
                    <div className="gradient-blob gradient-2"></div>
                    <div className="gradient-blob gradient-3"></div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
