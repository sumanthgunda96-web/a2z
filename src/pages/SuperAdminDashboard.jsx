import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ApiService from '../services/api/ApiService';
import { FirestoreBusinessService } from '../services/firebase/FirestoreBusinessService';
import { FirestoreLoggerService } from '../services/firebase/FirestoreLoggerService';
import { Shield, Home, Lock, Mail, Key, Store, AlertTriangle, CheckCircle, Activity, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const SuperAdminDashboard = () => {
    const { currentUser, login, signup, logout } = useAuth();
    const apiService = new ApiService();
    const businessService = new FirestoreBusinessService();
    const loggerService = new FirestoreLoggerService();

    // Config
    const HARDCODED_ADMINS = ['sumanthgunda96@gmail.com', 'sumanthgunda724@gmail.com'];
    const ADMIN_SECRET = "A2Z_Admin_2025";

    // Auth State
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secretCode, setSecretCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Dashboard State
    const [activeTab, setActiveTab] = useState('users'); // 'users', 'stores', 'logs'
    const [expandedLogId, setExpandedLogId] = useState(null);

    // Data State
    const [users, setUsers] = useState([]);
    const [businesses, setBusinesses] = useState([]);
    const [errorLogs, setErrorLogs] = useState([]);
    const [dataLoading, setDataLoading] = useState(false);

    // Debug & Confirmation State
    const [logs, setLogs] = useState([]);
    const [confirmingAction, setConfirmingAction] = useState(null);

    const addLog = (msg) => {
        const time = new Date().toLocaleTimeString();
        setLogs(prev => [`[${time}] ${msg}`, ...prev]);
    };

    // --- Data Loading ---

    const handleLoadData = async () => {
        setDataLoading(true);
        addLog(`Fetching ${activeTab} list...`);
        try {
            if (activeTab === 'users') {
                const data = await apiService.getAllUsers();
                addLog(`Fetched ${data.length} users.`);
                setUsers(data);
            } else if (activeTab === 'stores') {
                const data = await businessService.getAllBusinesses();
                addLog(`Fetched ${data.length} businesses.`);
                setBusinesses(data);
            } else if (activeTab === 'logs') {
                const data = await loggerService.getSystemLogs(50);
                addLog(`Fetched ${data.length} error logs.`);
                setErrorLogs(data);
            }
        } catch (err) {
            addLog(`Error fetching ${activeTab}: ${err.message}`);
            alert(`Failed to load ${activeTab}: ` + err.message);
        } finally {
            setDataLoading(false);
        }
    };

    // --- User Actions --- (Backend API)

    const initiateBanToggle = (user) => {
        const isBanned = !!user.disabled;
        const action = isBanned ? "Unban" : "Ban";
        setConfirmingAction({ id: user.uid, action, type: 'user' });
        addLog(`REQUEST: ${action} for ${user.email}. Waiting for confirmation...`);
    };

    const executeBanToggle = async (user) => {
        const isBanned = !!user.disabled;
        const action = isBanned ? "Unban" : "Ban";
        const newStatus = !isBanned;

        setConfirmingAction(null);
        addLog(`CONFIRMED: Executing ${action} for User...`);

        // Optimistic Update
        const previousUsers = [...users];
        setUsers(users.map(u => u.uid === user.uid ? { ...u, disabled: newStatus } : u));

        try {
            const response = await apiService.toggleUserBan(user.uid, newStatus);
            if (response && response.success) {
                addLog(`SUCCESS: User is now ${newStatus ? 'BANNED' : 'ACTIVE'}`);
            } else {
                throw new Error(response.error || "Unknown API Error");
            }
        } catch (err) {
            addLog(`ERROR: ${err.message}`);
            setUsers(previousUsers); // Revert
            alert(`Failed to ${action}: ${err.message}`);
        }
    };

    // --- Business Actions --- (Client Service)

    const initiateBusinessAction = (biz) => {
        const isSuspended = biz.status === 'suspended';
        const action = isSuspended ? "Restore" : "Suspend";
        setConfirmingAction({ id: biz.id, action, type: 'business' });
        addLog(`REQUEST: ${action} for ${biz.businessName}. Waiting for confirmation...`);
    };

    const executeBusinessAction = async (biz) => {
        const isSuspended = biz.status === 'suspended';
        const action = isSuspended ? "Restore" : "Suspend";
        const newStatus = isSuspended ? 'active' : 'suspended';

        setConfirmingAction(null);
        addLog(`CONFIRMED: Executing ${action} for Business...`);

        // Optimistic Update
        const previousBusinesses = [...businesses];
        setBusinesses(businesses.map(b => b.id === biz.id ? { ...b, status: newStatus } : b));

        try {
            // Use Client Service for Status Update
            await businessService.updateBusinessStatus(biz.id, newStatus);
            addLog(`SUCCESS: Business is now ${newStatus.toUpperCase()}`);
        } catch (err) {
            addLog(`ERROR: ${err.message}`);
            setBusinesses(previousBusinesses); // Revert
            alert(`Failed to ${action} business: ${err.message}`);
        }
    };

    // --- Auth & Render ---

    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isLoginMode) {
                await login(email, password);
            } else {
                if (secretCode !== ADMIN_SECRET) throw new Error("Invalid Secret Key");
                await signup(email, password, 'Super Admin');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!currentUser) return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full">
                <div className="text-center mb-6">
                    <Shield className="w-12 h-12 text-indigo-600 mx-auto mb-2" />
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Super Admin Access</h2>
                </div>
                {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
                <form onSubmit={handleAuth} className="space-y-4">
                    <input className="w-full p-3 border rounded-lg bg-gray-50" placeholder="Email" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
                    <input className="w-full p-3 border rounded-lg bg-gray-50" placeholder="Password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
                    {!isLoginMode && <input className="w-full p-3 border rounded-lg bg-indigo-50 border-indigo-100" placeholder="Secret Key" type="text" required value={secretCode} onChange={e => setSecretCode(e.target.value)} />}
                    <button disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition shadow-lg">{loading ? "Processing..." : (isLoginMode ? "Login" : "Create Account")}</button>
                </form>
                <div className="mt-4 text-center">
                    <button onClick={() => setIsLoginMode(!isLoginMode)} className="text-sm text-gray-500 hover:text-indigo-600 underline">{isLoginMode ? "Need to create an admin account?" : "Back to Login"}</button>
                </div>
            </div>
        </div>
    );

    if (!HARDCODED_ADMINS.includes(currentUser.email)) return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow text-center">
                <h1 className="text-red-600 font-bold text-xl mb-4">Access Restricted</h1>
                <p>You are not a Super Admin.</p>
                <button onClick={logout} className="mt-4 bg-black text-white px-4 py-2 rounded">Logout</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-6xl">

                {/* Debug Console */}
                <div className="mb-6 bg-black text-green-400 p-4 rounded font-mono text-xs h-32 overflow-y-auto border-2 border-green-700">
                    <div className="flex justify-between border-b border-green-800 mb-1 pb-1">
                        <span className="font-bold">DEBUG CONSOLE</span>
                        <span className="text-[10px]">Real-time system events</span>
                    </div>
                    {logs.length === 0 ? <p className="opacity-50">Waiting for interaction...</p> : logs.map((l, i) => <div key={i}>{l}</div>)}
                </div>

                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Shield /> Super Admin Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-slate-500">{currentUser.email}</span>
                        <button onClick={logout} className="text-red-500 font-bold hover:underline">Logout</button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-6 py-3 font-bold text-sm transition-colors ${activeTab === 'users' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Users
                    </button>
                    <button
                        onClick={() => setActiveTab('stores')}
                        className={`px-6 py-3 font-bold text-sm transition-colors ${activeTab === 'stores' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Stores
                    </button>
                    <button
                        onClick={() => setActiveTab('logs')}
                        className={`px-6 py-3 font-bold text-sm transition-colors flex items-center gap-2 ${activeTab === 'logs' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <AlertTriangle className="w-4 h-4" /> System Logs
                    </button>
                </div>

                <div className="mb-6 flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                        Viewing: <span className="font-bold text-gray-900 uppercase">{activeTab}</span>
                    </div>
                    <button onClick={handleLoadData} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition shadow-sm">
                        {dataLoading ? "Loading..." : "Refresh List"}
                    </button>
                </div>

                {/* USERS TABLE */}
                {activeTab === 'users' && (
                    <>
                        {users.length > 0 ? (
                            <div className="overflow-hidden rounded-lg border border-gray-200">
                                <table className="w-full text-left bg-white text-sm">
                                    <thead className="bg-gray-100 text-gray-600 uppercase font-bold">
                                        <tr>
                                            <th className="px-4 py-3">User</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {users.map(u => (
                                            <tr key={u.uid} className={`hover:bg-gray-50 ${u.disabled ? 'bg-red-50' : ''}`}>
                                                <td className="px-4 py-3">
                                                    <div className="font-bold text-gray-900">{u.displayName || 'No Name'}</div>
                                                    <div className="text-xs text-gray-500">{u.email}</div>
                                                    <div className="text-[10px] text-gray-400 font-mono">{u.uid}</div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {u.disabled ? <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold inline-flex items-center gap-1"><Lock className="w-3 h-3" /> BANNED</span>
                                                        : <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold inline-flex items-center gap-1"><CheckCircle className="w-3 h-3" /> ACTIVE</span>}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    {confirmingAction?.id === u.uid && confirmingAction?.type === 'user' ? (
                                                        <div className="flex justify-end gap-2">
                                                            <button onClick={() => executeBanToggle(u)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 font-bold animate-pulse text-xs">
                                                                Confirm {confirmingAction.action}?
                                                            </button>
                                                            <button onClick={() => setConfirmingAction(null)} className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 font-bold text-xs">
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button onClick={() => initiateBanToggle(u)} className={`px-3 py-1 rounded font-bold text-white text-xs shadow-sm ${u.disabled ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                                                            {u.disabled ? "Unban User" : "Ban User"}
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-400 border-2 border-dashed rounded">No users loaded. Click "Refresh List".</div>
                        )}
                    </>
                )}

                {/* STORES TABLE */}
                {activeTab === 'stores' && (
                    <>
                        {businesses.length > 0 ? (
                            <div className="overflow-hidden rounded-lg border border-gray-200">
                                <table className="w-full text-left bg-white text-sm">
                                    <thead className="bg-gray-100 text-gray-600 uppercase font-bold">
                                        <tr>
                                            <th className="px-4 py-3">Business</th>
                                            <th className="px-4 py-3">Contact</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {businesses.map(b => (
                                            <tr key={b.id} className={`hover:bg-gray-50 ${b.status === 'suspended' ? 'bg-red-50' : ''}`}>
                                                <td className="px-4 py-3">
                                                    <div className="font-bold text-gray-900">{b.businessName || 'No Name'}</div>
                                                    <div className="text-xs text-gray-500 max-w-[200px] truncate">{b.description}</div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="text-gray-900 text-xs">{b.email}</div>
                                                    <div className="text-gray-500 text-xs">{b.phone}</div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {b.status === 'suspended' ? (
                                                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold inline-flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> SUSPENDED</span>
                                                    ) : b.status === 'pending' ? (
                                                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold inline-flex items-center gap-1">PENDING</span>
                                                    ) : (
                                                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold inline-flex items-center gap-1"><CheckCircle className="w-3 h-3" /> ACTIVE</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    {confirmingAction?.id === b.id && confirmingAction?.type === 'business' ? (
                                                        <div className="flex justify-end gap-2">
                                                            <button onClick={() => executeBusinessAction(b)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 font-bold animate-pulse text-xs">
                                                                Confirm {confirmingAction.action}?
                                                            </button>
                                                            <button onClick={() => setConfirmingAction(null)} className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 font-bold text-xs">
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => initiateBusinessAction(b)}
                                                            className={`px-3 py-1 rounded font-bold text-white text-xs shadow-sm ${b.status === 'suspended' ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-500 hover:bg-orange-600'}`}
                                                        >
                                                            {b.status === 'suspended' ? "Restore Shop" : "Suspend Shop"}
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-400 border-2 border-dashed rounded">No businesses loaded. Click "Refresh List".</div>
                        )}
                    </>
                )}

                {/* LOGS TABLE (NEW) */}
                {activeTab === 'logs' && (
                    <>
                        {errorLogs.length > 0 ? (
                            <div className="overflow-hidden rounded-lg border border-red-200">
                                <table className="w-full text-left bg-white text-sm">
                                    <thead className="bg-red-50 text-red-800 uppercase font-bold">
                                        <tr>
                                            <th className="px-4 py-3">Time</th>
                                            <th className="px-4 py-3">Ticket ID</th>
                                            <th className="px-4 py-3">Error Message</th>
                                            <th className="px-4 py-3">Context</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-red-100">
                                        {errorLogs.map(l => (
                                            <React.Fragment key={l.id}>
                                                <tr
                                                    onClick={() => setExpandedLogId(expandedLogId === l.id ? null : l.id)}
                                                    className="hover:bg-red-50 cursor-pointer"
                                                >
                                                    <td className="px-4 py-3 text-xs text-gray-500">
                                                        {l.timestamp?.seconds ? new Date(l.timestamp.seconds * 1000).toLocaleString() : 'Just now'}
                                                    </td>
                                                    <td className="px-4 py-3 font-mono text-xs font-bold text-red-600">
                                                        {l.refId || l.id}
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-900 font-medium">
                                                        {l.message}
                                                    </td>
                                                    <td className="px-4 py-3 text-xs text-gray-500 truncate max-w-[200px]">
                                                        {l.userEmail || 'Anonymous'} - {l.url}
                                                    </td>
                                                </tr>
                                                {/* Expanded Details */}
                                                {expandedLogId === l.id && (
                                                    <tr className="bg-gray-900 text-gray-300 font-mono text-xs">
                                                        <td colSpan="4" className="p-4">
                                                            <div className="mb-2 text-green-400 font-bold">STACK TRACE:</div>
                                                            <pre className="whitespace-pre-wrap">{l.stack || 'No Stack Trace Available'}</pre>
                                                            <div className="mt-4 text-green-400 font-bold">USER AGENT:</div>
                                                            <div>{l.userAgent}</div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-400 border-2 border-dashed rounded">No system logs found (Good news!). Click "Refresh List".</div>
                        )}
                    </>
                )}

            </div>
        </div>
    );
};

export default SuperAdminDashboard;
