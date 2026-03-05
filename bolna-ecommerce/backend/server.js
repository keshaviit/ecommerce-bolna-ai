const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const orderRoutes = require('./routes/orderRoutes');
const bolnaRoutes = require('./routes/bolnaRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
console.log("ENV:", import.meta.env);
console.log("API:", import.meta.env.VITE_BACKEND_URL);

const corsOptions = {
    origin: [
        'http://localhost:5173', // Vite default local port
        'http://localhost:3000', // React default local port
        process.env.FRONTEND_URL // Production frontend URl
        ,"https://bolna-ai-app1-g9z1c46qq-keshaviits-projects.vercel.app"
    ],
    credentials: true,
    optionsSuccessStatus: 200
    // You can add more frontend URLs here if needed
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/bolna', bolnaRoutes);

// Database Connection
const startServer = async () => {
    try {
        let uri = process.env.MONGO_URI;
        if (!uri) {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongoServer = await MongoMemoryServer.create();
            uri = mongoServer.getUri();
            console.log('Using in-memory MongoDB for testing');
        }

        await mongoose.connect(uri);
        console.log('MongoDB connected successfully');

        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.log('MongoDB connection error:', err);
    }
};

startServer();
