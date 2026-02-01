import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Generate JWT Token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res) => {
    try {
        const { name, email, password, passwordConfirm, department } = req.body;

        // Validate inputs
        if (!name || !email || !password || !passwordConfirm) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Check if passwords match
        if (password !== passwordConfirm) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            });
        }

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: 'Email is already in use'
            });
        }

        // Create user
        user = await User.create({
            name,
            email,
            password,
            department: department || 'Other'
        });

        // Generate token
        const token = generateToken(user._id, user.role);

        // Return response
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: user.getPublicProfile()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error registering user'
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate inputs
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Check for user (include password field for verification)
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isPasswordValid = await user.matchPassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = generateToken(user._id, user.role);

        // Return response
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: user.getPublicProfile()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error logging in'
        });
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            user: user.getPublicProfile()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user'
        });
    }
};
