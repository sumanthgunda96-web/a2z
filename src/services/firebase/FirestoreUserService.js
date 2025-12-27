import { db } from '../../config/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, getDoc, setDoc } from 'firebase/firestore';

export class FirestoreUserService {

    /**
     * Fetch all users from the database.
     * @returns {Promise<Array>} List of user objects
     */
    async getAllUsers() {
        try {
            const usersSnap = await getDocs(collection(db, 'users'));
            return usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error;
        }
    }

    /**
     * Get a single user by ID.
     * @param {string} userId 
     * @returns {Promise<Object|null>} User data or null
     */
    async getUser(userId) {
        try {
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (userDoc.exists()) {
                return { id: userDoc.id, ...userDoc.data() };
            }
            return null;
        } catch (error) {
            console.error("Error fetching user:", error);
            throw error;
        }
    }

    /**
     * Update a user's role.
     * @param {string} userId 
     * @param {string} newRole 
     */
    async updateUserRole(userId, newRole) {
        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, { role: newRole });
            return true;
        } catch (error) {
            console.error("Error updating user role:", error);
            throw error;
        }
    }

    /**
     * Update a user's status (e.g., 'active', 'banned').
     * @param {string} userId 
     * @param {string} status 
     */
    async updateUserStatus(userId, status) {
        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, { status: status, updatedAt: new Date().toISOString() });
            return true;
        } catch (error) {
            console.error("Error updating user status:", error);
            throw error;
        }
    }

    /**
     * Delete a user profile from the database.
     * NOTE: This does NOT delete the Auth account (Client SDK limitation).
     * @param {string} userId 
     */
    async deleteUser(userId) {
        try {
            await deleteDoc(doc(db, 'users', userId));
            return true;
        } catch (error) {
            console.error("Error deleting user:", error);
            throw error;
        }
    }

    /**
     * Create or overwrite a user document (e.g. for Super Admin creation).
     * @param {string} userId 
     * @param {Object} data 
     */
    async createUser(userId, data) {
        try {
            await setDoc(doc(db, 'users', userId), data, { merge: true });
            return true;
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    }
}
