import React from 'react';
import { FirestoreLoggerService } from '../services/firebase/FirestoreLoggerService';
import { auth } from '../config/firebase'; // Direct access to auth for error logging context

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, refId: null };
        this.logger = new FirestoreLoggerService();
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log to console
        console.error("Uncaught error:", error, errorInfo);

        // Capture user info safely
        const user = auth.currentUser;
        const context = {
            componentStack: errorInfo.componentStack,
            userId: user ? user.uid : 'anonymous',
            userEmail: user ? user.email : 'anonymous'
        };

        // Log to Firestore
        this.logger.logError(error, context).then(id => {
            this.setState({ refId: id });
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center border border-gray-100">
                        <div className="bg-red-50 text-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
                        <p className="text-gray-500 mb-6 text-sm">We've tracked this issue and our team has been notified.</p>

                        <div className="bg-gray-50 p-3 rounded-lg mb-6 text-left">
                            <p className="text-xs text-gray-500 font-semibold uppercase">Ticket Reference</p>
                            <p className="text-sm font-mono text-gray-800 break-all">
                                {this.state.refId ? this.state.refId : 'Generating ticket...'}
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm"
                            >
                                Refresh Page
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
