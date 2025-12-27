import { db } from '../../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export class FirestoreLoggerService {
    constructor() {
        this.collectionName = 'system_logs';
    }

    /**
     * Logs an error to Firestore and returns a reference ID.
     * @param {Error} error - The error object.
     * @param {Object} context - Additional context (user ID, url, etc.).
     * @returns {Promise<string>} - The log reference ID (e.g., A2Z-ERR-123456).
     */
    async logError(error, context = {}) {
        try {
            const refId = `A2Z-ERR-${Date.now().toString().slice(-6)}`;

            const logEntry = {
                refId: refId,
                timestamp: serverTimestamp(),
                message: error.message || 'Unknown Error',
                stack: error.stack || '',
                type: 'error',
                url: window.location.href,
                userAgent: navigator.userAgent,
                userId: context.userId || null,
                userEmail: context.userEmail || null,
                additionalInfo: context
            };

            await addDoc(collection(db, this.collectionName), logEntry);

            console.log(`[Logger] Error logged: ${refId}`);
            return refId;
        } catch (loggingError) {
            console.error("Failed to log error to Firestore:", loggingError);
            return `FALLBACK-${Date.now()}`;
        }
    }

    /**
     * Fetches recent system logs.
     * @param {number} limitCount - Number of logs to fetch.
     * @returns {Promise<Array>} - List of log entries.
     */
    async getSystemLogs(limitCount = 50) {
        try {
            const { getDocs, query, orderBy, limit } = await import('firebase/firestore');
            const q = query(
                collection(db, this.collectionName),
                orderBy('timestamp', 'desc'),
                limit(limitCount)
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Failed to fetch system logs:", error);
            throw error;
        }
    }
}
