import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { generateVerificationCode, storeVerificationCode, verifyCode } from '../utils/verificationService';
import { sendVerificationEmail } from '../utils/emailService';
import VerificationModal from '../components/VerificationModal';

const Register = () => {
    const navigate = useNavigate();
    const { signup } = useAuth();

    useEffect(() => {
        console.log('🚀 Register component mounted');
    }, []);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Reset verification if email changes
        if (e.target.name === 'email') {
            setIsVerified(false);
            setVerificationSent(false);
        }
    };

    const sendVerificationCode = async () => {
        if (!formData.email) {
            setError('Please enter your email address');
            return;
        }

        setLoading(true);
        setError('');

        const code = generateVerificationCode();
        storeVerificationCode(formData.email, code);

        const result = await sendVerificationEmail(formData.email, code);

        if (result.success) {
            setShowVerificationModal(true);
            setVerificationSent(true);
            alert('✅ Verification code sent to your email!');
        } else {
            console.error('Verification error:', result.error);
            setError(`Failed to send verification email: ${result.error}`);
        }

        setLoading(false);
    };

    const handleVerify = async (inputCode) => {
        const result = verifyCode(formData.email, inputCode);

        if (result.success) {
            setIsVerified(true);
            setShowVerificationModal(false);
            alert('✅ Email verified successfully!');
            return { success: true };
        } else {
            return { success: false, error: result.error };
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Check if email is verified
        if (!isVerified) {
            return setError('Please verify your email address first');
        }

        // Validation
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        if (formData.password.length < 6) {
            return setError('Password must be at least 6 characters');
        }

        setLoading(true);

        try {
            await signup(formData.email, formData.password, formData.name);
            alert("Registration successful! You can now login.");
            navigate('/login');
        } catch (err) {
            setError(err.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cream flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-primary font-serif">
                    Create a new account
                </h2>
                <p className="mt-2 text-center text-sm text-slate-light">
                    Or{' '}
                    <Link to="/login" className="font-medium text-secondary hover:text-secondary-dark transition-colors">
                        sign in to your existing account
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-primary">
                                Full Name
                            </label>
                            <div className="mt-1">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-primary">
                                Email address
                            </label>
                            <div className="mt-1 flex gap-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={isVerified}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm transition-colors disabled:bg-gray-50"
                                />
                                {isVerified ? (
                                    <div className="flex items-center px-3 py-2 bg-green-50 border border-green-200 rounded-xl">
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={sendVerificationCode}
                                        disabled={loading || !formData.email}
                                        className="px-4 py-2 bg-secondary text-white rounded-xl hover:bg-secondary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap text-sm font-medium"
                                    >
                                        <Mail className="h-4 w-4 inline mr-1" />
                                        Verify
                                    </button>
                                )}
                            </div>
                            {!isVerified && (
                                <p className="mt-1 text-xs text-slate-light">
                                    Click "Verify" to receive a verification code
                                </p>
                            )}
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
                                    autoComplete="new-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
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

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-primary">
                                Confirm Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm transition-colors pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading || !isVerified}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-xl shadow-md text-sm font-medium text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {loading ? 'Creating account...' : 'Sign up'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <VerificationModal
                isOpen={showVerificationModal}
                onClose={() => setShowVerificationModal(false)}
                email={formData.email}
                onVerify={handleVerify}
                onResend={sendVerificationCode}
            />
        </div>
    );
};

export default Register;
