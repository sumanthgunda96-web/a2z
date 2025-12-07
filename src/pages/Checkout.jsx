import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Banknote, MessageCircle, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { sendOrderEmail } from '../utils/emailService';
import { logOrderToSheets } from '../utils/sheetsService';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, getCartTotal, clearCart } = useCart();
    const { currentUser } = useAuth();
    const { createOrder } = useOrders();

    const [paymentMethod, setPaymentMethod] = useState('');
    const [formData, setFormData] = useState({
        fullName: currentUser?.name || '',
        email: currentUser?.email || '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
    });
    const [loading, setLoading] = useState(false);

    if (!currentUser) {
        alert('Please login to access checkout');
        navigate('/login');
        return null;
    }

    if (cartItems.length === 0) {
        navigate('/cart');
        return null;
    }

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!paymentMethod) {
            alert('Please select a payment method');
            return;
        }

        setLoading(true);

        try {
            const order = createOrder({
                userId: currentUser.id,
                userEmail: currentUser.email,
                items: cartItems,
                total: getCartTotal(),
                shippingAddress: formData,
                paymentMethod,
            });

            const emailData = {
                orderId: order.id,
                customerName: formData.fullName,
                customerEmail: formData.email,
                customerPhone: formData.phone,
                items: cartItems.map(item => `${item.name} x${item.quantity} - ${item.price}`).join('\n'),
                total: getCartTotal().toLocaleString('en-IN'),
                paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod === 'online' ? 'Online Payment' : 'WhatsApp Order',
                shippingAddress: `${formData.fullName}\n${formData.address}\n${formData.city}, ${formData.state} - ${formData.pincode}`,
            };

            if (paymentMethod === 'whatsapp') {
                const message = `Hi! I'd like to place an order:\n\nOrder ID: ${order.id}\n\nItems:\n${cartItems.map(item => `- ${item.name} x${item.quantity} - ${item.price}`).join('\n')}\n\nTotal: ₹${getCartTotal().toLocaleString('en-IN')}\n\nShipping Address:\n${formData.fullName}\n${formData.address}\n${formData.city}, ${formData.state} - ${formData.pincode}\nPhone: ${formData.phone}`;
                const whatsappUrl = `https://wa.me/16027565160?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');

                await sendOrderEmail(emailData);
                await logOrderToSheets(emailData);
                clearCart();
                navigate(`/order-confirmation/${order.id}`);
            } else if (paymentMethod === 'cod') {
                await sendOrderEmail(emailData);
                await logOrderToSheets(emailData);
                clearCart();
                navigate(`/order-confirmation/${order.id}`);
            } else if (paymentMethod === 'online') {
                alert('Redirecting to payment gateway...');
                setTimeout(async () => {
                    await sendOrderEmail(emailData);
                    await logOrderToSheets(emailData);
                    clearCart();
                    navigate(`/order-confirmation/${order.id}`);
                }, 1500);
            }
        } catch (error) {
            alert('Error processing order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const subtotal = getCartTotal();
    const shipping = 100;
    const total = subtotal + shipping;

    return (
        <div className="min-h-screen bg-cream py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-primary font-serif mb-8">Checkout</h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-xl font-bold text-primary font-serif mb-4 flex items-center">
                                    <MapPin className="h-5 w-5 mr-2" />
                                    Shipping Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-primary mb-1">Full Name</label>
                                        <input type="text" name="fullName" required value={formData.fullName} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-secondary focus:border-secondary" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-primary mb-1">Email</label>
                                        <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-secondary focus:border-secondary" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-primary mb-1">Phone</label>
                                        <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-secondary focus:border-secondary" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-primary mb-1">Address</label>
                                        <textarea name="address" required rows="3" value={formData.address} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-secondary focus:border-secondary" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-primary mb-1">City</label>
                                        <input type="text" name="city" required value={formData.city} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-secondary focus:border-secondary" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-primary mb-1">State</label>
                                        <input type="text" name="state" required value={formData.state} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-secondary focus:border-secondary" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-primary mb-1">PIN Code</label>
                                        <input type="text" name="pincode" required value={formData.pincode} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-secondary focus:border-secondary" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-xl font-bold text-primary font-serif mb-4">Payment Method</h2>
                                <div className="space-y-3">
                                    <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'online' ? 'border-secondary bg-secondary/5' : 'border-gray-200 hover:border-secondary/50'}`}>
                                        <input type="radio" name="paymentMethod" value="online" checked={paymentMethod === 'online'} onChange={(e) => setPaymentMethod(e.target.value)} className="h-4 w-4 text-secondary focus:ring-secondary" />
                                        <CreditCard className="h-5 w-5 ml-3 mr-2 text-primary" />
                                        <span className="font-medium text-primary">Online Payment (UPI/Card/Net Banking)</span>
                                    </label>
                                    <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-secondary bg-secondary/5' : 'border-gray-200 hover:border-secondary/50'}`}>
                                        <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} className="h-4 w-4 text-secondary focus:ring-secondary" />
                                        <Banknote className="h-5 w-5 ml-3 mr-2 text-primary" />
                                        <span className="font-medium text-primary">Cash on Delivery</span>
                                    </label>
                                    <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'whatsapp' ? 'border-secondary bg-secondary/5' : 'border-gray-200 hover:border-secondary/50'}`}>
                                        <input type="radio" name="paymentMethod" value="whatsapp" checked={paymentMethod === 'whatsapp'} onChange={(e) => setPaymentMethod(e.target.value)} className="h-4 w-4 text-secondary focus:ring-secondary" />
                                        <MessageCircle className="h-5 w-5 ml-3 mr-2 text-primary" />
                                        <span className="font-medium text-primary">Order via WhatsApp</span>
                                    </label>
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className="w-full bg-primary text-white py-4 px-6 rounded-xl hover:bg-primary-dark transition-all duration-300 font-medium shadow-md hover:shadow-lg transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                                {loading ? 'Processing...' : 'Place Order'}
                            </button>
                        </form>
                    </div>
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
                            <h2 className="text-xl font-bold text-primary font-serif mb-4">Order Summary</h2>
                            <div className="space-y-3 mb-4">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span className="text-slate-light">{item.name} x{item.quantity}</span>
                                        <span className="font-medium text-primary">{item.price}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-200 pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-light">Subtotal</span>
                                    <span className="font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-light">Shipping</span>
                                    <span className="font-medium">₹{shipping}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                                    <span className="text-primary">Total</span>
                                    <span className="text-secondary">₹{total.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
