const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const getToken = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bolna-ecommerce");
        const user = await User.findOne({ email: 'orders@example.com' });
        console.log(user ? user.verificationToken : 'User not found');
    } catch (err) {
        console.log('Error:', err);
    } finally {
        mongoose.disconnect();
    }
};

getToken();
