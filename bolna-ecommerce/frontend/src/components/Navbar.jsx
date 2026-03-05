import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
    const navigate = useNavigate();
    const { getCartCount, clearCart } = useCart();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        clearCart();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center text-xl font-bold text-indigo-600">
                            BolnaShop
                        </Link>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link to="/" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-indigo-500 font-medium pt-1">
                                Home
                            </Link>
                            <Link to="/contact" className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 font-medium">
                                Contact
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link to="/cart" className="text-gray-500 hover:text-indigo-600 relative p-2">
                            <ShoppingCart className="h-6 w-6" />
                            {getCartCount() > 0 && (
                                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center -mr-1 -mt-1">
                                    {getCartCount()}
                                </span>
                            )}
                        </Link>

                        {token ? (
                            <div className="relative group flex items-center gap-4">
                                <Link to="/orders" className="text-gray-500 hover:text-indigo-600 flex items-center gap-1 text-sm font-medium">
                                    <Package className="h-4 w-4" />
                                    <span className="hidden sm:inline">Orders</span>
                                </Link>
                                <span className="text-sm font-medium text-gray-700 hidden sm:block border-l pl-4 border-gray-300">Hi, {user?.name?.split(' ')[0]}</span>
                                <button onClick={handleLogout} className="text-gray-500 hover:text-red-600 flex items-center gap-1 text-sm font-medium">
                                    <LogOut className="h-4 w-4" />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex space-x-2">
                                <Link to="/login" className="text-gray-500 hover:text-indigo-600 p-2">
                                    <User className="h-6 w-6 inline" />
                                    <span className="ml-1 hidden sm:inline font-medium">Login</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
