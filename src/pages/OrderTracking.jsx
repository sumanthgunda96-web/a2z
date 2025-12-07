import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, MapPin, CreditCard, CheckCircle, Truck, Home } from 'lucide-react';
import { useOrders } from '../context/OrderContext';

const OrderTracking = () => {
    const { orderId } = useParams();
    const { getOrderById } = useOrders();

    const order = getOrderById(orderId);

    if (!order) {
        return (
            <div className="min-h-screen bg-cream py-12 px-4 flex items-center justify-center">
                <div className="text-center">
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-primary mb-2">Order not found</h2>
                    <p className="text-slate-light mb-4">We couldn't find an order with this ID.</p>
                    <Link to="/my-orders" className="text-secondary hover:underline">
                        View All Orders
                    </Link>
                </div>
            </div>
        );
    }

    // Use actual order status set by admin
    const currentStatus = order.status || 'pending';

    const statusSteps = [
        { key: 'pending', label: 'Order Placed', icon: CheckCircle, time: order.createdAt },
        { key: 'confirmed', label: 'Confirmed', icon: Package, time: null },
        { key: 'shipped', label: 'Shipped', icon: Truck, time: null },
        { key: 'delivered', label: 'Delivered', icon: Home, time: null },
    ];

    const getStepStatus = (stepKey) => {
        const stepIndex = statusSteps.findIndex(s => s.key === stepKey);
        const currentIndex = statusSteps.findIndex(s => s.key === currentStatus);

        if (stepIndex < currentIndex) return 'completed';
        if (stepIndex === currentIndex) return 'current';
        return 'pending';
    };

    return (
        <div className="min-h-screen bg-cream py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link to="/my-orders" className="text-secondary hover:underline mb-4 inline-block">
                        ← Back to Orders
                    </Link>
                    <h1 className="text-3xl font-bold text-primary font-serif">Track Order</h1>
                    <p className="text-slate-light mt-2">Order ID: <span className="font-mono font-bold text-primary">{order.id}</span></p>
                </div>

                {/* Order Status Timeline */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                    <h2 className="text-xl font-bold text-primary font-serif mb-6">Order Status</h2>

                    <div className="relative">
                        {/* Progress Line */}
                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                        <div
                            className="absolute left-6 top-0 w-0.5 bg-secondary transition-all duration-500"
                            style={{
                                height: `${(statusSteps.findIndex(s => s.key === currentStatus) / (statusSteps.length - 1)) * 100}%`
                            }}
                        ></div>

                        {/* Status Steps */}
                        <div className="space-y-8">
                            {statusSteps.map((step) => {
                                const status = getStepStatus(step.key);
                                const Icon = step.icon;

                                return (
                                    <div key={step.key} className="relative flex items-start">
                                        {/* Icon */}
                                        <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 ${status === 'completed' ? 'bg-secondary border-secondary' :
                                                status === 'current' ? 'bg-white border-secondary' :
                                                    'bg-white border-gray-200'
                                            }`}>
                                            <Icon className={`h-6 w-6 ${status === 'completed' ? 'text-white' :
                                                    status === 'current' ? 'text-secondary' :
                                                        'text-gray-400'
                                                }`} />
                                        </div>

                                        {/* Content */}
                                        <div className="ml-6 flex-1">
                                            <h3 className={`text-lg font-bold ${status === 'pending' ? 'text-gray-400' : 'text-primary'}`}>
                                                {step.label}
                                            </h3>
                                            {step.time && (
                                                <p className="text-sm text-slate-light mt-1">
                                                    {new Date(step.time).toLocaleString()}
                                                </p>
                                            )}
                                            {status === 'current' && (
                                                <p className="text-sm text-secondary mt-1 font-medium">In Progress</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Order Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Shipping Address */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h2 className="text-lg font-bold text-primary font-serif mb-4 flex items-center">
                            <MapPin className="h-5 w-5 mr-2" />
                            Shipping Address
                        </h2>
                        <div className="text-slate-light text-sm">
                            <p className="font-medium text-primary">{order.shippingAddress.fullName}</p>
                            <p>{order.shippingAddress.address}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                            <p className="mt-2">Phone: {order.shippingAddress.phone}</p>
                            <p>Email: {order.shippingAddress.email}</p>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h2 className="text-lg font-bold text-primary font-serif mb-4 flex items-center">
                            <CreditCard className="h-5 w-5 mr-2" />
                            Payment Information
                        </h2>
                        <div className="text-slate-light text-sm">
                            <p className="font-medium text-primary capitalize">
                                {order.paymentMethod === 'cod' && 'Cash on Delivery'}
                                {order.paymentMethod === 'online' && 'Online Payment'}
                                {order.paymentMethod === 'whatsapp' && 'WhatsApp Order'}
                            </p>
                            <p className="mt-2">Total Amount: <span className="font-bold text-secondary text-lg">₹{order.total.toLocaleString('en-IN')}</span></p>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-lg font-bold text-primary font-serif mb-4 flex items-center">
                        <Package className="h-5 w-5 mr-2" />
                        Order Items
                    </h2>
                    <div className="space-y-4">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                    <h3 className="font-bold text-primary">{item.name}</h3>
                                    <p className="text-sm text-slate-light">Quantity: {item.quantity}</p>
                                </div>
                                <p className="font-bold text-secondary">{item.price}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;
