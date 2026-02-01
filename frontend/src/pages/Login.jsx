import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';
import { Mail, Lock, LogIn } from 'lucide-react';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await login(formData);
            
            if (response.data.success) {
                // Store token in localStorage
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
                // Redirect to dashboard
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-wrapper">
                <div className="login-box">
                    <div className="login-header">
                        <h1>Imperrial Analytics</h1>
                        <p>Textile Manufacturing System</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        <h2>Welcome Back</h2>
                        
                        {error && <div className="error-message">{error}</div>}

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

                        <button 
                            type="submit" 
                            className="login-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-small"></span>
                                    Logging in...
                                </>
                            ) : (
                                <>
                                    <LogIn size={18} />
                                    Login
                                </>
                            )}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>Don't have an account? <Link to="/signup">Sign up here</Link></p>
                    </div>
                </div>

                <div className="login-background">
                    <div className="gradient-blob gradient-1"></div>
                    <div className="gradient-blob gradient-2"></div>
                    <div className="gradient-blob gradient-3"></div>
                </div>
            </div>
        </div>
    );
};

export default Login;
