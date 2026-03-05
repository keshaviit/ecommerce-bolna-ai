const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const fs = require('fs');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email,
            password: hashedPassword
        });
        await user.save();

        res.status(201).json({ message: 'User registered.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });

        res.status(200).json({ token, user: { name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get User (Protected Route Example)
router.get('/me', require('../middleware/authMiddleware'), async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
