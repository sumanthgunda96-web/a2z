import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    sendPasswordResetEmail,
    sendEmailVerification as firebaseSendEmailVerification,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { IAuthService } from '../interfaces';
import { logUserToSheets } from '../../utils/sheetsService';

export class FirebaseAuthService extends IAuthService {
    async login(email, password) {
        return await signInWithEmailAndPassword(auth, email, password);
    }

    async loginWithGoogle() {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check if user exists in Firestore, if not create basic record
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (!userDoc.exists()) {
                await setDoc(doc(db, 'users', user.uid), {
                    uid: user.uid,
                    email: user.email,
                    name: user.displayName,
                    photoURL: user.photoURL,
                    role: 'user', // Default role for Google Sign-In
                    createdAt: new Date().toISOString()
                });
            }

            return user;
        } catch (error) {
            console.error("Google Sign-In Error:", error);
            throw error;
        }
    }

    async register(email, password, name) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update profile with name
        await updateProfile(user, { displayName: name });

        // Create user document in Firestore (keeping existing logic)
        const userData = {
            uid: user.uid,
            email: user.email,
            name: name,
            createdAt: new Date().toISOString(),
            role: 'user' // Default role
        };

        await setDoc(doc(db, 'users', user.uid), userData);

        // Keep the existing side-effect for now, or move it to a higher level
        // For adherence to Single Responsibility, this might belong in a "UserOnboardingService", 
        // but to minimize drift we'll keep it here as in the original AuthContext.
        try {
            logUserToSheets({
                userId: user.uid,
                name: name,
                email: email
            });
        } catch (e) {
            console.error("Failed to log to sheets", e);
        }

        return user;
    }

    async logout() {
        return await signOut(auth);
    }

    async resetPassword(email) {
        console.log("FirebaseAuthService: sending password reset email to", email);
        try {
            await sendPasswordResetEmail(auth, email);
            console.log("FirebaseAuthService: reset email sent successfully");
            return true;
        } catch (error) {
            console.error("FirebaseAuthService: reset email failed", error);
            throw error;
        }
    }

    async sendEmailVerification(user) {
        console.log("Sending verification email to:", user.email);
        return await firebaseSendEmailVerification(user);
    }

    async updateProfile(userId, updates) {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, updates);
        return true;
    }

    onAuthStateChanged(callback) {
        return onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Fetch additional user data from Firestore
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        callback({ ...user, ...userDoc.data() });
                    } else {
                        callback(user);
                    }
                } catch (error) {
                    console.error("Error fetching user detail", error);
                    callback(user);
                }
            } else {
                callback(null);
            }
        });
    }
}
