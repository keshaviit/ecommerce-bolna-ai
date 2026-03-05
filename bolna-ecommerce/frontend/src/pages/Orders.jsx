import { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Calendar, MapPin, PhoneCall, X } from 'lucide-react';

const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    // States for Bolna Call Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [callStatus, setCallStatus] = useState({ type: '', text: '' });
    const [calling, setCalling] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/orders`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchOrders();
        else setLoading(false);
    }, [token]);

    const openCallModal = (orderId) => {
        setSelectedOrderId(orderId);
        setIsModalOpen(true);
        setCallStatus({ type: '', text: '' });
        setPhoneNumber('');
    };

    const handleCallSubmit = async (e) => {
        e.preventDefault();
        if (!phoneNumber) return;

        setCalling(true);
        setCallStatus({ type: '', text: '' });

        try {
            await axios.post(`${API_URL}/api/bolna/call`,
                { orderId: selectedOrderId, phoneNumber },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setCallStatus({ type: 'success', text: 'Call initiated! The AI Agent is ringing your phone now.' });
            setTimeout(() => {
                setIsModalOpen(false);
            }, 3000); // Close modal automatically after 3 seconds on success
        } catch (error) {
            console.error("Bolna Call Error:", error);
            setCallStatus({ type: 'error', text: error.response?.data?.message || 'Failed to initiate call. Please ensure your API keys are set.' });
        } finally {
            setCalling(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <h2 className="text-2xl font-bold text-gray-900">Please log in to view your orders.</h2>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
                <Package className="h-24 w-24 text-gray-300 mb-6" />
                <h2 className="text-2xl font-bold text-gray-900">No orders found</h2>
                <p className="text-gray-500 mt-2">You haven't placed any orders yet.</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Your Orders</h1>

            {/* Orders List */}
            <div className="space-y-8">
                {orders.map((order) => (
                    <div key={order._id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden relative">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                            <div className="flex space-x-8">
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Order Placed</p>
                                    <p className="text-sm text-gray-900 font-medium mt-1 flex items-center">
                                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Amount</p>
                                    <p className="text-sm font-bold text-indigo-600 mt-1">${order.totalAmount.toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                                    ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                        order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'}`}>
                                    {order.status}
                                </span>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Order # {order._id.slice(-8)}</p>
                            </div>
                        </div>

                        <div className="p-6 relative">
                            {/* Call AI Support Button */}
                            <button
                                onClick={() => openCallModal(order._id)}
                                className="absolute top-6 right-6 flex items-center bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                <PhoneCall className="w-4 h-4 mr-2" />
                                Call AI Support
                            </button>

                            <ul className="divide-y divide-gray-200 pr-40">
                                {order.items.map((item, index) => (
                                    <li key={index} className="py-4 flex">
                                        <img src={item.image} alt={item.name} className="h-20 w-20 rounded-md object-cover mr-6 border border-gray-100" />
                                        <div className="flex-1 flex flex-col justify-center">
                                            <h4 className="text-md font-medium text-gray-900">{item.name}</h4>
                                            <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity} × {item.price}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bolna Call Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50 transition-opacity">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all">
                        <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center text-white">
                            <h3 className="text-lg font-bold flex items-center">
                                <PhoneCall className="w-5 h-5 mr-2" />
                                AI Customer Support
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-indigo-200 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6">
                            <p className="text-gray-600 text-sm mb-6">
                                Enter your phone number below. Our Bolna AI Support Agent will call you immediately to help with order #{selectedOrderId?.slice(-8)}.
                            </p>

                            {callStatus.text && (
                                <div className={`p-3 rounded-md text-sm mb-4 ${callStatus.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                                    {callStatus.text}
                                </div>
                            )}

                            <form onSubmit={handleCallSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        placeholder="+1 (555) 000-0000"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        required
                                        disabled={calling}
                                    />
                                    <p className="text-xs text-gray-500 mt-2">Include country code (e.g., +1 for US, +91 for India)</p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={calling || !phoneNumber}
                                    className={`w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${calling ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} transition-colors`}
                                >
                                    {calling ? (
                                        <span className="flex items-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                            Connecting...
                                        </span>
                                    ) : 'Receive Call Now'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
