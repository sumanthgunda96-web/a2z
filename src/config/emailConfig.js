// EmailJS Configuration
// You need to set up your EmailJS account and get these values

export const EMAILJS_CONFIG = {
    // Get these from https://dashboard.emailjs.com/admin
    SERVICE_ID: 'service_eufkkjc',

    // Template for ADMIN notifications (you receive these)
    ADMIN_TEMPLATE_ID: 'template_u8bfo6g',

    // Template for CUSTOMER confirmations (customer receives these)
    // Create a second template in EmailJS for this
    CUSTOMER_TEMPLATE_ID: 'template_u8bfo6g', // Use same for now, create separate later

    // Template for EMAIL VERIFICATION (new users)
    // Create this template in EmailJS dashboard
    VERIFICATION_TEMPLATE_ID: 'template_o7ofxhs', // Use same for now, create separate later

    PUBLIC_KEY: '4gK663kzj8v9QqRGJ',

    // Business email to receive orders
    BUSINESS_EMAIL: 'sumanthgunda96@gmail.com',
};

// Template variables that will be sent to EmailJS
// Make sure your EmailJS template uses these variable names:
// {{order_id}}, {{customer_name}}, {{customer_email}}, {{customer_phone}}
// {{items}}, {{total}}, {{payment_method}}, {{shipping_address}}
