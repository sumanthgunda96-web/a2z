import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

import { useBusiness } from '../context/BusinessContext';

const AdminLayout = () => {
    const { logout, currentUser, sendVerification } = useAuth();
    const navigate = useNavigate();
    const { currentBusiness } = useBusiness();

    // Construct base admin URL
    const adminBase = currentBusiness ? `/a2z/${currentBusiness.slug}/admin` : '/admin';

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    if (currentUser && !currentUser.emailVerified) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6 text-center">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">📧</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify your email</h2>
                    <p className="text-gray-600 mb-6">
                        Please check your inbox for the verification link before accessing the admin panel.
                    </p>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => sendVerification(currentUser).then(() => alert("Verification email sent!"))}
                            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                        >
                            Resend Verification Email
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                        >
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md flex flex-col">
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-2xl font-bold text-primary font-serif">
                        {currentBusiness?.name || 'Admin Panel'}
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <NavLink
                        to={`${adminBase}/dashboard`}
                        className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary text-white' : 'text-slate-600 hover:bg-gray-50'}`}
                    >
                        <LayoutDashboard className="w-5 h-5 mr-3" />
                        Dashboard
                    </NavLink>

                    <NavLink
                        to={`${adminBase}/orders`}
                        className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary text-white' : 'text-slate-600 hover:bg-gray-50'}`}
                    >
                        <ShoppingBag className="w-5 h-5 mr-3" />
                        Orders
                    </NavLink>

                    <NavLink
                        to={`${adminBase}/products`}
                        className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary text-white' : 'text-slate-600 hover:bg-gray-50'}`}
                    >
                        <Package className="w-5 h-5 mr-3" />
                        Products
                    </NavLink>

                    <NavLink
                        to={`${adminBase}/content`}
                        className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary text-white' : 'text-slate-600 hover:bg-gray-50'}`}
                    >
                        <LayoutDashboard className="w-5 h-5 mr-3" />
                        Content
                    </NavLink>
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
