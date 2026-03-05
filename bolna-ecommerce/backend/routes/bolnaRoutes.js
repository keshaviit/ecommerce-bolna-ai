const express = require('express');
const axios = require('axios');
const Order = require('../models/Order');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST /api/bolna/call
// @desc    Initiate an outbound call to the user via Bolna AI API
router.post('/call', authMiddleware, async (req, res) => {
    try {
        const { orderId, phoneNumber } = req.body;

        if (!orderId || !phoneNumber) {
            return res.status(400).json({ message: 'Order ID and phone number are required' });
        }

        // Verify the order belongs to the user
        const order = await Order.findOne({ _id: orderId, user: req.userId });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const bolnaApiKey = process.env.BOLNA_API_KEY;
        const bolnaAgentId = process.env.BOLNA_AGENT_ID;

        if (!bolnaApiKey || !bolnaAgentId) {
            return res.status(500).json({ message: 'Bolna API keys are not configured on the server.' });
        }

        // Initiate the call using Bolna API
        // https://docs.bolna.dev/api-reference/agents/trigger-agent-call
        const payload = {
            agent_id: bolnaAgentId,
            recipient_phone_number: phoneNumber,
            // Pass orderId as context so the agent knows what order it's calling about
            agent_prompts: {
                task_1: `You are calling a customer about their recent order. The order ID is ${orderId}. Their phone number is ${phoneNumber}. Ask them how you can help with their order.`
            }
        };

        const response = await axios.post('https://api.bolna.dev/call', payload, {
            headers: {
                'Authorization': `Bearer ${bolnaApiKey}`,
                'Content-Type': 'application/json'
            }
        });

        res.status(200).json({
            message: 'Call initiated successfully',
            callId: response.data?.id, // Assuming Bolna returns an ID
            orderId: orderId
        });

    } catch (error) {
        console.error('------- BOLNA API ERROR FULL DETAILS -------');
        console.error('Status:', error.response?.status);
        console.error('Data:', JSON.stringify(error.response?.data, null, 2));
        console.error('Message:', error.message);
        console.error('------------------------------------------');
        res.status(500).json({ message: 'Failed to initiate support call', error: error.message });
    }
});


// @route   POST /api/bolna/webhook
// @desc    Webhook for Bolna API to fetch order details during a call
// Note: Webhooks usually don't use the standard user auth middleware since they are called by the AI server
router.post('/webhook', async (req, res) => {
    try {
        const { orderId } = req.body; // Bolna must send the orderId

        if (!orderId) {
            return res.status(400).json({ message: 'Missing orderId parameter in webhook request.' });
        }

        const order = await Order.findById(orderId).populate('user', 'name email');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Format a response that is easy for the AI Agent to read out loud
        const itemNames = order.items.map(item => `${item.quantity}x ${item.name}`).join(', ');
        const orderSummary = {
            order_id: order._id,
            status: order.status,
            total_amount: order.totalAmount,
            customer_name: order.user?.name || 'Customer',
            items: itemNames,
            order_date: new Date(order.createdAt).toLocaleDateString()
        };

        // Return JSON which the Bolna agent can parse automatically
        res.status(200).json(orderSummary);

    } catch (error) {
        console.error('Bolna Webhook Error:', error);
        res.status(500).json({ message: 'Internal server error processing webhook' });
    }
});

module.exports = router;
