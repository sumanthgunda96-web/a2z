import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FirestoreBusinessService } from '../services/firebase/FirestoreBusinessService';
import { FirestoreUserService } from '../services/firebase/FirestoreUserService';
import { Store, ArrowRight, Loader } from 'lucide-react';

const CreateStore = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        slug: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const businessService = new FirestoreBusinessService();
    const userService = new FirestoreUserService();

    if (!currentUser) {
        return <Navigate to="/a2z/create-account" replace />;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'slug') {
            // Basic slug cleaning
            const cleaned = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
            setFormData(prev => ({ ...prev, [name]: cleaned }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!formData.name || !formData.slug) {
                throw new Error('Please fill in all fields');
            }
            if (formData.slug.length < 3) {
                throw new Error('Store URL must be at least 3 characters');
            }

            // Ensure User Role is Seller
            await userService.createUser(currentUser.uid, {
                email: currentUser.email,
                role: 'seller', // Upgrade role
                updatedAt: new Date().toISOString()
            });

            const newBusiness = await businessService.createBusiness({
                name: formData.name,
                slug: formData.slug,
                ownerId: currentUser.uid,
                ownerEmail: currentUser.email,
                themeColor: '#4f46e5' // default indigo-600
            });

            // Redirect to the new store's admin dashboard
            navigate(`/a2z/${newBusiness.slug}/admin`);

        } catch (err) {
            console.error("Create Store Error:", err);
            setError(err.message || "Failed to create store");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
                        <Store className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Open Your Store</h1>
                    <p className="text-gray-500 mt-2">Start your business journey with A2Z today.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. My Awesome Shop"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Store URL</label>
                        <div className="flex items-center">
                            <span className="bg-gray-100 px-3 py-3 rounded-l-lg border border-r-0 border-gray-300 text-gray-500">
                                a2z/
                            </span>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                placeholder="my-shop"
                                className="w-full px-4 py-3 rounded-r-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                                required
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">This will be your unique shop address.</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0"
                    >
                        {loading ? <Loader className="w-5 h-5 animate-spin" /> : <>Create Store <ArrowRight className="ml-2 w-5 h-5" /></>}
                    </button>
                </form>
            </div>

            <p className="mt-8 text-center text-sm text-gray-500">
                Already have a store? <a href="/login" className="text-indigo-600 font-medium hover:underline">Log in to manage</a>
            </p>
        </div>
    );
};

export default CreateStore;
