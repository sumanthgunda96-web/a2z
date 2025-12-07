import React, { useState } from 'react';
import { Search, Filter, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const productsData = [
    {
        id: 1,
        name: 'Premium Sparklers',
        category: 'Sparklers',
        price: '₹450',
        weight: '100 pcs',
        image: 'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 2,
        name: 'Flower Pots Deluxe',
        category: 'Ground',
        price: '₹800',
        weight: '10 pcs',
        image: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 3,
        name: 'Sky Rockets',
        category: 'Aerial',
        price: '₹1200',
        weight: '12 pcs',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 4,
        name: 'Chakra Special',
        category: 'Ground',
        price: '₹600',
        weight: '5 pcs',
        image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 5,
        name: 'Fancy Fountains',
        category: 'Fountains',
        price: '₹1500',
        weight: '6 pcs',
        image: 'https://images.unsplash.com/photo-1482575832494-771f74bf6857?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 6,
        name: 'Multi-Color Shots',
        category: 'Aerial',
        price: '₹2000',
        weight: '25 shots',
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 7,
        name: 'Electric Crackers',
        category: 'Crackers',
        price: '₹350',
        weight: '100 pcs',
        image: 'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 8,
        name: 'Celebration Pack',
        category: 'Combo',
        price: '₹3500',
        weight: 'Assorted',
        image: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
];

const Products = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const { addToCart } = useCart();

    const categories = ['All', 'Sparklers', 'Ground', 'Aerial', 'Fountains', 'Crackers', 'Combo'];

    const filteredProducts = productsData.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="bg-white py-20" id="products">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl font-serif">Our Collection</h2>
                    <p className="mt-4 max-w-2xl text-xl text-slate-light mx-auto font-light">
                        Premium fireworks for every celebration. Wholesale pricing available.
                    </p>
                </div>

                {/* Filters and Search */}
                <div className="mt-8 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 bg-cream p-4 rounded-xl shadow-inner">
                    <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
                        <Filter className="h-5 w-5 text-primary mr-2" />
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${selectedCategory === category
                                        ? 'bg-primary text-white shadow-md'
                                        : 'bg-white text-slate-light hover:bg-gray-100 hover:text-primary border border-gray-200'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-72">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-full leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent sm:text-sm transition-shadow"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Product Grid */}
                <div className="mt-12 grid grid-cols-1 gap-y-12 sm:grid-cols-2 gap-x-8 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-10">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col">
                            <div className="w-full h-64 bg-gray-200 overflow-hidden relative">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-center object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary uppercase tracking-wide shadow-sm">
                                    {product.category}
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold text-primary font-serif">
                                        <a href="#">
                                            <span aria-hidden="true" className="absolute inset-0" />
                                            {product.name}
                                        </a>
                                    </h3>
                                    <p className="text-lg font-bold text-secondary">{product.price}</p>
                                </div>
                                <p className="mt-1 text-sm text-slate-light mb-6">Qty: {product.weight}</p>
                                <div className="mt-auto">
                                    <button
                                        onClick={() => {
                                            addToCart(product);
                                            alert(`${product.name} added to cart!`);
                                        }}
                                        className="w-full bg-primary text-white py-3 px-4 rounded-xl hover:bg-primary-dark transition-colors duration-300 flex items-center justify-center font-medium shadow-md hover:shadow-lg transform active:scale-95"
                                    >
                                        <ShoppingCart className="h-5 w-5 mr-2" />
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Products;
