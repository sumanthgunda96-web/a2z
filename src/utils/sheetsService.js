import { SHEETS_CONFIG } from '../config/sheetsConfig';

export const logOrderToSheets = async (orderData) => {
    // Skip if not configured
    if (!SHEETS_CONFIG.WEB_APP_URL || SHEETS_CONFIG.WEB_APP_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL') {
        console.log('⚠️ Google Sheets not configured, skipping...');
        return { success: false, error: 'Not configured' };
    }

    try {
        const data = {
            type: 'order',
            orderId: orderData.orderId,
            date: new Date().toLocaleString(),
            customerName: orderData.customerName,
            email: orderData.customerEmail,
            phone: orderData.customerPhone,
            items: orderData.items,
            total: orderData.total,
            paymentMethod: orderData.paymentMethod,
            address: orderData.shippingAddress,
            status: 'Pending'
        };

        console.log('📊 Logging order to Google Sheets:', data);

        const response = await fetch(SHEETS_CONFIG.WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        console.log('✅ Order logged to Google Sheets successfully!');
        return { success: true };
    } catch (error) {
        console.error('❌ Failed to log order to Google Sheets:', error);
        return { success: false, error };
    }
};

export const logUserToSheets = async (userData) => {
    // Skip if not configured
    if (!SHEETS_CONFIG.WEB_APP_URL || SHEETS_CONFIG.WEB_APP_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL') {
        console.log('⚠️ Google Sheets not configured, skipping...');
        return { success: false, error: 'Not configured' };
    }

    try {
        const data = {
            type: 'user',
            userId: userData.userId,
            name: userData.name,
            email: userData.email,
            signupDate: new Date().toLocaleString(),
            lastLogin: new Date().toLocaleString()
        };

        console.log('📊 Logging user to Google Sheets:', data);

        const response = await fetch(SHEETS_CONFIG.WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        console.log('✅ User logged to Google Sheets successfully!');
        return { success: true };
    } catch (error) {
        console.error('❌ Failed to log user to Google Sheets:', error);
        return { success: false, error };
    }
};

export const logContactToSheets = async (contactData) => {
    // Skip if not configured
    if (!SHEETS_CONFIG.WEB_APP_URL || SHEETS_CONFIG.WEB_APP_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL') {
        console.log('⚠️ Google Sheets not configured, skipping...');
        return { success: false, error: 'Not configured' };
    }

    try {
        const data = {
            type: 'contact',
            date: new Date().toLocaleString(),
            firstName: contactData.firstName,
            lastName: contactData.lastName,
            email: contactData.email,
            phone: contactData.phone,
            message: contactData.message
        };

        console.log('📊 Logging contact to Google Sheets:', data);

        const response = await fetch(SHEETS_CONFIG.WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        console.log('✅ Contact logged to Google Sheets successfully!');
        return { success: true };
    } catch (error) {
        console.error('❌ Failed to log contact to Google Sheets:', error);
        return { success: false, error };
    }
};
