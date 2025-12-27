import React, { createContext, useContext, useState, useEffect } from 'react';
import { FirestoreProductService } from '../services/firebase/FirestoreProductService';

import { useBusiness } from './BusinessContext';

const ProductContext = createContext();
const productService = new FirestoreProductService();

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
};

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentBusiness } = useBusiness();

    useEffect(() => {
        if (!currentBusiness) return;

        setLoading(true);
        // Subscribe to real-time updates
        const unsubscribe = productService.subscribeToProducts((updatedProducts) => {
            // Filter products for the current business
            // Includes legacy products (no businessId) ONLY for the main store
            const filteredProducts = updatedProducts.filter(p =>
                p.businessId === currentBusiness.id ||
                (!p.businessId && currentBusiness.slug === 'a2z-demo')
            );
            setProducts(filteredProducts);
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [currentBusiness]);

    const addProduct = async (productData) => {
        // No need to manually update state as subscription will catch it
        // But we still return the new product for the caller
        const newProduct = await productService.addProduct(productData, currentBusiness?.id);
        return newProduct;
    };

    const updateProduct = async (id, updates) => {
        await productService.updateProduct(id, updates);
    };

    const deleteProduct = async (id) => {
        await productService.deleteProduct(id);
    };

    const value = {
        products,
        loading,
        addProduct,
        updateProduct,
        deleteProduct
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};
