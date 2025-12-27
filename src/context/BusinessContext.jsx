import React, { createContext, useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FirestoreBusinessService } from '../services/firebase/FirestoreBusinessService';

const BusinessContext = createContext();
const businessService = new FirestoreBusinessService();

export const useBusiness = () => {
    const context = useContext(BusinessContext);
    // If used outside provider (e.g. global login), return null context
    if (!context) {
        return {
            currentBusiness: null,
            loading: false,
            isBusinessContext: false
        };
    }
    return context;
};

export const BusinessProvider = ({ children }) => {
    const { businessSlug } = useParams();
    const [currentBusiness, setCurrentBusiness] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBusiness = async () => {
            if (businessSlug) {
                setLoading(true);
                try {
                    console.log(`[BusinessContext] Fetching business for slug: '${businessSlug}'`);
                    const business = await businessService.getBusinessBySlug(businessSlug);
                    console.log(`[BusinessContext] Fetch result:`, business);

                    if (business) {
                        setCurrentBusiness(business);
                    } else {
                        console.error(`[BusinessContext] Business not found: '${businessSlug}'`);
                        setCurrentBusiness(null);
                    }
                } catch (err) {
                    console.error("Error fetching business:", err);
                    setCurrentBusiness(null);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false); // Not in a business route
            }
        };

        fetchBusiness();
    }, [businessSlug]);

    const value = {
        currentBusiness,
        loading,
        isBusinessContext: !!businessSlug
    };

    return (
        <BusinessContext.Provider value={value}>
            {children}
        </BusinessContext.Provider>
    );
};
