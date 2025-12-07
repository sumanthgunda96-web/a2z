import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, addDoc, query, where, getDocs, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const OrderContext = createContext();

export const useOrders = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useOrders must be used within an OrderProvider');
    }
    return context;
};

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const { currentUser } = useAuth();

    useEffect(() => {
        if (!currentUser) {
            setOrders([]);
            return;
        }

        // Real-time listener for user's orders
        const q = query(
            collection(db, 'orders'),
            where('userId', '==', currentUser.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const userOrders = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setOrders(userOrders);
        });

        return unsubscribe;
    }, [currentUser]);

    const createOrder = async (orderData) => {
        try {
            const newOrder = {
                ...orderData,
                status: 'pending',
                createdAt: new Date().toISOString(),
                // Ensure userId is attached if not already
                userId: currentUser ? currentUser.uid : 'guest'
            };

            const docRef = await addDoc(collection(db, 'orders'), newOrder);
            return { id: docRef.id, ...newOrder };
        } catch (error) {
            console.error("Error creating order: ", error);
            throw error;
        }
    };

    const getOrderById = (orderId) => {
        return orders.find(order => order.id === orderId);
    };

    const getUserOrders = (userId) => {
        return orders.filter(order => order.userId === userId);
    };

    const value = {
        orders,
        createOrder,
        getOrderById,
        getUserOrders,
    };

    return (
        <OrderContext.Provider value={value}>
            {children}
        </OrderContext.Provider>
    );
};
