import React, { useState } from 'react';
import { logOrderToSheets, logUserToSheets } from '../utils/sheetsService';

const TestSheets = () => {
    const [orderResult, setOrderResult] = useState('');
    const [userResult, setUserResult] = useState('');
    const [loading, setLoading] = useState({ order: false, user: false });

    const testOrderLog = async () => {
        setLoading({ ...loading, order: true });
        setOrderResult('Testing...');

        const testOrder = {
            orderId: 'TEST-' + Date.now(),
            customerName: 'Test Customer',
            customerEmail: 'test@example.com',
            customerPhone: '1234567890',
            items: 'Test Item x1 - ₹500',
            total: '500',
            paymentMethod: 'Cash on Delivery',
            shippingAddress: 'Test Address, Test City, Test State - 123456',
        };

        console.log('🧪 Testing Orders Sheet:', testOrder);
        const response = await logOrderToSheets(testOrder);

        if (response.success) {
            setOrderResult('✅ SUCCESS! Check your "Orders" sheet!');
        } else {
            setOrderResult(`❌ FAILED: ${response.error || 'Unknown error'}`);
        }

        setLoading({ ...loading, order: false });
    };

    const testUserLog = async () => {
        setLoading({ ...loading, user: true });
        setUserResult('Testing...');

        const testUser = {
            userId: 'TEST-USER-' + Date.now(),
            name: 'Test User',
            email: 'testuser@example.com',
        };

        console.log('🧪 Testing Users Sheet:', testUser);
        const response = await logUserToSheets(testUser);

        if (response.success) {
            setUserResult('✅ SUCCESS! Check your "Users" sheet!');
        } else {
            setUserResult(`❌ FAILED: ${response.error || 'Unknown error'}`);
        }

        setLoading({ ...loading, user: false });
    };

    return (
        <div className="min-h-screen bg-cream py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-primary font-serif mb-4">
                        🧪 Google Sheets Test
                    </h1>

                    <p className="text-slate-light mb-6">
                        Test both Orders and Users sheet integration.
                    </p>

                    {/* Orders Test */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-primary mb-3">📦 Test Orders Sheet</h2>

                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                            <p className="text-sm text-blue-800">
                                This will add a test order to your "Orders" sheet.
                            </p>
                        </div>

                        <button
                            onClick={testOrderLog}
                            disabled={loading.order}
                            className="w-full bg-primary text-white py-3 px-6 rounded-xl hover:bg-primary-dark transition-all duration-300 font-medium shadow-md hover:shadow-lg transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mb-3"
                        >
                            {loading.order ? 'Testing...' : '🧪 Test Orders Sheet'}
                        </button>

                        {orderResult && (
                            <div className={`p-4 rounded-xl ${orderResult.includes('SUCCESS')
                                    ? 'bg-green-50 border border-green-200 text-green-800'
                                    : 'bg-red-50 border border-red-200 text-red-800'
                                }`}>
                                <pre className="whitespace-pre-wrap font-mono text-sm">{orderResult}</pre>
                            </div>
                        )}
                    </div>

                    {/* Users Test */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-primary mb-3">👤 Test Users Sheet</h2>

                        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-4">
                            <p className="text-sm text-purple-800">
                                This will add a test user to your "Users" sheet.
                            </p>
                        </div>

                        <button
                            onClick={testUserLog}
                            disabled={loading.user}
                            className="w-full bg-secondary text-white py-3 px-6 rounded-xl hover:bg-secondary/90 transition-all duration-300 font-medium shadow-md hover:shadow-lg transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mb-3"
                        >
                            {loading.user ? 'Testing...' : '🧪 Test Users Sheet'}
                        </button>

                        {userResult && (
                            <div className={`p-4 rounded-xl ${userResult.includes('SUCCESS')
                                    ? 'bg-green-50 border border-green-200 text-green-800'
                                    : 'bg-red-50 border border-red-200 text-red-800'
                                }`}>
                                <pre className="whitespace-pre-wrap font-mono text-sm">{userResult}</pre>
                            </div>
                        )}
                    </div>

                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl mb-6">
                        <h3 className="font-bold text-yellow-900 mb-2">How to test Users sheet in real app:</h3>
                        <ol className="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
                            <li>Logout if logged in</li>
                            <li>Go to Register page</li>
                            <li>Create a new account</li>
                            <li>Check your "Users" sheet - new row should appear!</li>
                        </ol>
                    </div>

                    <div className="mt-6 text-center">
                        <a
                            href="/"
                            className="text-secondary hover:underline"
                        >
                            ← Back to Home
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestSheets;
