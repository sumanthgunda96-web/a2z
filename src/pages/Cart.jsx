import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-cream py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <div className="max-w-md w-full text-center">
                    <ShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
                    <h2 className="mt-4 text-2xl font-bold text-primary font-serif">Your cart is empty</h2>
                    <p className="mt-2 text-sm text-slate-light">
                        Start adding some amazing fireworks to your cart!
                    </p>
                    <div className="mt-6">
                        <Link
                            to="/products"
                            className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-xl text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-primary font-serif">Shopping Cart</h1>
                    <button
                        onClick={clearCart}
                        className="text-sm text-slate-light hover:text-primary transition-colors"
                    >
                        Clear Cart
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="divide-y divide-gray-200">
                        {cartItems.map((item) => (
                            <div key={item.id} className="p-6 flex items-center gap-4">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-24 h-24 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-primary font-serif">{item.name}</h3>
                                    <p className="text-sm text-slate-light">{item.category}</p>
                                    <p className="text-lg font-bold text-secondary mt-1">{item.price}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="p-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                                    >
                                        <Minus className="h-4 w-4 text-primary" />
                                    </button>
                                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="p-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                                    >
                                        <Plus className="h-4 w-4 text-primary" />
                                    </button>
                                </div>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gray-50 p-6 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-medium text-slate">Total:</span>
                            <span className="text-2xl font-bold text-primary font-serif">
                                ₹{getCartTotal().toLocaleString('en-IN')}
                            </span>
                        </div>
                        <button
                            onClick={() => {
                                if (!currentUser) {
                                    alert('Please login to proceed to checkout');
                                    navigate('/login');
                                    return;
                                }
                                navigate('/checkout');
                            }}
                            className="w-full block bg-primary text-white py-3 px-6 rounded-xl hover:bg-primary-dark transition-all duration-300 font-medium shadow-md hover:shadow-lg transform active:scale-95 text-center"
                        >
                            Proceed to Checkout
                        </button>
                        <Link
                            to="/products"
                            className="block text-center mt-4 text-sm text-slate-light hover:text-primary transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
