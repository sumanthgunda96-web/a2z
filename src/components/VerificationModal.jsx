import React, { useState, useEffect } from 'react';
import { X, Mail, Clock } from 'lucide-react';

const VerificationModal = ({ isOpen, onClose, email, onVerify, onResend }) => {
    const [code, setCode] = useState('');
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isOpen]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await onVerify(code);

        if (!result.success) {
            setError(result.error);
            setLoading(false);
        } else {
            // Success handled by parent
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setError('');
        setTimeLeft(600); // Reset timer
        setCode('');
        await onResend();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X className="h-6 w-6" />
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/10 rounded-full mb-4">
                        <Mail className="h-8 w-8 text-secondary" />
                    </div>
                    <h2 className="text-2xl font-bold text-primary font-serif">Verify Your Email</h2>
                    <p className="text-slate-light mt-2">
                        We sent a 6-digit code to<br />
                        <span className="font-medium text-primary">{email}</span>
                    </p>
                </div>

                {/* Timer */}
                <div className="flex items-center justify-center gap-2 mb-6 text-sm text-slate-light">
                    <Clock className="h-4 w-4" />
                    <span>Code expires in: <span className="font-bold text-secondary">{formatTime(timeLeft)}</span></span>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Verification Code
                        </label>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="Enter 6-digit code"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent text-center text-2xl font-bold tracking-widest"
                            maxLength={6}
                            required
                            autoFocus
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || code.length !== 6}
                        className="w-full bg-secondary text-white py-3 px-6 rounded-xl hover:bg-secondary/90 transition-all duration-300 font-medium shadow-md hover:shadow-lg transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Verifying...' : 'Verify Email'}
                    </button>
                </form>

                {/* Resend */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-slate-light mb-2">Didn't receive the code?</p>
                    <button
                        onClick={handleResend}
                        disabled={timeLeft > 540} // Can resend after 1 minute
                        className="text-secondary hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
                    >
                        Resend Code
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerificationModal;
