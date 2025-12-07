// Verification Code Service
// Generates and validates verification codes for email verification

export const generateVerificationCode = () => {
    // Generate 6-digit code
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const storeVerificationCode = (email, code) => {
    const verificationData = {
        code,
        email,
        expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    };

    localStorage.setItem(`verification_${email}`, JSON.stringify(verificationData));
    console.log('📝 Verification code stored for:', email);
};

export const verifyCode = (email, inputCode) => {
    const storedData = localStorage.getItem(`verification_${email}`);

    if (!storedData) {
        return { success: false, error: 'No verification code found. Please request a new code.' };
    }

    const { code, expiresAt } = JSON.parse(storedData);

    // Check if expired
    if (Date.now() > expiresAt) {
        localStorage.removeItem(`verification_${email}`);
        return { success: false, error: 'Verification code expired. Please request a new code.' };
    }

    // Check if code matches
    if (code !== inputCode.trim()) {
        return { success: false, error: 'Invalid verification code. Please try again.' };
    }

    // Success - remove code
    localStorage.removeItem(`verification_${email}`);
    return { success: true };
};

export const clearVerificationCode = (email) => {
    localStorage.removeItem(`verification_${email}`);
};
