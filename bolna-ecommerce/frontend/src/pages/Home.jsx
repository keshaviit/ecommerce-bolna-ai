import { ShoppingBag, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

const products = [
    { id: 1, name: 'Wireless Noise-Canceling Earbuds', price: '$129.99', rating: 4.8, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
    { id: 2, name: 'Smart Fitness Watch Series 5', price: '$199.50', rating: 4.6, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
    { id: 3, name: 'Ultra-Slim 4K Monitor', price: '$299.99', rating: 4.9, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
    { id: 4, name: 'Mechanical Gaming Keyboard', price: '$89.00', rating: 4.7, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
    { id: 5, name: 'Portable Bluetooth Speaker', price: '$59.00', rating: 4.5, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
    { id: 6, name: 'Ergonomic Desk Chair', price: '$149.00', rating: 4.8, image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' },
];

export default function Home() {
    const { addToCart } = useCart();

    return (
        <div className="bg-gray-50 flex-grow py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">
                    Featured Products
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-6 xl:gap-x-8">
                    {products.map((product) => (
                        <div key={product.id} className="group relative bg-white border border-gray-200 rounded-lg flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            <div className="aspect-w-3 aspect-h-4 bg-gray-200 group-hover:opacity-75 sm:aspect-none sm:h-64">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-center object-cover sm:w-full sm:h-full"
                                />
                            </div>
                            <div className="flex-1 p-4 space-y-2 flex flex-col">
                                <h3 className="text-sm font-medium text-gray-900">
                                    <a href="#">
                                        <span aria-hidden="true" className="absolute inset-0" />
                                        {product.name}
                                    </a>
                                </h3>
                                <div className="flex items-center text-sm text-gray-500">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                    {product.rating}
                                </div>
                                <div className="flex-1 flex flex-col justify-end">
                                    <p className="text-base font-medium text-indigo-600">{product.price}</p>
                                </div>
                            </div>
                            <div className="p-4 border-t border-gray-200 bg-gray-50 group-hover:bg-indigo-50 transition-colors">
                                <button
                                    onClick={() => addToCart(product)}
                                    className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 z-10 relative cursor-pointer"
                                >
                                    <ShoppingBag className="mr-2 h-4 w-4" />
                                    Add to bag
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
