import express from 'express';
import { signup, login, getCurrentUser } from '../controllers/authController.js';
import { protect } from '../utils/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getCurrentUser);

export default router;
