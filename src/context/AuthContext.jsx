import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile as firebaseUpdateProfile,
    sendPasswordResetEmail,
    fetchSignInMethodsForEmail
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { logUserToSheets } from '../utils/sheetsService';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Fetch additional user data from Firestore
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    setCurrentUser({ ...user, ...userDoc.data() });
                } else {
                    setCurrentUser(user);
                }
            } else {
                setCurrentUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const signup = async (email, password, name) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Update profile with name
            await firebaseUpdateProfile(user, { displayName: name });

            // Create user document in Firestore
            const userData = {
                uid: user.uid,
                email: user.email,
                name: name,
                createdAt: new Date().toISOString(),
                role: 'user' // Default role
            };

            await setDoc(doc(db, 'users', user.uid), userData);

            // Log to Google Sheets
            logUserToSheets({
                userId: user.uid,
                name: name,
                email: email
            });

            return user;
        } catch (error) {
            throw error;
        }
    };

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        return signOut(auth);
    };

    const updateProfile = async (userId, updates) => {
        if (!currentUser) throw new Error('No user logged in');

        const userRef = doc(db, 'users', userId);

        // Update Firestore
        await updateDoc(userRef, updates);

        // Update local state
        setCurrentUser(prev => ({ ...prev, ...updates }));

        // If email/password updates are needed, they require re-authentication usually, 
        // which is complex. For now, we'll stick to profile data updates.
        return true;
    };

    const resetPassword = (email) => {
        return sendPasswordResetEmail(auth, email);
    };

    const verifyEmail = async (email) => {
        try {
            const methods = await fetchSignInMethodsForEmail(auth, email);
            return methods.length > 0;
        } catch (error) {
            return false;
        }
    };

    const value = {
        currentUser,
        signup,
        login,
        logout,
        updateProfile,
        resetPassword,
        verifyEmail,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
