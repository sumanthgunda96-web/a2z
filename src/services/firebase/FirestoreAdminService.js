import { db } from '../../config/firebase';
import { collection, doc, setDoc, getDoc, deleteDoc, getDocs, query, where, updateDoc } from 'firebase/firestore';

export class FirestoreAdminService {

    // --- BANNED USERS MANAGEMENT (The "Blacklist") ---

    /**
     * Block a user by adding them to the 'banned_users' collection.
     * This bypasses the need to write to the 'users' collection which might be protected.
     * @param {string} userId 
     * @param {string} email 
     * @param {string} reason 
     */
    async banUser(userId, email, reason = "Violated terms") {
        try {
            const banRef = doc(db, 'banned_users', userId); // Use userId as doc ID for easy lookup
            await setDoc(banRef, {
                uid: userId,
                email: email,
                reason: reason,
                bannedAt: new Date().toISOString(),
                bannedBy: 'Super Admin'
            });
            return true;
        } catch (error) {
            console.error("Admin Service: Block User Failed", error);
            throw error;
        }
    }

    /**
     * Unblock a user by removing them from the 'banned_users' collection.
     * @param {string} userId 
     */
    async unbanUser(userId) {
        try {
            const banRef = doc(db, 'banned_users', userId);
            await deleteDoc(banRef);
            return true;
        } catch (error) {
            console.error("Admin Service: Unblock User Failed", error);
            throw error;
        }
    }

    /**
     * Check if a user is banned.
     * @param {string} userId 
     */
    async isUserBanned(userId) {
        try {
            if (!userId) return false;
            const banRef = doc(db, 'banned_users', userId);
            const banDoc = await getDoc(banRef);
            return banDoc.exists();
        } catch (error) {
            console.error("Admin Service: Check Ban Failed", error);
            return false; // Default to allow if DB fails, or true if strict? Default false for UX.
        }
    }

    /**
     * Get all banned users.
     */
    async getAllBannedUsers() {
        try {
            const q = query(collection(db, 'banned_users'));
            const snap = await getDocs(q);
            return snap.docs.map(d => d.data());
        } catch (error) {
            console.error("Admin Service: Get All Bans Failed", error);
            throw error;
        }
    }


    // --- BUSINESS MANAGEMENT ---

    async updateBusinessStatus(businessId, status) {
        try {
            const ref = doc(db, 'businesses', businessId);
            await updateDoc(ref, {
                status: status,
                updatedAt: new Date().toISOString()
            });
            return true;
        } catch (error) {
            console.error("Admin Service: Update Biz Status Failed", error);
            throw error;
        }
    }
}
