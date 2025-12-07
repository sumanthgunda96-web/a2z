import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, MapPin, CreditCard } from 'lucide-react';
import { useOrders } from '../context/OrderContext';

const OrderConfirmation = () => {
    const { orderId } = useParams();
    const { getOrderById } = useOrders();

    const order = getOrderById(orderId);

    if (!order) {
        return (
            <div className="min-h-screen bg-cream py-12 px-4 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-primary">Order not found</h2>
                    <Link to="/" className="text-secondary hover:underline mt-4 inline-block">
                        Go to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center mb-8">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-primary font-serif mb-2">Order Confirmed!</h1>
                    <p className="text-slate-light mb-4">
                        Thank you for your order. We'll send you a confirmation email shortly.
                    </p>
                    <div className="bg-gray-50 rounded-xl p-4 inline-block">
                        <p className="text-sm text-slate-light">Order ID</p>
                        <p className="text-xl font-bold text-primary font-mono">{order.id}</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <h2 className="text-xl font-bold text-primary font-serif mb-4 flex items-center">
                        <Package className="h-5 w-5 mr-2" />
                        Order Items
                    </h2>
                    <div className="space-y-4">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0">
                                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                                <div className="flex-1">
                                    <h3 className="font-bold text-primary">{item.name}</h3>
                                    <p className="text-sm text-slate-light">Quantity: {item.quantity}</p>
                                </div>
                                <p className="font-bold text-secondary">{item.price}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
                        <span className="text-lg font-medium">Total</span>
                        <span className="text-2xl font-bold text-secondary">₹{order.total.toLocaleString('en-IN')}</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <h2 className="text-xl font-bold text-primary font-serif mb-4 flex items-center">
                        <MapPin className="h-5 w-5 mr-2" />
                        Shipping Address
                    </h2>
                    <div className="text-slate-light">
                        <p className="font-medium text-primary">{order.shippingAddress.fullName}</p>
                        <p>{order.shippingAddress.address}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                        <p className="mt-2">Phone: {order.shippingAddress.phone}</p>
                        <p>Email: {order.shippingAddress.email}</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-bold text-primary font-serif mb-4 flex items-center">
                        <CreditCard className="h-5 w-5 mr-2" />
                        Payment Method
                    </h2>
                    <p className="text-slate-light capitalize">
                        {order.paymentMethod === 'cod' && 'Cash on Delivery'}
                        {order.paymentMethod === 'online' && 'Online Payment'}
                        {order.paymentMethod === 'whatsapp' && 'WhatsApp Order'}
                    </p>
                </div>

                <div className="flex gap-4">
                    <Link to={`/order-tracking/${order.id}`} className="flex-1 bg-secondary text-white py-3 px-6 rounded-xl hover:bg-secondary-dark transition-all text-center font-medium">
                        Track Order
                    </Link>
                    <Link to="/my-orders" className="flex-1 bg-primary text-white py-3 px-6 rounded-xl hover:bg-primary-dark transition-all text-center font-medium">
                        View All Orders
                    </Link>
                </div>
                <Link to="/" className="block text-center mt-4 text-slate-light hover:text-primary transition-colors">
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
};

export default OrderConfirmation;
