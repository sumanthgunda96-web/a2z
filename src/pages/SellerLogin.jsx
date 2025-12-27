import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, Mail, Lock, LogIn, ArrowRight, Loader, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { FirestoreUserService } from '../services/firebase/FirestoreUserService';
import { FirestoreBusinessService } from '../services/firebase/FirestoreBusinessService';
import { FirestoreAdminService } from '../services/firebase/FirestoreAdminService';

const BusinessLogin = () => {
    const navigate = useNavigate();
    const { login, logout, sendVerification, googleLogin } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const businessService = new FirestoreBusinessService();
    // Instantiate UserService
    const userService = new FirestoreUserService();
    const adminService = new FirestoreAdminService();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const userCredential = await login(email, password);
            const user = userCredential.user || userCredential;

            // CHECK BAN STATUS & SELF-HEAL
            let userDoc = await userService.getUser(user.uid);

            if (!userDoc) {
                // Self-Heal: Create missing user document
                console.log("User document missing, creating...");
                await userService.createUser(user.uid, {
                    email: user.email,
                    role: 'seller', // Default to seller since they are trying to login as one
                    createdAt: new Date().toISOString()
                });
                userDoc = { status: 'active', role: 'seller' }; // Mock for immediate check
            }

            // CHECK BLACKLIST (BANNED_USERS COLLECTION)
            const isBanned = await adminService.isUserBanned(user.uid);
            if (isBanned) {
                await logout();
                throw new Error("Your account has been blocked by the administrator.");
            }

            // 2. Fetch business owned by this user
            const businesses = await businessService.getBusinessByOwner(user.uid);

            if (businesses && businesses.length > 0) {
                // Redirect to the first business admin
                navigate(`/a2z/${businesses[0].slug}/admin`);
            } else {
                // No business found - Redirect to creation flow
                navigate('/a2z/seller/create-account', { state: { fromLogin: true, email: user.email } });
            }
        } catch (err) {
            console.error("Login verify error:", err);
            // Distinguish between auth errors and logic errors
            if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
                setError("Incorrect email or password.");
            } else {
                setError(err.message || "Login failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">

                {/* Left Side: Info */}
                <div className="hidden md:flex md:w-5/12 bg-indigo-600 p-8 flex-col justify-between text-white">
                    <div>
                        <div className="flex items-center gap-2 mb-8">
                            <Store className="w-8 h-8" />
                            <span className="text-2xl font-bold">A2Z</span>
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Seller Login</h2>
                        <p className="text-indigo-100">Log in to manage your store, orders, and products.</p>
                    </div>
                    <div className="text-sm text-indigo-200">
                        © 2024 A2Z Commerce
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Seller Login</h1>
                        <p className="text-gray-500 text-sm mt-1">Access your store dashboard</p>
                    </div>

                    {error && (
                        <div className="text-red-600 text-sm mt-1">{error}</div>
                    )}

                    <div className="mb-6">
                        <button
                            onClick={async () => {
                                try {
                                    const user = await googleLogin();
                                    if (user) {
                                        // CHECK BAN STATUS & SELF-HEAL
                                        let userDoc = await userService.getUser(user.uid);

                                        if (!userDoc) {
                                            // Self-Heal
                                            await userService.createUser(user.uid, {
                                                email: user.email,
                                                name: user.displayName,
                                                role: 'seller',
                                                createdAt: new Date().toISOString()
                                            });
                                            userDoc = { status: 'active' };
                                        }

                                        // CHECK BLACKLIST (BANNED_USERS COLLECTION)
                                        const isBanned = await adminService.isUserBanned(user.uid);
                                        if (isBanned) {
                                            await logout();
                                            throw new Error("Your account has been blocked by the administrator.");
                                        }

                                        // Fetch business owned by this user
                                        const businesses = await businessService.getBusinessByOwner(user.uid);
                                        if (businesses && businesses.length > 0) {
                                            navigate(`/a2z/${businesses[0].slug}/admin`);
                                        } else {
                                            navigate('/a2z/seller/create-account', { state: { fromLogin: true, email: user.email } });
                                        }
                                    }
                                } catch (err) {
                                    console.error("Google Login Error:", err);
                                    setError(err.message || "Google Sign-In failed. Please try again.");
                                }
                            }}
                            className="w-full flex justify-center py-2.5 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-6"
                        >
                            <img className="h-5 w-5 mr-3" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" />
                            Sign in with Google
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center text-gray-500 cursor-pointer">
                                <input type="checkbox" className="mr-2 rounded text-indigo-600 focus:ring-indigo-500" />
                                Remember me
                            </label>
                            <Link to="/a2z/seller/forgot-password" className="text-indigo-600 font-medium hover:underline">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0 mt-2"
                        >
                            {loading ? <Loader className="w-5 h-5 animate-spin" /> : <>Sign In <ArrowRight className="ml-2 w-5 h-5" /></>}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-500">
                        Don't have a store yet? <Link to="/a2z/seller/create-account" className="text-indigo-600 font-medium hover:underline">Create Business Account</Link>
                    </p>
                </div>
            </div>
        </div >
    );
};

export default BusinessLogin;
