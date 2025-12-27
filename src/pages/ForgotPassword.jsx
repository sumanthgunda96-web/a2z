import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ForgotPassword = ({ role = 'buyer' }) => {
    const navigate = useNavigate();
    const { resetPassword } = useAuth();

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    // Dynamic Back Link based on Role
    const getBackLink = () => {
        switch (role) {
            case 'seller': return '/a2z/seller/login';
            case 'admin': return '/a2z/super-admin';
            default: return '/a2z/buyer/login';
        }
    };

    const getBackText = () => {
        switch (role) {
            case 'seller': return 'Back to Seller Login';
            case 'admin': return 'Back to Super Admin';
            default: return 'Back to Login';
        }
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await resetPassword(email);
            setEmailSent(true);
        } catch (err) {
            console.error("Reset error:", err);
            let msg = `Error (${err.code}): ${err.message}`;
            if (err.code === 'auth/user-not-found') msg = "No account found with this email.";
            if (err.code === 'auth/invalid-email') msg = "Please enter a valid email address.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setLoading(true);
        setError('');
        try {
            await resetPassword(email);
            alert("Reset link resent successfully!");
        } catch (err) {
            console.error("Resend error:", err);
            setError(`Failed to resend: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (emailSent) {
        return (
            <div className="min-h-screen bg-cream flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-100 text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                            <Mail className="h-6 w-6 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
                        <p className="text-gray-600 mb-6">
                            We have sent a password reset link to <strong>{email}</strong>.
                        </p>
                        <div className="bg-blue-50 p-4 rounded-lg text-left mb-6">
                            <p className="text-sm text-blue-800 font-medium mb-1">Did you sign up with Google?</p>
                            <p className="text-xs text-blue-600">
                                If you created your account using Google, you don't have a password. Please go back and click "Sign in with Google".
                            </p>
                        </div>

                        {error && (
                            <div className="mb-4 p-2 bg-red-50 text-red-600 text-xs rounded text-left">
                                {error}
                            </div>
                        )}

                        <div className="flex flex-col gap-3 mb-6">
                            <button
                                onClick={handleResend}
                                disabled={loading}
                                className="text-sm text-secondary hover:text-secondary-dark font-medium disabled:opacity-50"
                            >
                                {loading ? 'Sending...' : 'Didn\'t receive it? Resend Link'}
                            </button>
                        </div>

                        <p className="text-sm text-gray-500 mb-6">
                            Click the link in the email to reset your password, then return here to login.
                        </p>
                        <Link
                            to={getBackLink()}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-xl shadow-md text-sm font-medium text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-all"
                        >
                            Return to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-primary font-serif">
                    {role === 'admin' ? 'Super Admin Recovery' : role === 'seller' ? 'Seller Account Recovery' : 'Reset Password'}
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Enter your email to receive a password reset link.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleEmailSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-primary">
                                Email address
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm transition-colors"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-xl shadow-md text-sm font-medium text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50"
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    Or
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <Link to={getBackLink()} className="font-medium text-secondary hover:text-secondary-dark flex items-center justify-center gap-2">
                                <ArrowLeft className="h-4 w-4" /> {getBackText()}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
