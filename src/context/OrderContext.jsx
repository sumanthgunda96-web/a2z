import React, { createContext, useContext, useState, useEffect } from 'react';

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

    useEffect(() => {
        // Load orders from localStorage on mount
        const savedOrders = localStorage.getItem('orders');
        if (savedOrders) {
            setOrders(JSON.parse(savedOrders));
        }
    }, []);

    const createOrder = (orderData) => {
        const newOrder = {
            id: `ORD-${Date.now()}`,
            ...orderData,
            status: 'pending',
            createdAt: new Date().toISOString(),
        };

        const updatedOrders = [newOrder, ...orders];
        setOrders(updatedOrders);
        localStorage.setItem('orders', JSON.stringify(updatedOrders));

        return newOrder;
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
