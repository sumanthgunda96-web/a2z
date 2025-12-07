import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, LogOut, Shield, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { generateVerificationCode, storeVerificationCode, verifyCode } from '../utils/verificationService';
import { sendVerificationEmail } from '../utils/emailService';
import VerificationModal from '../components/VerificationModal';

const Profile = () => {
    const { currentUser, logout, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    // Verification state
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [pendingUpdates, setPendingUpdates] = useState(null);

    if (!currentUser) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <p className="text-xl text-slate-light">Please log in to view your profile.</p>
            </div>
        );
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleVerify = async (inputCode) => {
        const result = verifyCode(formData.email, inputCode);

        if (result.success) {
            setShowVerificationModal(false);
            // Proceed with the update
            await executeUpdate(pendingUpdates);
            return { success: true };
        } else {
            return { success: false, error: result.error };
        }
    };

    const executeUpdate = async (updates) => {
        try {
            await updateProfile(currentUser.uid, updates, formData.currentPassword);
            setSuccess('Profile updated successfully!');
            setIsEditing(false);
            setFormData({
                name: updates.name || currentUser.name,
                email: updates.email || currentUser.email,
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: ''
            });
            setPendingUpdates(null);
        } catch (err) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const updates = {
                name: formData.name,
                email: formData.email
            };

            // Password validation
            if (formData.newPassword) {
                if (!formData.currentPassword) {
                    throw new Error("Current password is required to set a new password");
                }
                if (formData.newPassword !== formData.confirmNewPassword) {
                    throw new Error("New passwords don't match");
                }
                if (formData.newPassword.length < 6) {
                    throw new Error("Password must be at least 6 characters");
                }
                updates.password = formData.newPassword;
            }

            // Email verification check
            if (formData.email !== currentUser.email) {
                // Send verification code
                const code = generateVerificationCode();
                storeVerificationCode(formData.email, code);
                const result = await sendVerificationEmail(formData.email, code);

                if (result.success) {
                    setPendingUpdates(updates);
                    setShowVerificationModal(true);
                    // Don't finish loading yet, waiting for verification
                    return;
                } else {
                    throw new Error(`Failed to send verification email: ${result.error}`);
                }
            }

            // If no email change, proceed directly
            await executeUpdate(updates);

        } catch (err) {
            setError(err.message || 'Failed to update profile');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cream py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                    {/* Header Background */}
                    <div className="bg-secondary h-32 w-full relative">
                        <div className="absolute -bottom-12 left-8">
                            <div className="h-24 w-24 bg-white rounded-full p-1 shadow-lg">
                                <div className="h-full w-full bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                                    <User className="h-12 w-12" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className="pt-16 pb-8 px-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-3xl font-serif font-bold text-primary">{currentUser.name}</h1>
                                <p className="text-slate-light flex items-center mt-1">
                                    <Mail className="h-4 w-4 mr-2" />
                                    {currentUser.email}
                                </p>
                            </div>
                            <span className="px-4 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center">
                                <Shield className="h-3 w-3 mr-1" />
                                Verified Account
                            </span>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center">
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center">
                                <Shield className="h-4 w-4 mr-2" />
                                {success}
                            </div>
                        )}

                        <div className="border-t border-gray-100 pt-8 mt-8">
                            <h2 className="text-xl font-bold text-primary mb-4">Account Settings</h2>

                            <div className="space-y-4">
                                {/* Personal Information Section */}
                                <div className={`bg-gray-50 rounded-xl transition-all duration-300 ${isEditing ? 'p-6 ring-2 ring-secondary ring-opacity-50' : 'p-4 hover:bg-gray-100'}`}>
                                    <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => !isEditing && setIsEditing(true)}>
                                        <div className="flex items-center">
                                            <div className="bg-white p-2 rounded-lg shadow-sm mr-4">
                                                <User className="h-5 w-5 text-secondary" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-primary">Personal Information</p>
                                                <p className="text-sm text-slate-light">Update your name, email, and password</p>
                                            </div>
                                        </div>
                                        {!isEditing && <span className="text-gray-400">→</span>}
                                    </div>

                                    {isEditing && (
                                        <form onSubmit={handleSubmit} className="space-y-4 mt-4 border-t border-gray-200 pt-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary"
                                                    required
                                                />
                                                {formData.email !== currentUser.email && (
                                                    <p className="mt-1 text-xs text-orange-600 flex items-center">
                                                        <AlertTriangle className="h-3 w-3 mr-1" />
                                                        Changing email will require verification code
                                                    </p>
                                                )}
                                            </div>

                                            {/* Password Change Section */}
                                            <div className="border-t border-gray-200 pt-4 mt-4">
                                                <h3 className="text-sm font-medium text-primary mb-3">Change Password</h3>

                                                {formData.newPassword && (
                                                    <div className="mb-3">
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password <span className="text-red-500">*</span></label>
                                                        <div className="relative">
                                                            <input
                                                                type={showCurrentPassword ? "text" : "password"}
                                                                name="currentPassword"
                                                                value={formData.currentPassword}
                                                                onChange={handleChange}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary pr-10"
                                                                placeholder="Required to set new password"
                                                                required
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                                            >
                                                                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="mb-3">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                                    <div className="relative">
                                                        <input
                                                            type={showNewPassword ? "text" : "password"}
                                                            name="newPassword"
                                                            value={formData.newPassword}
                                                            onChange={handleChange}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary pr-10"
                                                            placeholder="Leave blank to keep current"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                                        >
                                                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                        </button>
                                                    </div>
                                                </div>

                                                {formData.newPassword && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                                        <div className="relative">
                                                            <input
                                                                type={showConfirmNewPassword ? "text" : "password"}
                                                                name="confirmNewPassword"
                                                                value={formData.confirmNewPassword}
                                                                onChange={handleChange}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary pr-10"
                                                                required
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                                            >
                                                                {showConfirmNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex justify-end gap-3 pt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsEditing(false);
                                                        setFormData({
                                                            name: currentUser.name,
                                                            email: currentUser.email,
                                                            currentPassword: '',
                                                            newPassword: '',
                                                            confirmNewPassword: ''
                                                        });
                                                        setError('');
                                                    }}
                                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="px-4 py-2 text-sm font-medium text-white bg-secondary rounded-lg hover:bg-secondary/90 disabled:opacity-50"
                                                >
                                                    {loading ? 'Saving...' : 'Save Changes'}
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>

                                <button
                                    onClick={logout}
                                    className="w-full flex items-center justify-between p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors text-left group"
                                >
                                    <div className="flex items-center">
                                        <div className="bg-white p-2 rounded-lg shadow-sm mr-4 group-hover:bg-red-50 transition-colors">
                                            <LogOut className="h-5 w-5 text-red-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-red-600">Sign Out</p>
                                            <p className="text-sm text-red-400">Log out of your account securely</p>
                                        </div>
                                    </div>
                                    <span className="text-red-400 group-hover:translate-x-1 transition-transform">→</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <VerificationModal
                isOpen={showVerificationModal}
                onClose={() => {
                    setShowVerificationModal(false);
                    setLoading(false);
                }}
                email={formData.email}
                onVerify={handleVerify}
                onResend={async () => {
                    const code = generateVerificationCode();
                    storeVerificationCode(formData.email, code);
                    await sendVerificationEmail(formData.email, code);
                }}
            />
        </div>
    );
};

export default Profile;
