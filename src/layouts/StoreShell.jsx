import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ContentProvider } from '../context/ContentContext';
import { CartProvider } from '../context/CartContext';
import { OrderProvider } from '../context/OrderContext';
import { ProductProvider } from '../context/ProductContext';
import { useBusiness } from '../context/BusinessContext';

const StoreShell = () => {
    const { loading, currentBusiness } = useBusiness();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!currentBusiness) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Store Not Found</h2>
                <p className="text-gray-600 mb-8">The store you are looking for does not exist or has been moved.</p>
                <a href="/" className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    Go to Platform Home
                </a>
            </div>
        );
    }

    if (currentBusiness.status === 'pending') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
                <div className="bg-amber-100 p-4 rounded-full mb-6">
                    <span className="text-4xl">⏳</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Store Under Review</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    This store is currently waiting for approval from the platform administrators. Please check back later.
                </p>
                <a href="/" className="text-indigo-600 font-medium hover:underline">
                    &larr; Return to A2Z Platform
                </a>
            </div>
        );
    }

    if (currentBusiness.status === 'rejected' || currentBusiness.status === 'suspended' || currentBusiness.status === 'archived') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
                <div className="bg-red-100 p-4 rounded-full mb-6">
                    <span className="text-4xl">🚫</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Store Unavailable</h2>
                <p className="text-red-600 mb-8 max-w-md mx-auto">
                    {currentBusiness.status === 'archived'
                        ? "This store has been closed and is no longer available."
                        : "This store has been suspended for violating platform policies or maintenance."}
                </p>
                <a href="/" className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    Go to Platform Home
                </a>
            </div>
        );
    }

    const location = useLocation();
    const isAdmin = location.pathname.includes('/admin');

    return (
        <OrderProvider>
            <ProductProvider>
                <ContentProvider>
                    <CartProvider>
                        <div className="flex flex-col min-h-screen">
                            {!isAdmin && <Navbar />}
                            <main className="flex-grow">
                                <Outlet />
                            </main>
                            {!isAdmin && <Footer />}
                        </div>
                    </CartProvider>
                </ContentProvider>
            </ProductProvider>
        </OrderProvider>
    );
};

export default StoreShell;
