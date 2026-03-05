import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

const API_URL = "https://bolna-ai-app1.onrender.com";

export default function Cart() {
    const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const navigate = useNavigate();

    const handleCheckout = async () => {
        if (!token) {
            alert('Please log in to checkout!');
            navigate('/login');
            return;
        }

        try {
            const formattedItems = cart.map(item => ({
                ...item,
                price: typeof item.price === 'string' ? parseFloat(item.price.replace('$', '')) : item.price
            }));

            const orderData = {
                items: formattedItems,
                totalAmount: getCartTotal()
            };

            await axios.post(`${API_URL}/api/orders`, orderData, {

                headers: { Authorization: `Bearer ${token}` }
            });

            alert('Order placed successfully!');
            clearCart();
            navigate('/orders');
        } catch (error) {
            alert(error.response?.data?.message || 'Checkout failed');
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
                <ShoppingBag className="h-24 w-24 text-gray-300 mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
                    Continue Shopping &rarr;
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-4">
                    {cart.map((item) => (
                        <div key={item.id} className="flex flex-col sm:flex-row items-center bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                            <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md mb-4 sm:mb-0 sm:mr-6" />
                            <div className="flex-1 text-center sm:text-left">
                                <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                                <p className="text-indigo-600 font-medium mt-1">{item.price}</p>
                            </div>
                            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                                <select
                                    value={item.quantity}
                                    onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                                >
                                    {[...Array(10).keys()].map(n => (
                                        <option key={n + 1} value={n + 1}>{n + 1}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 sticky top-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between border-b border-gray-200 pb-4">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium text-gray-900">${getCartTotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-200 pb-4">
                                <span className="text-gray-600">Shipping</span>
                                <span className="font-medium text-green-600">Free</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-xl font-bold text-gray-900">Total</span>
                                <span className="text-2xl font-extrabold text-indigo-600">${getCartTotal().toFixed(2)}</span>
                            </div>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="mt-8 w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                        >
                            Secure Checkout
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </button>
                        {!user && (
                            <p className="mt-4 text-xs text-center text-gray-500">
                                You will be asked to <Link to="/login" className="text-indigo-600 hover:underline">login</Link> before checkout.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
