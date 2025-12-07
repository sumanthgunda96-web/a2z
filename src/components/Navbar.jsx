import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, Search, Sparkles, LogOut, ChevronDown, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { getCartCount } = useCart();
    const { currentUser, logout } = useAuth();

    return (
        <nav className="glass-nav sticky top-0 z-50 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white shadow-lg">
                                <Sparkles className="h-5 w-5" />
                            </div>
                            <span className="text-2xl font-serif font-bold text-primary tracking-tight">Gunda Srinivas</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-slate-light hover:text-secondary transition-colors px-3 py-2 rounded-md text-sm font-medium uppercase tracking-wider">Home</Link>
                        <Link to="/products" className="text-slate-light hover:text-secondary transition-colors px-3 py-2 rounded-md text-sm font-medium uppercase tracking-wider">Products</Link>
                        <Link to="/about" className="text-slate-light hover:text-secondary transition-colors px-3 py-2 rounded-md text-sm font-medium uppercase tracking-wider">About Us</Link>
                        <Link to="/contact" className="text-slate-light hover:text-secondary transition-colors px-3 py-2 rounded-md text-sm font-medium uppercase tracking-wider">Contact</Link>
                        {currentUser && (
                            <Link to="/my-orders" className="text-slate-light hover:text-secondary transition-colors px-3 py-2 rounded-md text-sm font-medium uppercase tracking-wider">My Orders</Link>
                        )}
                    </div>

                    <div className="hidden md:flex items-center space-x-6">
                        <button className="text-slate-light hover:text-secondary transition-colors">
                            <Search className="h-5 w-5" />
                        </button>
                        <Link to="/cart" className="text-slate-light hover:text-secondary transition-colors relative">
                            <ShoppingCart className="h-5 w-5" />
                            {getCartCount() > 0 && (
                                <span className="absolute -top-2 -right-2 bg-secondary text-night text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">{getCartCount()}</span>
                            )}
                        </Link>
                        {currentUser ? (
                            <div className="relative group">
                                <button className="flex items-center space-x-2 text-slate-light hover:text-secondary transition-colors focus:outline-none">
                                    <span className="text-sm font-medium">Hi, {currentUser.name}</span>
                                    <ChevronDown className="h-4 w-4" />
                                </button>

                                {/* Dropdown Menu */}
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-secondary">
                                        <User className="h-4 w-4 inline mr-2" />
                                        My Profile
                                    </Link>
                                    <Link to="/my-orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-secondary">
                                        <ShoppingBag className="h-4 w-4 inline mr-2" />
                                        My Orders
                                    </Link>
                                    <div className="border-t border-gray-100 my-1"></div>
                                    <button
                                        onClick={logout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="text-slate-light hover:text-secondary transition-colors">
                                <User className="h-5 w-5" />
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-primary hover:text-secondary focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-cream border-t border-gray-200">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/" className="block text-primary hover:text-secondary px-3 py-2 rounded-md text-base font-medium font-serif">Home</Link>
                        <Link to="/products" className="block text-primary hover:text-secondary px-3 py-2 rounded-md text-base font-medium font-serif">Products</Link>
                        <Link to="/about" className="block text-primary hover:text-secondary px-3 py-2 rounded-md text-base font-medium font-serif">About Us</Link>
                        <Link to="/contact" className="block text-primary hover:text-secondary px-3 py-2 rounded-md text-base font-medium font-serif">Contact</Link>
                        {currentUser && (
                            <Link to="/my-orders" className="block text-primary hover:text-secondary px-3 py-2 rounded-md text-base font-medium font-serif">My Orders</Link>
                        )}
                        <div className="flex space-x-4 px-3 py-2 border-t border-gray-200 mt-2">
                            <Link to="/cart" className="flex items-center text-primary hover:text-secondary">
                                <ShoppingCart className="h-5 w-5 mr-2" /> Cart
                            </Link>
                            {currentUser ? (
                                <button onClick={logout} className="flex items-center text-primary hover:text-secondary">
                                    <LogOut className="h-5 w-5 mr-2" /> Logout
                                </button>
                            ) : (
                                <Link to="/login" className="flex items-center text-primary hover:text-secondary">
                                    <User className="h-5 w-5 mr-2" /> Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
