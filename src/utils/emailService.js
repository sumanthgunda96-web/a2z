import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../config/emailConfig';

export const sendOrderEmail = async (orderData) => {
    try {
        const templateParams = {
            reply_to: orderData.customerEmail,
            order_id: orderData.orderId,
            customer_name: orderData.customerName,
            customer_email: orderData.customerEmail,
            customer_phone: orderData.customerPhone,
            items: orderData.items,
            total: orderData.total,
            payment_method: orderData.paymentMethod,
            shipping_address: orderData.shippingAddress,
            order_date: new Date().toLocaleString(),
        };

        console.log('📧 Sending order email...');
        console.log('📧 Customer:', orderData.customerEmail);
        console.log('📧 Params:', templateParams);

        const response = await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.CUSTOMER_TEMPLATE_ID,
            templateParams,
            EMAILJS_CONFIG.PUBLIC_KEY
        );

        console.log('✅ Email sent successfully!', response.status);
        alert(`✅ Order confirmation email sent!`);

        return { success: true, response };
    } catch (error) {
        console.error('❌ Failed to send email:', error);
        alert(`⚠️ Order placed but email failed. Error: ${error.text || error.message}`);
        return { success: false, error };
    }
};

export const sendVerificationEmail = async (email, code) => {
    try {
        const templateParams = {
            to_email: email,
            verification_code: code,
            expiry_minutes: '10',
        };

        console.log('📧 Sending verification code to:', email);

        const response = await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.VERIFICATION_TEMPLATE_ID,
            templateParams,
            EMAILJS_CONFIG.PUBLIC_KEY
        );

        console.log('✅ Verification email sent!', response.status);
        return { success: true, response };
    } catch (error) {
        console.error('❌ Failed to send verification email:', error);
        return { success: false, error: error.text || error.message };
    }
};
