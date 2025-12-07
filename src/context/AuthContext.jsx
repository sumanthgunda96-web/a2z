import React, { createContext, useContext, useState, useEffect } from 'react';
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
        // Check if user is logged in on mount
        const user = localStorage.getItem('currentUser');
        if (user) {
            try {
                setCurrentUser(JSON.parse(user));
            } catch (error) {
                console.error('Failed to parse currentUser from localStorage', error);
                localStorage.removeItem('currentUser');
            }
        }
        setLoading(false);
    }, []);

    const signup = (email, password, name) => {
        // Get existing users
        const users = JSON.parse(localStorage.getItem('users') || '[]');

        // Check if user already exists
        if (users.find(u => u.email === email)) {
            throw new Error('User already exists with this email');
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            email,
            password, // In production, this should be hashed!
            name,
            createdAt: new Date().toISOString()
        };

        // Save to users array
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Log to Google Sheets
        logUserToSheets({
            userId: newUser.id,
            name: newUser.name,
            email: newUser.email
        });

        return newUser;
    };

    const login = (email, password) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Set current user
        const userWithoutPassword = { ...user };
        delete userWithoutPassword.password;

        setCurrentUser(userWithoutPassword);
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

        return userWithoutPassword;
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
    };

    const updateProfile = (userId, updates, currentPassword = null) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            throw new Error('User not found');
        }

        const user = users[userIndex];

        // Verify current password if changing password or sensitive info
        if (updates.password) {
            if (!currentPassword) {
                throw new Error('Current password is required to set a new password');
            }
            if (user.password !== currentPassword) {
                throw new Error('Incorrect current password');
            }
        }

        // Check if email is being updated and if it's already taken
        if (updates.email && updates.email !== user.email) {
            if (users.find(u => u.email === updates.email)) {
                throw new Error('Email already in use');
            }
        }

        // Update user
        const updatedUser = { ...user, ...updates };
        users[userIndex] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));

        // Update current user session if it's the logged-in user
        if (currentUser && currentUser.id === userId) {
            const userWithoutPassword = { ...updatedUser };
            delete userWithoutPassword.password;
            setCurrentUser(userWithoutPassword);
            localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        }

        return updatedUser;
    };

    const resetPassword = (email, newPassword) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.email === email);

        if (userIndex === -1) {
            throw new Error('User not found with this email');
        }

        const user = users[userIndex];
        const updatedUser = { ...user, password: newPassword };
        users[userIndex] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));

        return true;
    };

    const verifyEmail = (email) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        return users.some(u => u.email === email);
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
