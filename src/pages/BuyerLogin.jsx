
import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { FirestoreUserService } from '../services/firebase/FirestoreUserService';
import { useBusiness } from '../context/BusinessContext';

const Login = () => {
    const navigate = useNavigate();
    const { login, googleLogin, logout } = useAuth();
    const { currentBusiness } = useBusiness();
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            console.log("Attempting login...");
            const userCredential = await login(email, password);
            console.log("Login success, user:", userCredential.user);

            // Check for Banned Status
            const userDoc = await new FirestoreUserService().getUser(userCredential.user.uid);
            if (userDoc && userDoc.status === 'banned') {
                await logout(); // Force logout
                throw new Error("Your account has been suspended. Please contact support.");
            }

            const user = userCredential.user;

            // Verification check removed per user request
            // if (!user.emailVerified) { ... }


            alert("Login successful! Welcome back!");

            const returnUrl = searchParams.get('returnUrl');
            if (returnUrl) {
                navigate(returnUrl);
            } else if (currentBusiness) {
                navigate(`/a2z/${currentBusiness.slug}`);
            } else {
                // Default to the main demo store instead of the platform landing page
                navigate('/a2z/a2z-demo');
            }
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to sign in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cream flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-primary font-serif">
                    Sign in to your account
                </h2>
                <p className="mt-2 text-center text-sm text-slate-light">
                    Or{' '}
                    <Link
                        to={currentBusiness
                            ? `/ a2z / ${currentBusiness.slug}/register`
                            : `/a2z/buyer/register${searchParams.get('returnUrl') ? `?returnUrl=${encodeURIComponent(searchParams.get('returnUrl'))}` : ''}`
                        }
                        className="font-medium text-secondary hover:text-secondary-dark transition-colors"
                    >
                        create a new account
                    </Link >
                </p >
            </div >

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div className="mt-6">
                        <button
                            onClick={async () => {
                                try {
                                    await googleLogin();
                                    const returnUrl = searchParams.get('returnUrl');
                                    if (returnUrl) navigate(returnUrl);
                                    else if (currentBusiness) navigate(`/a2z/${currentBusiness.slug}`);
                                    else navigate('/a2z/a2z-demo');
                                } catch (err) {
                                    console.error("Google Login Error:", err);
                                    alert(`Google Login failed: ${err.code} - ${err.message}`);
                                }
                            }}
                            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-6"
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

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-primary">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-primary">
                                Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm transition-colors pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-light">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <Link to="/forgot-password" className="font-medium text-secondary hover:text-secondary-dark transition-colors">
                                    Forgot your password?
                                </Link>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-xl shadow-md text-sm font-medium text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div >
    );
};

export default Login;
