const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Initialize Firebase Admin
try {
    const serviceAccount = require('./config/serviceAccountKey.json');
    if (admin.apps.length === 0) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log("[Server] Firebase Admin Initialized.");
    }
} catch (error) {
    console.error("[Server] Firebase Admin Setup Failed:", error.message);
}

// Routes
app.get('/', (req, res) => {
    res.send('A2Z Backend is Running!');
});

// --- USER MANAGEMENT ---

app.get('/api/admin/users', async (req, res) => {
    try {
        const listUsersResult = await admin.auth().listUsers(1000);
        const users = listUsersResult.users.map(u => ({
            uid: u.uid,
            email: u.email,
            displayName: u.displayName,
            disabled: u.disabled,
            metadata: u.metadata
        }));
        res.json(users);
    } catch (error) {
        console.error("[API] Error fetching users:", error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/admin/ban-user', async (req, res) => {
    const { uid, disabled } = req.body;
    console.log(`[API] Request to ${disabled ? 'BAN' : 'UNBAN'} user: ${uid}`);
    try {
        await admin.auth().updateUser(uid, { disabled: disabled });
        console.log(`[API] Success: User ${uid} updated.`);
        res.json({ success: true, message: `User ${uid} is now ${disabled ? 'Banned' : 'Active'}` });
    } catch (error) {
        console.error(`[API] Error updating user ${uid}:`, error.message);
        res.status(500).json({ error: error.message });
    }
});

// --- BUSINESS MANAGEMENT ---

// Placeholder: Store management currently handled by Frontend Client SDK
app.get('/api/admin/businesses', (req, res) => {
    res.status(501).json({ error: "Use Client SDK for now due to backend conflict" });
});

app.post('/api/admin/business-status', (req, res) => {
    res.status(501).json({ error: "Use Client SDK for now due to backend conflict" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
