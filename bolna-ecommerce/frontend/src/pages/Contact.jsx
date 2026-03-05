import { useState } from 'react';
import axios from 'axios';
import { Mail, User, MessageSquare, Send, CheckCircle } from 'lucide-react';

const API_URL = "https://bolna-ai-app1.onrender.com";

export default function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', text: '' });

        try {
            await axios.post(`${API_URL}/api/contact`, formData);
            setStatus({ type: 'success', text: 'Thank you! Your message has been sent successfully.' });
            setFormData({ name: '', email: '', message: '' });
        } catch (err) {
            setStatus({ type: 'error', text: err.response?.data?.message || 'Failed to send message. Please try again later.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8 flex p-6 justify-center">
            <div className="max-w-2xl w-full bg-white shadow-xl rounded-2xl overflow-hidden">
                <div className="bg-indigo-600 py-6 px-8 text-white">
                    <h2 className="text-3xl font-extrabold">Contact Us</h2>
                    <p className="mt-2 text-indigo-100 text-sm">Have a question or want to work together? Leave us a message!</p>
                </div>

                <div className="p-8">
                    {status.text && (
                        <div className={`mb-6 p-4 rounded-md flex items-start ${status.type === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
                            {status.type === 'success' && <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5" />}
                            <span className={`text-sm ${status.type === 'success' ? 'text-green-800' : 'text-red-700'}`}>
                                {status.text}
                            </span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3 px-3 border"
                                    placeholder="Your Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3 px-3 border"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Message</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                                    <MessageSquare className="h-5 w-5 text-gray-400" />
                                </div>
                                <textarea
                                    required
                                    rows={4}
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3 px-3 border resize-none"
                                    placeholder="How can we help you?"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            <Send className="w-5 h-5 mr-2" />
                            {loading ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
